import * as MongoDb from "mongodb"
import * as Db from "../index.ts"
import * as Api from "common/api/index.ts"
import * as Furigana from "common/furigana.ts"
import * as MongoDbImportWords from "./import_word.ts"
import * as MongoDbImportKanji from "./import_kanji.ts"
import * as MongoDbImportKanjiWord from "./import_kanji_word_crossref.ts"
import * as MongoDbSearch from "./search.ts"


export const dbUrl = "mongodb://localhost:27017"
export const dbDatabase = "jisho2"
export const dbCollectionWords = "words"
export const dbCollectionDefinitions = "definitions"
export const dbCollectionKanji = "kanji"
export const dbCollectionKanjiWords = "kanji_words"


export type State = {
    db: MongoDb.Db
    collWords: MongoDb.Collection<DbWordEntry>
    collDefinitions: MongoDb.Collection<DbDefinitionEntry>
    collKanji: MongoDb.Collection<DbKanjiEntry>
    collKanjiWords: MongoDb.Collection<DbKanjiWordEntry>
}


export type DbWordEntry = Omit<Api.Word.Entry, "id" | "headings"> & {
    _id: string
    headings: DbWordHeading[]
    lookUp: {
        /// Length in characters of the longest heading
        len: number
        headings: Api.Word.LookUpHeading[]
        tags: Api.Word.FilterTag[]
        chars: string[]
    }
}


export type DbWordHeading = Omit<Api.Word.Heading, "base" | "reading">


export type DbDefinitionEntry = {
    _id: string
    wordId: string
    score: number
    words: string[]
}


export type DbKanjiEntry = Omit<Api.Kanji.Entry, "id"> & {
    _id: string
}


export type DbKanjiWordEntry = Omit<Api.KanjiWordCrossRef.Entry, "id"> & {
    _id: string
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


export const fieldLookUpTags =
    `${fieldLookUp}` +
    `.${"tags" satisfies keyof DbWordEntry["lookUp"]}`


export const fieldLookUpChars =
    `${fieldLookUp}` +
    `.${"chars" satisfies keyof DbWordEntry["lookUp"]}`


export async function connect(): Promise<Db.Db>
{
    const client = await MongoDb.MongoClient.connect(dbUrl)
    const db = client.db(dbDatabase)
    const state: State = {
        db,
        collWords: db.collection<DbWordEntry>(dbCollectionWords),
        collDefinitions: db.collection<DbDefinitionEntry>(dbCollectionDefinitions),
        collKanji: db.collection<DbKanjiEntry>(dbCollectionKanji),
        collKanjiWords: db.collection<DbKanjiWordEntry>(dbCollectionKanjiWords),
    }

    await state.collWords.createIndex({
        [fieldLookUpHeadingsText]: 1,
        [fieldLookUpHeadingsScore]: -1,
    })

    await state.collWords.createIndex({
        [fieldLookUpTags]: 1,
        ["score" satisfies keyof DbWordEntry]: -1,
    })

    await state.collWords.createIndex({
        [fieldLookUpChars]: 1,
        ["score" satisfies keyof DbWordEntry]: -1,
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
        importWordEntries: (entries) =>
            MongoDbImportWords.importWordEntries(state, entries),
        importKanjiEntries: (entries) =>
            MongoDbImportKanji.importKanjiEntries(state, entries),
        importKanjiWordCrossRefEntries: (entries) =>
            MongoDbImportKanjiWord.importKanjiWordCrossRefEntry(state, entries),

        searchByHeading: (queries, tags, invTags) =>
            MongoDbSearch.searchByHeading(state, queries, tags, invTags),
        searchByHeadingPrefix: (queries, tags, invTags) =>
            MongoDbSearch.searchByHeadingPrefix(state, queries, tags, invTags),
        searchByInflections: (inflections, tags, invTags) =>
            MongoDbSearch.searchByInflections(state, inflections, tags, invTags),
        searchByDefinition: (query, tags, invTags) =>
            MongoDbSearch.searchByDefinition(state, query, tags, invTags),
        searchByTags: (tags, invTags) =>
            MongoDbSearch.searchByTags(state, tags, invTags),
        searchKanji: (kanjiString, tags, invTags) =>
            MongoDbSearch.searchKanji(state, kanjiString, tags, invTags),

        listAllKanji: () =>
            MongoDbSearch.listAllKanji(state),
        listWordsWithChars: (chars: string[]) =>
            MongoDbSearch.listWordsWithChars(state, chars),
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


export function translateDbKanjiToApiKanji(
    dbKanji: DbKanjiEntry)
    : Api.Kanji.Entry
{
    // Add and remove fields via destructuring assignment
    const {
        _id,
        ...apiKanji
    } = {
        ...dbKanji,
        id: dbKanji._id,
    }

    return apiKanji
}