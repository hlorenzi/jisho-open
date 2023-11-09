import * as MongoDb from "./index.ts"
import * as Api from "common/api/index.ts"
import * as Kanjidic from "../../importing/kanjidic.ts"


export async function importKanjiEntries(
    state: MongoDb.State,
    apiKanjis: Api.Kanji.Entry[])
    : Promise<void>
{
    const dbKanjis = apiKanjis.map(translateApiKanjiToDbKanji)

    if (dbKanjis.length === 0)
        return


    await state.collKanji.deleteMany(
        { _id: { $in: dbKanjis.map(e => e._id) }})

    const resKanjis = await state.collKanji.insertMany(dbKanjis)

    if (resKanjis.insertedCount !== dbKanjis.length)
        throw `MongoDb.importKanji failed`
}


function translateApiKanjiToDbKanji(
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