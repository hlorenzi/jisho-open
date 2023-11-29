import * as MongoDb from "./index.ts"
import * as Api from "common/api/index.ts"
import * as Jmdict from "../../importing/jmdict.ts"


export async function importKanjiWordCrossRefEntry(
    state: MongoDb.State,
    apiEntries: Api.KanjiWordCrossRef.Entry[])
    : Promise<void>
{
    const dbEntries = apiEntries.map(translateKanjiWordApiToDb)

    if (dbEntries.length === 0)
        return
    

    await state.collKanjiWords.deleteMany(
        { _id: { $in: dbEntries.map(e => e._id) }})

    const res = await state.collKanjiWords.insertMany(dbEntries)

    if (res.insertedCount !== dbEntries.length)
        throw `MongoDb.importKanjiWordCrossRefEntry failed`
}


function translateKanjiWordApiToDb(
    apiEntry: Api.KanjiWordCrossRef.Entry)
    : MongoDb.DbKanjiWordEntry
{
    // Add and remove fields via destructuring assignment
    const {
        id,
        ...dbKanji
    } = {
        ...apiEntry,
        _id: apiEntry.id,
    }

    return dbKanji
}