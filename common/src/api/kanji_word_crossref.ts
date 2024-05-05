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
    commonness?: Api.CommonnessIndex
    jlpt?: Api.JlptLevel
    ateji?: boolean
    gikun?: boolean
    irregular?: boolean
    rare?: boolean
    outdated?: boolean
    sense: string
}