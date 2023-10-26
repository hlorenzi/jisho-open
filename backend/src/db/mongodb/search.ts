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
        .toArray()

    return results.map(r => ({
        ...r,
        id: r._id,
    }))
}