import * as MongoDb from "./index.js"
import * as DbWord from "../../../common/db_word.js"


export async function importWords(
    state: MongoDb.State,
    words: DbWord.Entry[])
    : Promise<void>
{
    if (words.length !== 0)
        await state.collWords.insertMany(words)

    //if (dbLuSenseEntryBuffer.length != 0)
    //    await db.collection("words_luSense").insertMany(dbLuSenseEntryBuffer)
}