import * as Word from "./word.ts"
import * as Kanji from "./kanji.ts"

export * as Kanji from "./kanji.ts"
export * as Word from "./word.ts"


export namespace Search
{
    export const url = "/api/v1/search"

    export interface Request
    {
        query: string
    }
    
    export interface Response
    {
        entries: Word.Entry[]
    }
}