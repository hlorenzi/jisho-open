import * as Api from "./index.ts"


export interface Entry
{
    id: string

    jouyou?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
    jlpt?: 5 | 4 | 3 | 2 | 1
    rankNews?: number

    strokeCount: number
    strokeCounts?: number[]

    meanings: string[]

    kunyomi: Reading[]
    onyomi: Reading[]
    nanori?: string[]

    structuralCategory?: StructuralCategory

    wordCount?: number
    exampleWords: Api.KanjiWordCrossRef.Word[]
}


export type CommonnessTag =
    | "veryCommon"
    | "common"


export interface Reading
{
    text: string
    commonness?: CommonnessIndex
}


export type CommonnessIndex = 2 | 1


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