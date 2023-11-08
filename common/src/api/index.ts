import * as Word from "./word.ts"
import * as Kanji from "./kanji.ts"
import * as KanjiWordCrossRef from "./kanji_word_crossref.ts"

export * as Kanji from "./kanji.ts"
export * as Word from "./word.ts"
export * as KanjiWordCrossRef from "./kanji_word_crossref.ts"


export namespace Search
{
    export const url = "/api/v1/search"

    export type Request = {
        query: string
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
        | "wildcards"
        | "kanji"
    
    export type Query = {
        type: QueryType
        str: string
        strJapanese: string
        strHiragana: string
        strInQuotes: string
        strWildcards: string
        strWildcardsHiragana: string
        searchDefinitions: boolean
        kanji: string[]
        tags: string[]
        inverseTags: string[]
    }

    export type Entry =
        | { type: "word" } & Word.Entry
        | { type: "kanji" } & Kanji.Entry
        | { type: "section", section: Section }

    export type Section =
        | "verbatim"
        | "prefix"
        | "inflected"
        | "definition"
        | "kanji"
}


export namespace KanjiWords
{
    export const url = "/api/v1/kanji_words"

    export type Request = {
        kanji: string
    }
    
    export type Response = {
        query: string
        kanji: Kanji.Entry[]
        entries: KanjiWordCrossRef.Entry[]
    }
}