import * as MongoDb from "./index.ts"
import * as Api from "common/api/index.ts"


export async function importWords(
    state: MongoDb.State,
    words: Api.Word.Entry[])
    : Promise<void>
{
    const dbEntries = words.map(w => ({
        _id: w.id,
        headings: w.headings,
        defs: w.defs,
        lookUp: {
            headings: [...new Set(
                w.headings
                .flatMap(h => [h.base, h.reading])
                .filter(h => h !== undefined) as string[]
            )],
            pos: [...new Set(
                w.defs
                .flatMap(d => d.pos)
            )],
        }
    } satisfies MongoDb.DbWordEntry))

    if (words.length === 0)
        return

    await state.collWords.deleteMany(
        { _id: { $in: dbEntries.map(e => e._id) }})

    const res = await state.collWords.insertMany(
        dbEntries,
        {
            ignoreUndefined: true,
        })

    if (res.insertedCount !== words.length)
        throw `MongoDb.importWords failed`

    //if (dbLuSenseEntryBuffer.length != 0)
    //    await db.collection("words_luSense").insertMany(dbLuSenseEntryBuffer)
}