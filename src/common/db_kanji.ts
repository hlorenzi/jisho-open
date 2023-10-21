export interface Entry
{
    _id: string
    tags: Tag[]

    jouyou?: number
    jlpt?: number
    freqNews?: number

    strokeCount: number
    strokeCounts?: number[]

    meanings: string[]

    kunyomi: Reading[]
    onyomi: Reading[]
    nanori?: string[]

    structuralCategory?: StructuralCategory
}


export type Tag =
    CommonnessTag
    
    
export type CommonnessTag =
    | "veryCommon"
    | "common"


export interface Reading
{
    text: string
    tags?: ReadingTag[]
}


export type ReadingTag =
    ""


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