import * as MongoDb from "./index.ts"
import * as Api from "common/api/index.ts"
import * as Inflection from "common/inflection.ts"


export async function searchByHeading(
    state: MongoDb.State,
    queries: string[])
    : Promise<Api.Word.Entry[]>
{
    if (queries.length === 0)
        return []

    const results = await state.collWords
        .find({ [MongoDb.fieldLookUpHeadingsText]: { $in: queries } })
        // Sorted automatically by the index
        //.sort({ lookUp.headings.score: -1 })
        .toArray()

    return results.map(MongoDb.translateDbWordToApiWord)
}


export async function searchByHeadingPrefix(
    state: MongoDb.State,
    queries: string[])
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
        
    const results = await state.collWords
        .find({ $or: dbFindQueries })
        .sort({ score: -1 })
        .limit(100)
        .toArray()
        
    return results.map(MongoDb.translateDbWordToApiWord)
}


export async function searchByInflections(
    state: MongoDb.State,
    inflections: Inflection.Breakdown)
    : Promise<Api.Word.Entry[]>
{
    if (inflections.length === 0)
        return []

    const fieldLookUp = "lookUp" satisfies keyof MongoDb.DbWordEntry
    const fieldPos = "pos" satisfies keyof MongoDb.DbWordEntry["lookUp"]
    const fieldLen = "len" satisfies keyof MongoDb.DbWordEntry["lookUp"]

    const dbFindQueries: any[] = []
    for (const infl of inflections)
        dbFindQueries.push({
            [MongoDb.fieldLookUpHeadingsText]: infl[0].sourceTerm,
            [`${fieldLookUp}.${fieldPos}`]: infl[0].sourceCategory,
        })
        
    const dbResults = await state.collWords
        .find({ $or: dbFindQueries })
        .sort({ [`${fieldLookUp}.${fieldLen}`]: -1, score: -1 })
        .toArray()

    const apiResults: Api.Word.Entry[] = []
        
    for (const dbResult of dbResults)
    {
        const apiResult = MongoDb.translateDbWordToApiWord(dbResult)

        apiResult.inflections = inflections.filter(infl =>
            dbResult.lookUp.headings.find(h => h.text == infl[0].sourceTerm) &&
            dbResult.lookUp.pos.find(p => p == infl[0].sourceCategory))

        apiResults.push(apiResult)
    }

    return apiResults
}


export async function searchByDefinition(
    state: MongoDb.State,
    query: string)
{
    const queryWords = query
        .split(/\s/)
        .map(w => w.trim().toLowerCase())
        .filter(w => !!w)

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

    return wordEntriesDedup.map(MongoDb.translateDbWordToApiWord)
}