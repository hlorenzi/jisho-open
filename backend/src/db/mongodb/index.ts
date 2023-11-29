import * as MongoDb from "mongodb"
import * as Crypto from "crypto"
import * as Db from "../index.ts"
import * as Api from "common/api/index.ts"
import * as Furigana from "common/furigana.ts"
import * as MongoDbImportWords from "./import_word.ts"
import * as MongoDbImportKanji from "./import_kanji.ts"
import * as MongoDbImportKanjiWord from "./import_kanji_word_crossref.ts"
import * as MongoDbSearch from "./search.ts"
import * as MongoDbStudyLists from "./studylist.ts"


export const dbUrl = "mongodb://localhost:27017"
export const dbDatabase = "jisho2"
export const dbCollectionLog = "log"
export const dbCollectionWords = "words"
export const dbCollectionDefinitions = "definitions"
export const dbCollectionKanji = "kanji"
export const dbCollectionKanjiWords = "kanji_words"
export const dbCollectionStudyLists = "studylists"
export const logEntriesMax = 10000


export type State = {
    db: MongoDb.Db
    collLog: MongoDb.Collection<DbLogFile>
    collWords: MongoDb.Collection<DbWordEntry>
    collDefinitions: MongoDb.Collection<DbDefinitionEntry>
    collKanji: MongoDb.Collection<DbKanjiEntry>
    collKanjiWords: MongoDb.Collection<DbKanjiWordEntry>
    collStudylists: MongoDb.Collection<DbStudyListEntry>
}


export type DbLogFile = {
    _id: string
    entries: Api.Log.Entry[]
}


export type DbWordEntry = Omit<Api.Word.Entry, "id" | "headings"> & {
    _id: string
    headings: DbWordHeading[]
    date: Date
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
    lookUp: {
        meanings: string[]
    }
}


export type DbKanjiWordEntry = Omit<Api.KanjiWordCrossRef.Entry, "id"> & {
    _id: string
}


export type DbStudyListEntry = Omit<Api.StudyList.Entry, "id"> & {
    _id: string
}


export const fieldWordLookUp = "lookUp" satisfies keyof DbWordEntry


export const fieldWordLookUpHeadingsText =
    `${fieldWordLookUp}` +
    `.${"headings" satisfies keyof DbWordEntry["lookUp"]}` +
    `.${"text" satisfies keyof Api.Word.LookUpHeading}`


export const fieldWordLookUpHeadingsScore =
    `${fieldWordLookUp}` +
    `.${"headings" satisfies keyof DbWordEntry["lookUp"]}` +
    `.${"score" satisfies keyof Api.Word.LookUpHeading}`


export const fieldWordLookUpTags =
    `${fieldWordLookUp}` +
    `.${"tags" satisfies keyof DbWordEntry["lookUp"]}`


export const fieldWordLookUpChars =
    `${fieldWordLookUp}` +
    `.${"chars" satisfies keyof DbWordEntry["lookUp"]}`


export const fieldKanjiLookUp = "lookUp" satisfies keyof DbKanjiEntry


export const fieldKanjiScore =
    `${"score" satisfies keyof DbKanjiEntry}`


export const fieldKanjiComponents =
    `${"components" satisfies keyof DbKanjiEntry}`


export const fieldKanjiStrokeCount =
    `${"strokeCount" satisfies keyof DbKanjiEntry}`


export const fieldKanjiReadingsText =
    `${"readings" satisfies keyof DbKanjiEntry}` +
    `.${"reading" satisfies keyof Api.Kanji.ReadingScore}`


export const fieldKanjiReadingsScore =
    `${"readings" satisfies keyof DbKanjiEntry}` +
    `.${"score" satisfies keyof Api.Kanji.ReadingScore}`


export const fieldKanjiLookUpMeanings =
    `${fieldKanjiLookUp}` +
    `.${"meanings" satisfies keyof DbKanjiEntry["lookUp"]}`


export interface Interface extends Db.Interface
{
    client: MongoDb.MongoClient
    state: State
}


export async function connect(): Promise<Interface>
{
    const client = await MongoDb.MongoClient.connect(dbUrl)
    const db = client.db(dbDatabase)
    const state: State = {
        db,
        collLog: db.collection<DbLogFile>(dbCollectionLog),
        collWords: db.collection<DbWordEntry>(dbCollectionWords),
        collDefinitions: db.collection<DbDefinitionEntry>(dbCollectionDefinitions),
        collKanji: db.collection<DbKanjiEntry>(dbCollectionKanji),
        collKanjiWords: db.collection<DbKanjiWordEntry>(dbCollectionKanjiWords),
        collStudylists: db.collection<DbStudyListEntry>(dbCollectionStudyLists),
    }

    await state.collWords.createIndex({
        [fieldWordLookUpHeadingsText]: 1,
        [fieldWordLookUpHeadingsScore]: -1,
    })

    await state.collWords.createIndex({
        [fieldWordLookUpTags]: 1,
        ["score" satisfies keyof DbWordEntry]: -1,
    })

    await state.collWords.createIndex({
        [fieldWordLookUpChars]: 1,
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

    await state.collKanji.createIndex({
        [fieldKanjiReadingsText]: 1,
        [fieldKanjiReadingsScore]: -1,
        [fieldKanjiScore]: -1,
    })

    await state.collKanji.createIndex({
        [fieldKanjiLookUpMeanings]: 1,
        [fieldKanjiScore]: -1,
    })

    await state.collKanji.createIndex({
        [fieldKanjiComponents]: 1,
        [fieldKanjiStrokeCount]: 1,
        [fieldKanjiScore]: -1,
    })

    await state.collStudylists.createIndex({
        ["creatorId" satisfies keyof DbStudyListEntry]: 1,
    })

    await state.collStudylists.createIndex({
        ["editorIds" satisfies keyof DbStudyListEntry]: 1,
    })

    return {
        client,
        state,

        log: (text) =>
            log(state, text),
        logGet: () =>
            logGet(state),

        importWordEntries: (date, entries) =>
            MongoDbImportWords.importWordEntries(state, date, entries),
        importWordEntriesFinish: (date) =>
            MongoDbImportWords.importWordEntriesFinish(state, date),
        importKanjiEntries: (entries) =>
            MongoDbImportKanji.importKanjiEntries(state, entries),
        importKanjiWordCrossRefEntries: (entries) =>
            MongoDbImportKanjiWord.importKanjiWordCrossRefEntry(state, entries),
        importStandardStudylist: (studylistId, studylistName, wordIds) =>
            MongoDbStudyLists.importStandardStudylist(state, studylistId, studylistName, wordIds),

        searchByHeading: (queries, options) =>
            MongoDbSearch.searchByHeading(state, queries, options),
        searchByHeadingAll: (queries, options) =>
            MongoDbSearch.searchByHeadingAll(state, queries, options),
        searchByHeadingPrefix: (queries, options) =>
            MongoDbSearch.searchByHeadingPrefix(state, queries, options),
        searchByInflections: (inflections, options) =>
            MongoDbSearch.searchByInflections(state, inflections, options),
        searchByDefinition: (query, options) =>
            MongoDbSearch.searchByDefinition(state, query, options),
        searchByTags: (options) =>
            MongoDbSearch.searchByTags(state, options),
        searchByWildcards: (queries, options) =>
            MongoDbSearch.searchByWildcards(state, queries, options),
        searchKanji: (kanjiString, options) =>
            MongoDbSearch.searchKanji(state, kanjiString, options),
        searchKanjiByReading: (queries, options) =>
            MongoDbSearch.searchKanjiByReading(state, queries, options),
        searchKanjiByMeaning: (queries, options) =>
            MongoDbSearch.searchKanjiByMeaning(state, queries, options),
        searchKanjiByComponents: (queries, onlyCommon) =>
            MongoDbSearch.searchKanjiByComponents(state, queries, onlyCommon),

        listAllKanji: () =>
            MongoDbSearch.listAllKanji(state),
        listWordsWithChars: (chars: string[]) =>
            MongoDbSearch.listWordsWithChars(state, chars),
        listKanjiWordCrossRefEntries: (kanjiString: string) =>
            MongoDbSearch.listKanjiWordCrossRefEntries(state, kanjiString),
            
        studylistCreate: (authUser, name) =>
            MongoDbStudyLists.studylistCreate(state, authUser, name),
        studylistDelete: (authUser, studylistId) =>
            MongoDbStudyLists.studylistDelete(state, authUser, studylistId),
        studylistEdit: (authUser, studylistId, edit) =>
            MongoDbStudyLists.studylistEdit(state, authUser, studylistId, edit),
        studylistGet: (authUser, studylistId) =>
            MongoDbStudyLists.studylistGet(state, authUser, studylistId),
        studylistGetAll: (authUser, userId) =>
            MongoDbStudyLists.studylistGetAll(state, authUser, userId),
        studylistGetAllMarked: (authUser, markWordId) =>
            MongoDbStudyLists.studylistGetAllMarked(state, authUser, markWordId),
        studylistWordAdd: (authUser, studylistId, wordId) =>
            MongoDbStudyLists.studylistWordAdd(state, authUser, studylistId, wordId),
        studylistWordRemoveMany: (authUser, studylistId, wordIds) =>
            MongoDbStudyLists.studylistWordRemoveMany(state, authUser, studylistId, wordIds),
        studylistWordImport: (authUser, studylistId, words) =>
            MongoDbStudyLists.studylistWordImport(state, authUser, studylistId, words),
        studylistWordsGet: (authUser, studylistId) =>
            MongoDbStudyLists.studylistWordsGet(state, authUser, studylistId),
        studylistCommunityGetRecent: (authUser, limit) =>
            MongoDbStudyLists.studylistCommunityGetRecent(state, authUser, limit),
    }
}


export async function log(
    state: State,
    text: string)
{
    const entry = {
        date: new Date(),
        text: text,
    }

    await state.collLog.updateOne(
        { _id: "log" },
        { $push: { entries: { $each: [entry], $slice: -logEntriesMax } } },
        { upsert: true })
}


export async function logGet(
    state: State)
    : Promise<Api.Log.Entry[]>
{
    const file = await state.collLog.findOne({ _id: "log" })
    if (!file)
        return []

    return file.entries
}


export async function insertWithNewId<T extends MongoDb.Document>(
    collection: MongoDb.Collection<T>,
    entry: MongoDb.OptionalUnlessRequiredId<T>)
{
    let id = null
    let tries = 0
    while (true)
    {
        tries++
        if (tries > 10)
            throw Api.Error.internal

        id = generateRandomId()
        
        if (id.startsWith("00"))
            continue
        
        try { await collection.insertOne({ ...entry, _id: id }) }
        catch { continue }
        
        break
    }
    
    return id
}


function generateRandomId(len = 6)
{
	return Crypto
		.randomBytes(len)
		.toString("base64")
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/\=/g, "")
		.substring(0, len)
}


export function translateWordDbToApi(
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
        date,
        ...apiWord
    } = {
        ...dbWord,
        id: dbWord._id,
        headings: dbWord.headings.map(translateHeading),
    }

    return apiWord
}


export function translateKanjiDbToApi(
    dbKanji: DbKanjiEntry)
    : Api.Kanji.Entry
{
    // Add and remove fields via destructuring assignment
    const {
        _id,
        lookUp,
        ...apiKanji
    } = {
        ...dbKanji,
        id: dbKanji._id,
    }

    return apiKanji
}


export function translateKanjiWordDbToApi(
    dbEntry: DbKanjiWordEntry)
    : Api.KanjiWordCrossRef.Entry
{
    // Add and remove fields via destructuring assignment
    const {
        _id,
        ...apiEntry
    } = {
        ...dbEntry,
        id: dbEntry._id,
    }

    return apiEntry
}


export function translateStudyListDbToApi(
    dbEntry: DbStudyListEntry)
    : Api.StudyList.Entry
{
    // Add and remove fields via destructuring assignment
    const {
        _id,
        ...apiEntry
    } = {
        ...dbEntry,
        id: dbEntry._id,
    }

    return apiEntry
}