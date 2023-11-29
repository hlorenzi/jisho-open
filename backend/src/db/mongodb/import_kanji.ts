import * as MongoDb from "./index.ts"
import * as Api from "common/api/index.ts"
import * as Kanjidic from "../../importing/kanjidic.ts"


export async function importKanjiEntries(
    state: MongoDb.State,
    apiEntries: Api.Kanji.Entry[])
    : Promise<void>
{
    const dbEntries = apiEntries.map(translateKanjiApiToDb)

    if (dbEntries.length === 0)
        return


    await state.collKanji.deleteMany(
        { _id: { $in: dbEntries.map(e => e._id) }})

    const res = await state.collKanji.insertMany(dbEntries)

    if (res.insertedCount !== dbEntries.length)
        throw `MongoDb.importKanji failed`
}


function translateKanjiApiToDb(
    apiKanji: Api.Kanji.Entry)
    : MongoDb.DbKanjiEntry
{
    const lookUp: MongoDb.DbKanjiEntry["lookUp"] = {
        meanings: Kanjidic.gatherLookUpMeanings(apiKanji),
    }

    // Add and remove fields via destructuring assignment
    const {
        id,
        ...dbKanji
    } = {
        ...apiKanji,
        _id: apiKanji.id,
        lookUp,
    }

    return dbKanji
}