import * as MongoDb from "mongodb"
import * as Db from "../index.ts"
import * as DbWord from "common/db_word.ts"
import * as MongoDbImporting from "./importing.ts"


export const dbUrl = "mongodb://localhost:27017"
export const dbDatabase = "jisho2"
export const dbCollectionWords = "words"


export interface State
{
    db: MongoDb.Db
    collWords: MongoDb.Collection<DbWord.Entry>
}


export async function connect(): Promise<Db.Db>
{
    const client = await MongoDb.MongoClient.connect(dbUrl)
    const db = client.db(dbDatabase)
    const state: State = {
        db,
        collWords: db.collection<DbWord.Entry>(dbCollectionWords),
    }

    return {
        importWords: (words) => MongoDbImporting.importWords(state, words)
    }
}