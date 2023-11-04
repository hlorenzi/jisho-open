import * as MongoDb from "mongodb"
import * as Db from "../index.ts"
import * as Api from "common/api/index.ts"
import * as Furigana from "common/furigana.ts"
import * as MongoDbImporting from "./importing.ts"
import * as MongoDbSearch from "./search.ts"


export const dbUrl = "mongodb://localhost:27017"
export const dbDatabase = "jisho2"
export const dbCollectionWords = "words"
export const dbCollectionDefinitions = "definitions"


export type State = {
    db: MongoDb.Db
    collWords: MongoDb.Collection<DbWordEntry>
    collDefinitions: MongoDb.Collection<DbDefinitionEntry>
}


export type DbWordHeading = Omit<Api.Word.Heading, "base" | "reading">


export type DbWordEntry = Omit<Api.Word.Entry, "id" | "headings"> & {
    _id: string
    headings: DbWordHeading[]
    lookUp: {
        /// Length in characters of the longest heading
        len: number
        headings: Api.Word.LookUpHeading[]
        pos: Api.Word.PartOfSpeechTag[]
    }
}


export type DbDefinitionEntry = {
    _id: string
    wordId: string
    score: number
    words: string[]
}


export const fieldLookUp = "lookUp" satisfies keyof DbWordEntry


export const fieldLookUpHeadingsText =
    `${fieldLookUp}` +
    `.${"headings" satisfies keyof DbWordEntry["lookUp"]}` +
    `.${"text" satisfies keyof Api.Word.LookUpHeading}`


export const fieldLookUpHeadingsScore =
    `${fieldLookUp}` +
    `.${"headings" satisfies keyof DbWordEntry["lookUp"]}` +
    `.${"score" satisfies keyof Api.Word.LookUpHeading}`


export async function connect(): Promise<Db.Db>
{
    const client = await MongoDb.MongoClient.connect(dbUrl)
    const db = client.db(dbDatabase)
    const state: State = {
        db,
        collWords: db.collection<DbWordEntry>(dbCollectionWords),
        collDefinitions: db.collection<DbDefinitionEntry>(dbCollectionDefinitions),
    }

    await state.collWords.createIndex({
        [fieldLookUpHeadingsText]: 1,
        [fieldLookUpHeadingsScore]: -1,
    })

    await state.collDefinitions.createIndex({
        ["wordId" satisfies keyof DbDefinitionEntry]: 1,
        ["score" satisfies keyof DbDefinitionEntry]: -1,
    })

    await state.collDefinitions.createIndex({
        ["words" satisfies keyof DbDefinitionEntry]: 1,
        ["score" satisfies keyof DbDefinitionEntry]: -1,
    })

    return {
        importWords: (words) =>
            MongoDbImporting.importWords(state, words),

        searchByHeading: (queries) =>
            MongoDbSearch.searchByHeading(state, queries),
        searchByHeadingPrefix: (queries) =>
            MongoDbSearch.searchByHeadingPrefix(state, queries),
        searchByInflections: (inflections) =>
            MongoDbSearch.searchByInflections(state, inflections),
        searchByDefinition: (query) =>
            MongoDbSearch.searchByDefinition(state, query),
    }
}


export function translateDbWordToApiWord(
    dbWord: DbWordEntry)
    : Api.Word.Entry
{
    const translateHeading = (heading: DbWordHeading): Api.Word.Heading => {
        const furigana = Furigana.decode(heading.furigana)
        return {
            ...heading,
            base: Furigana.extractBase(furigana),
            reading: Furigana.extractReading(furigana),
        }
    }

    // Add and remove fields via destructuring assignment
    const {
        _id,
        lookUp,
        ...apiWord
    } = {
        ...dbWord,
        id: dbWord._id,
        headings: dbWord.headings.map(translateHeading),
    }

    return apiWord
}