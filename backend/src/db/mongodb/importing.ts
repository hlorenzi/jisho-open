import * as MongoDb from "./index.ts"
import * as Api from "common/api/index.ts"
import * as Jmdict from "../../importing/jmdict.ts"


export async function importWords(
    state: MongoDb.State,
    words: Api.Word.Entry[])
    : Promise<void>
{
    const dbEntries = words.map(translateApiWordToDbWord)

    if (dbEntries.length === 0)
        return

    await state.collWords.deleteMany(
        { _id: { $in: dbEntries.map(e => e._id) }})

    const res = await state.collWords.insertMany(dbEntries)

    if (res.insertedCount !== dbEntries.length)
        throw `MongoDb.importWords failed`

    //if (dbLuSenseEntryBuffer.length != 0)
    //    await db.collection("words_luSense").insertMany(dbLuSenseEntryBuffer)
}


function translateApiWordToDbWord(
    apiWord: Api.Word.Entry)
    : MongoDb.DbWordEntry
{
    // Prepare look-up tables for DB indexing
    const lookUp: MongoDb.DbWordEntry["lookUp"] = {
        headings: Jmdict.gatherLookUpHeadings(apiWord),
        pos: [...new Set(
            apiWord.defs
            .flatMap(d => d.pos)
        )],
    }

    // Add and remove fields via destructuring assignment
    const {
        id,
        ...dbWord
    } = {
        ...apiWord,
        _id: apiWord.id,
        lookUp,
    }

    return dbWord
}