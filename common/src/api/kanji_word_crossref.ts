import * as Api from "./index.ts"


export type Entry = {
    id: string
    readings: ReadingBucket[]
}


export type ReadingBucket = {
    reading: string
    entries: Word[]
}


export type Word = {
    furigana: string
    commonness?: Api.Kanji.CommonnessIndex
    jlpt?: 5 | 4 | 3 | 2 | 1
    irregular?: boolean
    rare?: boolean
    outdated?: boolean
    sense: string
}