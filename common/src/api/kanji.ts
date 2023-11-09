import * as Api from "./index.ts"


export interface Entry
{
    id: string

    jouyou?: Api.JouyouGrade
    jlpt?: Api.JlptLevel
    rankNews?: number

    strokeCount: number
    strokeCounts?: number[]

    meanings: string[]

    kunyomi: Reading[]
    onyomi: Reading[]
    nanori?: string[]

    /// The overall commonness score for the kanji.
    score?: number
    /// All readings (even irregular) with commonness scores.
    readings?: ReadingScore[]

    structuralCategory?: StructuralCategory

    wordCount?: number
    exampleWords?: Api.KanjiWordCrossRef.Word[]
}


export interface Reading
{
    text: string
    commonness?: Api.CommonnessIndex
}


export interface ReadingScore
{
    reading: string
    score: number
}


export type StructuralCategory =
    | { type: "unknown" }
    | { type: "shoukei" }
    | { type: "shiji" }
    | { type: "kaii" }
    | { type: "keisei", semantic: string, phonetic: string }
    | { type: "kokuji" }
    | { type: "shinjitai" }
    | { type: "derivative" }
    | { type: "rebus" }