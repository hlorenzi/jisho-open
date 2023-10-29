import * as MongoDb from "./index.ts"
import * as Api from "common/api/index.ts"


export async function searchByHeading(
    state: MongoDb.State,
    queries: string[])
    : Promise<Api.Word.Entry[]>
{
    if (queries.length === 0)
        return []

    const fieldLookUp = "lookUp" satisfies keyof MongoDb.DbWordEntry
    const fieldHeadings = "headings" satisfies keyof MongoDb.DbWordEntry["lookUp"]

    const results = await state.collWords
        .find({ [`${fieldLookUp}.${fieldHeadings}`]: { $in: queries } })
        .sort({ score: -1 })
        .toArray()

    return results.map(MongoDb.translateDbWordToApiWord)
}


export async function searchByHeadingPrefix(
    state: MongoDb.State,
    query: string)
    : Promise<Api.Word.Entry[]>
{
    const fieldLookUp = "lookUp" satisfies keyof MongoDb.DbWordEntry
    const fieldHeadings = "headings" satisfies keyof MongoDb.DbWordEntry["lookUp"]

    const results = await state.collWords
        .find({ [`${fieldLookUp}.${fieldHeadings}`]: { $regex: "^" + query + "." } })
        .sort({ score: -1 })
        .limit(100)
        .toArray()
        
    return results.map(MongoDb.translateDbWordToApiWord)
}