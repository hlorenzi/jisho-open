import * as Inflection from "../inflection.ts"

import * as Word from "./word.ts"
import * as Kanji from "./kanji.ts"
import * as KanjiWordCrossRef from "./kanji_word_crossref.ts"
import * as StudyList from "./studylist.ts"

export * as Kanji from "./kanji.ts"
export * as Word from "./word.ts"
export * as KanjiWordCrossRef from "./kanji_word_crossref.ts"
export * as StudyList from "./studylist.ts"


export namespace Error
{
    type ErrorType = {
        statusCode: number
        statusMessage: string
    }
    
    export const internal: ErrorType =
        { statusCode: 500, statusMessage: "internal server error" }

    export const notLoggedIn: ErrorType =
        { statusCode: 403, statusMessage: "not logged in" }
    
    export const forbidden: ErrorType =
        { statusCode: 403, statusMessage: "forbidden" }
    
    export const notFound: ErrorType =
        { statusCode: 404, statusMessage: "not found" }

    export const malformed: ErrorType =
        { statusCode: 400, statusMessage: "malformed request" }

    export const studylistInvalidName: ErrorType =
        { statusCode: 400, statusMessage: "invalid name for study list" }
    
    export const userStudylistCount: ErrorType =
        { statusCode: 400, statusMessage: "user has reached their maximum number of study lists created" }
    
    export const studylistEditorCount: ErrorType =
        { statusCode: 400, statusMessage: "study list has reached its maximum capacity for editors" }

    export const studylistCapacity: ErrorType =
        { statusCode: 400, statusMessage: "study list has reached its maximum capacity for words" }
}


export type User = {
    id: string
    name: string
    tags: string[]
    createDate: number
    modifyDate: number
    activityDate: number
    loginDate: number
}


export type MaybeUser = User | Partial<User>


export function userIsSystem(user: MaybeUser)
{
    if (!user.id)
        return false

    if (!user.tags?.some(tag => tag === "system"))
        return false

    return true
}


export function userIsAdmin(user: MaybeUser)
{
    if (!user.id)
        return false

    if (!user.tags?.some(tag => tag === "admin" || tag === "admin:jisho"))
        return false

    return true
}


export function userIsVip(user: MaybeUser)
{
    if (!user.id)
        return false

    if (!user.tags?.some(tag => tag === "vip" || tag === "vip:jisho"))
        return false

    return true
}


export type CommonnessTag =
    | "veryCommon"
    | "common"


export type CommonnessIndex = 2 | 1


export type JlptTag =
    | "jlpt"
    | "n5"
    | "n4"
    | "n3"
    | "n2"
    | "n1"


export type JlptLevel = 5 | 4 | 3 | 2 | 1


export type JouyouGrade = 1 | 2 | 3 | 4 | 5 | 6 | 7


export namespace Login
{
    export const url = "/login"

    export const urlForRedirect = (redirect: string) =>
        `${ url }?redirect=${ encodeURIComponent(redirect) }`

    export const urlFrontendFake =
        `/login_fake_page`

    export const urlFakeMatchUserId = "userId"

    export const urlFake =
        `/login_fake/:${ urlFakeMatchUserId }`

    export const urlFakeForUserId = (userId: string, redirect: string) =>
        `/login_fake/${ userId }?redirect=${ encodeURIComponent(redirect) }`
}


export namespace Logout
{
    export const url = "/logout"
    
    export const urlForRedirect = (redirect: string) =>
        `${ url }?redirect=${ encodeURIComponent(redirect) }`
}


export namespace Account
{
    export const url = "/account"
}


export namespace Authenticate
{
    export const url = "/api/v1/authenticate"
    export type Request = {}
    export type Response = MaybeUser
}


export namespace GetUser
{
    export const url = "/api/v1/user"

    export type Request = {
        userId: string
    }

    export type Response = {
        user: MaybeUser
    }
}


export namespace VersionGet
{
    export const url = "/api/v1/version"

    export type Request = {
    }

    export type Response = {
        version: string
    }
}


export namespace Log
{
    export const url = "/api/v1/log"

    export type Entry = {
        date: Date
        text: string
    }

    export type Request = {
    }

    export type Response = {
        entries: Entry[]
    }
}


export namespace Analytics
{
    export const url = "/api/v1/analytics"

    export type Id =
        "search" |
        "studylistId" |
        "studylistWordAdd"

    export type Entry = {
        fromDate: Date
        toDate: Date
        value: number
    }

    export type Request = {
    }

    export type Response = Partial<Record<Id, Entry>>
}


export namespace AdminGitUpdate
{
    export const url = "/api/v1/admin_git_update"
}


export namespace AdminDbRefresh
{
    export const url = "/api/v1/admin_db_refresh"
}


export namespace Search
{
    export const url = "/api/v1/search"

    export type Request = {
        query: string
        limit?: number
    }
    
    export type Response = {
        query: Query
        entries: Entry[]
    }

    export type QueryType =
        | "any"
        | "tags"
        | "verbatim"
        | "inflected"
        | "prefix"
        | "definition"
        | "sentence"
        | "wildcards"
        | "kanji"
        | "components"
    
    export type Query = {
        type: QueryType
        strRaw: string
        str: string
        strSplit: string[]
        strJapanese: string
        strJapaneseSplit: string[]
        strHiragana: string
        strInQuotes: string
        strInQuotesSplit: string[]
        strWildcards: string
        strWildcardsHiragana: string
        canBeDefinition: boolean
        canBeWildcards: boolean
        canBeSentence: boolean
        kanji: string[]
        components: string[]
        inflectionBreakdown: Inflection.Breakdown
        inflectionOf: Inflection.Inflected[]
        tags: string[]
        inverseTags: string[]
        explicitNotName: boolean
        limit?: number
    }

    export type Entry =
        | { type: "word" } & Word.Entry
        | { type: "kanji" } & Kanji.Entry
        | { type: "sentence" } & SentenceAnalysis
        | { type: "section", section: Section }

    export type SentenceAnalysis = {
        tokens: SentenceToken[]
    }

    export type SentenceToken = {
        surface_form: string
        basic_form: string
        category: Word.PartOfSpeechTag
        furigana: string
        pronunciation?: string
    }

    export type Section =
        | "verbatim"
        | "prefix"
        | "inflected"
        | "definition"
        | "kanji"
        | "sentence"
        | "continue"
        | "end"
}


export namespace KanjiWords
{
    export const url = "/api/v1/kanjiWords"

    export type Request = {
        kanji: string
    }
    
    export type Response = {
        query: string
        kanji: Kanji.Entry[]
        entries: KanjiWordCrossRef.Entry[]
    }
}


export namespace KanjiByComponents
{
    export const url = "/api/v1/kanjiByComponents"

    export type Request = {
        components: string
        onlyCommon: boolean
    }
    
    export type Response = {
        kanji: Kanji.Entry[]
    }
}


export namespace StudylistGet
{
    export const url = "/api/v1/studylistGet"

    export type Request = {
        studylistId: string
    }
    
    export type Response = {
        studylist: StudyList.Entry
    }
}


export namespace StudylistGetAll
{
    export const url = "/api/v1/studylistGetAll"

    export type Request = {
        userId: string
    }
    
    export type Response = {
        studylists: StudyList.Entry[]
    }
}


export namespace StudylistGetAllMarked
{
    export const url = "/api/v1/studylistGetAllMarked"

    export type Request = {
        markWordId?: string
    }
    
    export type Response = {
        studylists: StudyList.Entry[]
    }
}


export namespace StudylistCreate
{
    export const url = "/api/v1/studylistCreate"

    export type Request = {
        name: string
    }
    
    export type Response = {
        studylistId: string
    }
}


export namespace StudylistClone
{
    export const url = "/api/v1/studylistClone"

    export type Request = {
        studylistId: string
    }
    
    export type Response = {
        studylistId: string
    }
}


export namespace StudylistDelete
{
    export const url = "/api/v1/studylistDelete"

    export type Request = {
        studylistId: string
    }
    
    export type Response = {}
}


export namespace StudylistEditorJoin
{
    export const url = "/api/v1/studylistEditorJoin"

    export type Request = {
        studylistId: string
        password: string
    }
    
    export type Response = {}
}


export namespace StudylistEditorLeave
{
    export const url = "/api/v1/studylistEditorLeave"

    export type Request = {
        studylistId: string
    }
    
    export type Response = {}
}


export namespace StudylistEdit
{
    export const url = "/api/v1/studylistEdit"

    export type Request = {
        studylistId: string
        edit:
            | { type: "name", value: string }
            | { type: "public", value: boolean }
            | { type: "editorPassword", value?: string }
            | { type: "editorIds", value: string[] }
    }
    
    export type Response = {}
}


export namespace StudylistWordAdd
{
    export const url = "/api/v1/studylistWordAdd"

    export type Request = {
        studylistId: string
        wordId: string
    }
    
    export type Response = {}
}


export namespace StudylistWordRemoveMany
{
    export const url = "/api/v1/studylistWordRemoveMany"

    export type Request = {
        studylistId: string
        wordIds: string[]
    }
    
    export type Response = {}
}


export namespace StudylistWordImport
{
    export const url = "/api/v1/studylistWordImport"

    export type ImportWord = {
        base: string
        reading?: string
    }

    export const maxWords = 50

    export type Request = {
        studylistId: string
        attemptDeinflection: boolean
        words: ImportWord[]
    }
    
    export type Response = {
        failedWordIndices: number[]
    }
}


export namespace StudylistWordsGet
{
    export const url = "/api/v1/studylistWordsGet"

    export type Request = {
        studylistId: string
    }
    
    export type Response = {
        entries: Word.Entry[]
    }
}


export namespace StudylistStandardGetAll
{
    export const url = "/api/v1/studylistStandardGetAll"

    export type Request = {
    }
    
    export type Response = {
        studylists: StudyList.Entry[]
    }
}


export namespace StudylistCommunityGetRecent
{
    export const url = "/api/v1/studylistCommunityGetRecent"

    export type Request = {
        limit: number
    }
    
    export type Response = {
        studylists: StudyList.Entry[]
    }
}