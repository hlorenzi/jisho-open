import * as Db from "../index.ts"
import * as MongoDb from "./index.ts"
import * as Api from "common/api/index.ts"
import * as Inflection from "common/inflection.ts"


export async function searchByHeading(
    state: MongoDb.State,
    queries: string[],
    options: Db.SearchOptions)
    : Promise<Api.Word.Entry[]>
{
    if (queries.length === 0)
        return []

    const tagFilter = makeTagFilter(options.tags, options.inverseTags)

    // Sorted automatically by the index for `lookUp.headings.score`
    const results = await state.collWords
        .find({
            [MongoDb.fieldWordLookUpHeadingsText]: { $in: queries },
            ...tagFilter,
        })
        .limit(options.limit)
        .toArray()

    return results
        .map(MongoDb.translateDbWordToApiWord)
}


export async function searchByHeadingAll(
    state: MongoDb.State,
    queries: string[],
    options: Db.SearchOptions)
    : Promise<Api.Word.Entry[]>
{
    if (queries.length === 0)
        return []

    const tagFilter = makeTagFilter(options.tags, options.inverseTags)

    // Sorted automatically by the index for `lookUp.headings.score`
    const results = await state.collWords
        .find({
            [MongoDb.fieldWordLookUpHeadingsText]: { $all: queries },
            ...tagFilter,
        })
        .limit(options.limit)
        .toArray()

    return results
        .map(MongoDb.translateDbWordToApiWord)
}


export async function searchByHeadingPrefix(
    state: MongoDb.State,
    queries: string[],
    options: Db.SearchOptions)
    : Promise<Api.Word.Entry[]>
{
    if (queries.length === 0)
        return []

    const dbFindQueries: any[] = []
    for (const query of queries)
    {
        if (query.length === 0)
            continue

        dbFindQueries.push({
            [MongoDb.fieldWordLookUpHeadingsText]: { $regex: "^" + query + "." },
        })
    }

    if (dbFindQueries.length === 0)
        return []

    const tagFilter = makeTagFilter(options.tags, options.inverseTags)
        
    const results = await state.collWords
        .find({ $or: dbFindQueries, ...tagFilter })
        .sort({ score: -1, _id: 1 })
        .limit(Math.min(options.limit, 1000))
        .toArray()
        
    return results
        .map(MongoDb.translateDbWordToApiWord)
}


export async function searchByInflections(
    state: MongoDb.State,
    inflections: Inflection.Breakdown,
    options: Db.SearchOptions)
    : Promise<Api.Word.Entry[]>
{
    if (inflections.length === 0)
        return []

    const fieldLookUp = "lookUp" satisfies keyof MongoDb.DbWordEntry
    const fieldLen = "len" satisfies keyof MongoDb.DbWordEntry["lookUp"]

    const dbFindQueries: any[] = []
    for (const infl of inflections)
        dbFindQueries.push({
            [MongoDb.fieldWordLookUpHeadingsText]: infl[0].sourceTerm,
            [MongoDb.fieldWordLookUpTags]: infl[0].sourceCategory,
        })

    const tagFilter = makeTagFilter(options.tags, options.inverseTags)
        
    const dbResults = await state.collWords
        .find({ $or: dbFindQueries, ...tagFilter })
        .sort({ [`${fieldLookUp}.${fieldLen}`]: -1, score: -1, _id: 1 })
        .limit(Math.min(options.limit, 1000))
        .toArray()

    const apiResults: Api.Word.Entry[] = []
        
    for (const dbResult of dbResults)
    {
        const apiResult = MongoDb.translateDbWordToApiWord(dbResult)

        apiResult.inflections = inflections.filter(infl =>
            dbResult.lookUp.headings.find(h => h.text == infl[0].sourceTerm) &&
            dbResult.lookUp.tags.find(t => t == infl[0].sourceCategory))

        apiResults.push(apiResult)
    }

    return apiResults
}


export async function searchByDefinition(
    state: MongoDb.State,
    queries: string[],
    options: Db.SearchOptions)
{
    if (queries.length === 0)
        return []

    const tagFilter = makeTagFilter(options.tags, options.inverseTags)

    const wordEntries = await state.collDefinitions.aggregate<MongoDb.DbWordEntry>([
        { $match: { words: { $all: queries } } },
        { $sort: { score: -1, _id: 1 } },
        { $limit: 1000 },
        { $project: { _id: 0, wordId: 1 } },
        { $lookup: {
            from: "words",
            localField: "wordId",
            foreignField: "_id",
            as: "word",
        }},
        { $project: { word: 1 } },
        { $unwind: "$word" },
        { $replaceRoot: { newRoot: "$word" } },
        { $match: tagFilter },
        { $limit: 1000 },
    ]).toArray()

    const wordIds = new Set()
    const wordEntriesDedup: MongoDb.DbWordEntry[] = []
    for (const wordEntry of wordEntries)
    {
        if (wordIds.has(wordEntry._id))
            continue

        wordIds.add(wordEntry._id)
        wordEntriesDedup.push(wordEntry)
    } 

    return wordEntriesDedup
        .slice(0, Math.min(options.limit, 1000))
        .map(MongoDb.translateDbWordToApiWord)
}


export async function searchByTags(
    state: MongoDb.State,
    options: Db.SearchOptions)
    : Promise<Api.Word.Entry[]>
{
    if (options.tags.size === 0)
        return []

    const tagFilter = makeTagFilter(options.tags, options.inverseTags)

    const results = await state.collWords
        .find(tagFilter)
        .sort({ score: -1, _id: 1 })
        .limit(options.limit)
        .toArray()

    return results
        .map(MongoDb.translateDbWordToApiWord)
}


export async function searchByWildcards(
    state: MongoDb.State,
    queries: string[],
    options: Db.SearchOptions)
    : Promise<Api.Word.Entry[]>
{
    const regexes = queries.map(q =>
        "^" +
        q
            .replace(/\?/g, "(.)")
            .replace(/\*/g, "(.*?)") +
        "$")

    const dbFind: any[] = []
    for (const regex of regexes)
        dbFind.push({ [MongoDb.fieldWordLookUpHeadingsText]: { $regex: regex } })
        
    const tagFilter = makeTagFilter(options.tags, options.inverseTags)

    const results = await state.collWords.aggregate([
        //{ $match: { chars: { $all: regexCharsFilter } } },
        { $match: { $or: dbFind } },
        { $match: tagFilter },
        { $sort: { score: -1, _id: 1 } },
        { $limit: Math.min(options.limit, 1000) },
    ]).toArray()

    return results
        .map(MongoDb.translateDbWordToApiWord)
}


export async function searchKanji(
    state: MongoDb.State,
    kanjiString: string,
    options: Db.SearchOptions)
    : Promise<Api.Kanji.Entry[]>
{
    if (kanjiString.length === 0)
        return []

    const tagFilter = makeTagFilter(options.tags, options.inverseTags)

    const kanjiChars = [...kanjiString]

    const results = await state.collKanji
        .find({
            _id: { $in: kanjiChars },
            ...tagFilter,
        })
        .limit(Math.min(options.limit, 1000))
        .toArray()

    // Sort by the order in the query.
    const kanjiOrdering = new Map<string, number>()
    kanjiChars.forEach((c, i) => kanjiOrdering.set(c, i))
    
    return results
        .map(MongoDb.translateDbKanjiToApiKanji)
        .sort((a, b) => kanjiOrdering.get(a.id)! - kanjiOrdering.get(b.id)!)
}


export async function searchKanjiByReading(
    state: MongoDb.State,
    queries: string[],
    options: Db.SearchOptions)
    : Promise<Api.Kanji.Entry[]>
{
    if (queries.length === 0)
        return []

    const tagFilter = makeTagFilter(options.tags, options.inverseTags)

    // Sorted automatically by the index.
    const results = await state.collKanji
        .find({
            [MongoDb.fieldKanjiReadingsText]: { $all: queries },
            ...tagFilter,
        })
        .limit(Math.min(options.limit, 1000))
        .toArray()

    return results
        .map(MongoDb.translateDbKanjiToApiKanji)
}


export async function searchKanjiByMeaning(
    state: MongoDb.State,
    queries: string[],
    options: Db.SearchOptions)
    : Promise<Api.Kanji.Entry[]>
{
    if (queries.length === 0)
        return []

    const tagFilter = makeTagFilter(options.tags, options.inverseTags)

    // Sorted automatically by the index.
    const results = await state.collKanji
        .find({
            [MongoDb.fieldKanjiLookUpMeanings]: { $all: queries },
            ...tagFilter,
        })
        .limit(Math.min(options.limit, 1000))
        .toArray()

    return results
        .map(MongoDb.translateDbKanjiToApiKanji)
}


export async function listKanjiWordCrossRefEntries(
    state: MongoDb.State,
    kanjiString: string)
    : Promise<Api.KanjiWordCrossRef.Entry[]>
{
    const kanjiChars = [...kanjiString]

    if (kanjiChars.length === 0)
        return []

    const results = await state.collKanjiWords
        .find({ _id: { $in: kanjiChars }})
        .toArray()

    // Sort by the order in the query.
    const kanjiOrdering = new Map<string, number>()
    kanjiChars.forEach((c, i) => kanjiOrdering.set(c, i))
    
    return results
        .map(MongoDb.translateDbKanjiWordToApiKanjiWord)
        .sort((a, b) => kanjiOrdering.get(a.id)! - kanjiOrdering.get(b.id)!)
}


export async function listAllKanji(
    state: MongoDb.State)
    : Promise<Api.Kanji.Entry[]>
{
    const dbKanji = await state.collKanji
        .find({})
        .toArray()

    return dbKanji
        .map(MongoDb.translateDbKanjiToApiKanji)
}


export async function listWordsWithChars(
    state: MongoDb.State,
    chars: string[])
    : Promise<Api.Word.Entry[]>
{
    const dbWord = await state.collWords
        .find({ [MongoDb.fieldWordLookUpChars]: { $all: chars } })
        .toArray()

    return dbWord
        .map(MongoDb.translateDbWordToApiWord)
}


function makeTagFilter(
    tags: Set<string>,
    inverseTags: Set<string>)
    : any
{
    const dbFilter: any = {}

    if (tags.size > 0)
        dbFilter.$all = [...tags]

    if (inverseTags.size > 0)
        dbFilter.$nin = [...inverseTags]

    if (Object.keys(dbFilter).length === 0)
        return {}

    return { [MongoDb.fieldWordLookUpTags]: dbFilter }
}