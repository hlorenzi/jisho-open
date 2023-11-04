import * as MongoDb from "./index.ts"
import * as Api from "common/api/index.ts"
import * as Inflection from "common/inflection.ts"


export async function searchByHeading(
    state: MongoDb.State,
    queries: string[],
    tags: Set<string>,
    inverseTags: Set<string>)
    : Promise<Api.Word.Entry[]>
{
    if (queries.length === 0)
        return []

    const tagFilter = makeTagFilter(tags, inverseTags)

    // Sorted automatically by the index for `lookUp.headings.score`
    const results = await state.collWords
        .find({
            [MongoDb.fieldLookUpHeadingsText]: { $in: queries },
            ...tagFilter,
        })
        .toArray()

    return results
        .map(MongoDb.translateDbWordToApiWord)
}


export async function searchByHeadingPrefix(
    state: MongoDb.State,
    queries: string[],
    tags: Set<string>,
    inverseTags: Set<string>)
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
            [MongoDb.fieldLookUpHeadingsText]: { $regex: "^" + query + "." },
        })
    }

    const tagFilter = makeTagFilter(tags, inverseTags)
        
    const results = await state.collWords
        .find({ $or: dbFindQueries, ...tagFilter })
        .sort({ score: -1 })
        .limit(100)
        .toArray()
        
    return results
        .map(MongoDb.translateDbWordToApiWord)
}


export async function searchByInflections(
    state: MongoDb.State,
    inflections: Inflection.Breakdown,
    tags: Set<string>,
    inverseTags: Set<string>)
    : Promise<Api.Word.Entry[]>
{
    if (inflections.length === 0)
        return []

    const fieldLookUp = "lookUp" satisfies keyof MongoDb.DbWordEntry
    const fieldLen = "len" satisfies keyof MongoDb.DbWordEntry["lookUp"]

    const dbFindQueries: any[] = []
    for (const infl of inflections)
        dbFindQueries.push({
            [MongoDb.fieldLookUpHeadingsText]: infl[0].sourceTerm,
            [MongoDb.fieldLookUpTags]: infl[0].sourceCategory,
        })

    const tagFilter = makeTagFilter(tags, inverseTags)
        
    let dbResults = await state.collWords
        .find({ $or: dbFindQueries, ...tagFilter })
        .sort({ [`${fieldLookUp}.${fieldLen}`]: -1, score: -1 })
        .toArray()

    dbResults = dbResults
        .filter(r => r.lookUp.tags.every(t => !inverseTags.has(t)))

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
    query: string,
    tags: Set<string>,
    inverseTags: Set<string>)
{
    const queryWords = query
        .split(/\s/)
        .map(w => w.trim().toLowerCase())
        .filter(w => w.length !== 0)

    const tagFilter = makeTagFilter(tags, inverseTags)

    const wordEntries = await state.collDefinitions.aggregate<MongoDb.DbWordEntry>([
        { $match: { words: { $all: queryWords } } },
        { $sort: { score: -1 } },
        { $limit: 500 },
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
        .filter(r => r.lookUp.tags.every(t => !inverseTags.has(t)))
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

    return { [MongoDb.fieldLookUpTags]: dbFilter }
}