import * as Word from "./word.ts"
import * as Kanji from "./kanji.ts"

export * as Kanji from "./kanji.ts"
export * as Word from "./word.ts"


export namespace Search
{
    export const url = "/api/v1/search"

    export type Request = {
        query: string
    }
    
    export type Response = {
        entries: Entry[]
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
}