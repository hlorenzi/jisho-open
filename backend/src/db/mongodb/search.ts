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

    const tagFilter = makeTagFilter(options)

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

    const tagFilter = makeTagFilter(options)

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

    const tagFilter = makeTagFilter(options)
        
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

    for (const step of inflections.flat())
        dbFindQueries.push({
            [MongoDb.fieldWordLookUpHeadingsText]: step.sourceTerm,
            [MongoDb.fieldWordLookUpTags]: step.sourceCategory,
        })

    const tagFilter = makeTagFilter(options)
        
    const dbResults = await state.collWords
        .find({ $or: dbFindQueries, ...tagFilter })
        .sort({ [`${fieldLookUp}.${fieldLen}`]: -1, score: -1, _id: 1 })
        .limit(Math.min(options.limit, 1000))
        .toArray()

    const apiResults: Api.Word.Entry[] = []
        
    // Attach the inflection paths to the results,
    // respecting the part-of-speech categories.
    for (const dbResult of dbResults)
    {
        const apiResult = MongoDb.translateDbWordToApiWord(dbResult)

        const resultInfls = []
        const alreadySeen = new Set<string>()
        for (const infl of inflections)
        {
            for (let i = 0; i < infl.length; i++)
            {
                if (dbResult.lookUp.headings.find(h => h.text == infl[i].sourceTerm) &&
                    dbResult.lookUp.tags.find(t => t == infl[i].sourceCategory))
                {
                    const inflSlice = infl.slice(i)

                    const key = inflSlice
                        .map(s => `${ s.ruleId };${ s.sourceTerm };${ s.targetTerm }`)
                        .join(";")
                    
                    if (alreadySeen.has(key))
                        continue

                    alreadySeen.add(key)
                    resultInfls.push(inflSlice)
                }
            }
        }

        apiResult.inflections = resultInfls

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

    const tagFilter = makeTagFilter(options)

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
    if (!options.tags ||
        options.tags.size === 0)
        return []

    const tagFilter = makeTagFilter(options)

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
    const queriesFiltered = queries
        .filter(q => q
            .replace(/\?/g, "")
            .replace(/\*/g, "")
            .trim()
            .length !== 0)

    if (queriesFiltered.length === 0)
        return []
    

    const regexes = queriesFiltered.map(q =>
        "^" +
        q
            .replace(/\?/g, "(.)")
            .replace(/\*/g, "(.*?)") +
        "$")

    const dbFind: any[] = []
    for (const regex of regexes)
        dbFind.push({ [MongoDb.fieldWordLookUpHeadingsText]: { $regex: regex } })
        
    const tagFilter = makeTagFilter(options)

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

    const tagFilter = makeTagFilter(options)

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

    const tagFilter = makeTagFilter(options)

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

    const tagFilter = makeTagFilter(options)

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


export async function searchKanjiByComponents(
    state: MongoDb.State,
    components: string[],
    onlyCommon: boolean)
    : Promise<Api.KanjiByComponents.Kanji[]>
{
    if (components.length === 0)
        return []

    type Projected = Pick<
        MongoDb.DbKanjiEntry,
        "_id" | "strokeCount" | "components" | "score">

    let results = await state.collKanji
        .find({ [MongoDb.fieldKanjiComponents]: { $all: components } })
        .project<Projected>({
            ["_id" satisfies keyof Projected]: 1,
            ["strokeCount" satisfies keyof Projected]: 1,
            ["components" satisfies keyof Projected]: 1,
            ["score" satisfies keyof Projected]: 1,
        })
        .limit(10000)
        .toArray()

    if (onlyCommon)
        results = results.filter(
            r => r.score !== undefined && r.score > 0)

    return results.map(r => ({
        id: r._id,
        strokeCount: r.strokeCount,
        components: r.components ?? [],
    }))
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
    options: Db.SearchOptions)
    : any
{
    const dbFilter: any = {}

    if (options.tags !== undefined &&
        options.tags.size > 0)
        dbFilter.$all = [...options.tags]

    if (options.inverseTags !== undefined &&
        options.inverseTags.size > 0)
        dbFilter.$nin = [...options.inverseTags]

    if (Object.keys(dbFilter).length === 0)
        return {}

    return { [MongoDb.fieldWordLookUpTags]: dbFilter }
}