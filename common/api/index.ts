import * as Word from "./word.ts"
import * as Kanji from "./kanji.ts"

export * as Kanji from "./kanji.ts"
export * as Word from "./word.ts"


export interface SearchRequest
{
    query: string
}


export interface SearchResponse
{
    entries: Word.Entry[]
}