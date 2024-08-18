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
export const dbCollectionAnalytics = "analytics"
export const dbCollectionWords = "words"
export const dbCollectionDefinitions = "definitions"
export const dbCollectionKanji = "kanji"
export const dbCollectionKanjiWords = "kanji_words"
export const dbCollectionStudyLists = "studylists"
export const logEntriesMax = 2000
export const analyticsEntriesMax = 20000


export type State = {
    db: MongoDb.Db
    collLog: MongoDb.Collection<DbLogFile>
    collAnalytics: MongoDb.Collection<DbAnalyticsEntry>
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


export type DbAnalyticsEntry = {
    _id: Api.Analytics.Id
    byDate: {
        [date: string]: {
            value: number
            elements: string[]
        }
    }
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


export const fieldAnalyticsByDate = "byDate" satisfies keyof DbAnalyticsEntry
export const fieldAnalyticsByDateValue = "value" satisfies keyof DbAnalyticsEntry["byDate"]
export const fieldAnalyticsByDateElements = "elements" satisfies keyof DbAnalyticsEntry["byDate"]


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
        collAnalytics: db.collection<DbAnalyticsEntry>(dbCollectionAnalytics),
        collWords: db.collection<DbWordEntry>(dbCollectionWords),
        collDefinitions: db.collection<DbDefinitionEntry>(dbCollectionDefinitions),
        collKanji: db.collection<DbKanjiEntry>(dbCollectionKanji),
        collKanjiWords: db.collection<DbKanjiWordEntry>(dbCollectionKanjiWords),
        collStudylists: db.collection<DbStudyListEntry>(dbCollectionStudyLists),
    }

    await state.collWords.createIndex([
        { [fieldWordLookUpHeadingsText]: 1 },
        { [fieldWordLookUpHeadingsScore]: -1 },
        { ["_id" satisfies keyof DbWordEntry]: 1 },
    ])

    await state.collWords.createIndex([
        { [fieldWordLookUpTags]: 1 },
        { ["score" satisfies keyof DbWordEntry]: -1 },
        { ["_id" satisfies keyof DbWordEntry]: 1 },
    ])

    await state.collWords.createIndex([
        { [fieldWordLookUpChars]: 1 },
        { ["score" satisfies keyof DbWordEntry]: -1 },
        { ["_id" satisfies keyof DbWordEntry]: 1 },
    ])

    await state.collDefinitions.createIndex([
        { ["wordId" satisfies keyof DbDefinitionEntry]: 1 },
        { ["score" satisfies keyof DbDefinitionEntry]: -1 },
        { ["_id" satisfies keyof DbDefinitionEntry]: 1 },
    ])

    await state.collDefinitions.createIndex([
        { ["words" satisfies keyof DbDefinitionEntry]: 1 },
        { ["score" satisfies keyof DbDefinitionEntry]: -1 },
        { ["wordId" satisfies keyof DbDefinitionEntry]: 1 },
        { ["_id" satisfies keyof DbDefinitionEntry]: 1 },
    ])

    await state.collKanji.createIndex([
        { [fieldKanjiReadingsText]: 1 },
        { [fieldKanjiReadingsScore]: -1 },
        { [fieldKanjiScore]: -1 },
        { ["_id" satisfies keyof DbKanjiEntry]: 1 },
    ])

    await state.collKanji.createIndex([
        { [fieldKanjiLookUpMeanings]: 1 },
        { [fieldKanjiScore]: -1 },
        { ["_id" satisfies keyof DbKanjiEntry]: 1 },
    ])

    await state.collKanji.createIndex([
        { [fieldKanjiComponents]: 1 },
        { [fieldKanjiStrokeCount]: 1 },
        { [fieldKanjiScore]: -1 },
        { ["_id" satisfies keyof DbKanjiEntry]: 1 },
    ])

    await state.collStudylists.createIndex([
        { ["creatorId" satisfies keyof DbStudyListEntry]: 1 },
    ])

    await state.collStudylists.createIndex([
        { ["editorIds" satisfies keyof DbStudyListEntry]: 1 },
    ])

    return {
        client,
        state,

        log: (text) =>
            log(state, text),
        logGet: () =>
            logGet(state),

        analyticsAdd: (id, amount) =>
            analyticsAdd(state, id, amount),
        analyticsAddSet: (id, element) =>
            analyticsAddSet(state, id, element),
        analyticsDailyGet: () =>
            analyticsDailyGet(state),

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
        searchByInflections: (inflectionBreakdown, inflectionOf, options) =>
            MongoDbSearch.searchByInflections(state, inflectionBreakdown, inflectionOf, options),
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

        streamAllWords: () =>
            MongoDbSearch.streamAllWords(state),
            
        studylistCreate: (authUser, name) =>
            MongoDbStudyLists.studylistCreate(state, authUser, name),
        studylistClone: (authUser, studylistId) =>
            MongoDbStudyLists.studylistClone(state, authUser, studylistId),
        studylistDelete: (authUser, studylistId) =>
            MongoDbStudyLists.studylistDelete(state, authUser, studylistId),
        studylistEdit: (authUser, studylistId, edit) =>
            MongoDbStudyLists.studylistEdit(state, authUser, studylistId, edit),
        studylistEditorJoin: (authUser, studylistId, password) =>
            MongoDbStudyLists.studylistEditorJoin(state, authUser, studylistId, password),
        studylistEditorLeave: (authUser, studylistId) =>
            MongoDbStudyLists.studylistEditorLeave(state, authUser, studylistId),
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
        studylistWordImport: (authUser, studylistId, attemptDeinflection, words) =>
            MongoDbStudyLists.studylistWordImport(state, authUser, studylistId, attemptDeinflection, words),
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


export async function analyticsAdd(
    state: State,
    id: Api.Analytics.Id,
    amount: number)
{
    const date = new Date()
    date.setMinutes(0, 0, 0)

    const dateStr = date.toISOString().replace(/\./g, ":")

    await state.collAnalytics.updateOne(
        { _id: id },
        { $inc: { [`${ fieldAnalyticsByDate }.${ dateStr }.${ fieldAnalyticsByDateValue }`]: amount } },
        { upsert: true })
}


export async function analyticsAddSet(
    state: State,
    id: Api.Analytics.Id,
    element: string)
{
    const date = new Date()
    date.setMinutes(0, 0, 0)

    const dateStr = date.toISOString().replace(/\./g, ":")

    await state.collAnalytics.updateOne(
        { _id: id },
        { $addToSet: { [`${ fieldAnalyticsByDate }.${ dateStr }.${ fieldAnalyticsByDateElements }`]: element } },
        { upsert: true })
}


export async function analyticsDailyGet(
    state: State)
    : Promise<Api.Analytics.Response>
{
    const now = Date.now()
    const oneDayAgo = now - 24 * 60 * 60 * 1000

    const results: Api.Analytics.Response = {}

    const strToDate = (str: string): Date => {
        const lastColon = str.lastIndexOf(":")
        const newStr = str.slice(0, lastColon) + "." + str.slice(lastColon + 1)
        return new Date(newStr)
    }

    const dbEntries = await state.collAnalytics.find({}).toArray()
    for (const dbEntry of dbEntries)
    {
        if (!dbEntry.byDate)
            continue

        try
        {
            const dateEntries = Object.entries(dbEntry.byDate)
                .filter(e => strToDate(e[0]).getTime() >= oneDayAgo)
                .map(e => e[1])

            const result: Api.Analytics.Entry = {
                fromDate: new Date(oneDayAgo),
                toDate: new Date(now),
                value: 0,
            }

            const elements = new Set<string>()

            for (const entry of dateEntries)
            {
                if (typeof entry.value === "number")
                    result.value += entry.value

                if (Array.isArray(entry.elements))
                {
                    for (const elem of entry.elements)
                        elements.add(elem)
                }
            }

            result.value += elements.size

            results[dbEntry._id] = result
        }
        finally {}
    }

    return results
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