import * as MongoDb from "mongodb"
import * as Db from "../index.ts"
import * as Api from "common/api/index.ts"
import * as MongoDbImporting from "./importing.ts"
import * as MongoDbSearch from "./search.ts"


export const dbUrl = "mongodb://localhost:27017"
export const dbDatabase = "jisho2"
export const dbCollectionWords = "words"


export interface State
{
    db: MongoDb.Db
    collWords: MongoDb.Collection<DbWordEntry>
}


export interface DbWordEntry extends Omit<Api.Word.Entry, "id">
{
    _id: string
    lookUp: {
        headings: string[]
        pos: Api.Word.PartOfSpeechTag[]
    }
}


export async function connect(): Promise<Db.Db>
{
    const client = await MongoDb.MongoClient.connect(dbUrl)
    const db = client.db(dbDatabase)
    const state: State = {
        db,
        collWords: db.collection<DbWordEntry>(dbCollectionWords),
    }

    return {
        importWords: (words) => MongoDbImporting.importWords(state, words),

        searchByHeading: (queries) => MongoDbSearch.searchByHeading(state, queries),
    }
}


export function translateDbWordToApiWord(
    dbWord: DbWordEntry)
    : Api.Word.Entry
{
    // Add and remove fields via destructuring assignment
    const {
        _id,
        lookUp,
        ...apiWord
    } = {
        ...dbWord,
        id: dbWord._id,
    }

    return apiWord
}