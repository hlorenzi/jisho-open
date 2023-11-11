import * as Word from "./word.ts"
import * as Kanji from "./kanji.ts"
import * as KanjiWordCrossRef from "./kanji_word_crossref.ts"

export * as Kanji from "./kanji.ts"
export * as Word from "./word.ts"
export * as KanjiWordCrossRef from "./kanji_word_crossref.ts"


export type CommonnessTag =
    | "veryCommon"
    | "common"


export type CommonnessIndex = 2 | 1


export type JlptLevel = 5 | 4 | 3 | 2 | 1


export type JouyouGrade = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10


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
        tags: string[]
        inverseTags: string[]
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


export namespace KanjiByComponents
{
    export const url = "/api/v1/kanji_by_component"

    export type Request = {
        components: string
        onlyCommon: boolean
    }
    
    export type Response = {
        kanji: Kanji[]
    }

    export type Kanji = {
        id: string,
        strokeCount: number,
        components: string[],
    }
}