import * as JmdictRaw from "../../backend/src/importing/jmdict_raw.ts"
import * as Furigana from "../furigana.ts"


export interface Entry
{
    id: string
    headings: Heading[]
    defs: Definition[]

    /// Commonness score for this entry as a whole,
    /// for sorting search results. Higher is more common.
    score: number
}


export interface Heading
{
    /// The word written in kanji, or kana-only if applicable.
    base: string

    /// The kana-only reading for the base word, but
    /// `undefined` if the base word is already kana-only.
    reading?: string

    /// The furigana segmentation encoded as a single string
    furigana: string

    ateji?: boolean
    gikunOrJukujikun?: boolean
    irregularKanji?: boolean
    irregularKana?: boolean
    irregularOkurigana?: boolean
    outdatedKanji?: boolean
    outdatedKana?: boolean
    rareKanji?: boolean
    searchOnlyKanji?: boolean
    searchOnlyKana?: boolean

    /// Appearence in a JLPT level. (5 to 1)
    jlpt?: number
    /// Ranking of commonness in newspapers. (1 to 2)
    rankNews?: number
    /// Ranking of commonness in newspapers. (1 to 48)
    rankNf?: number
    /// Ranking of commonness in the "Ichimango goi bunruishuu". (1 to 2)
    rankIchi?: number
    /// Ranking of commonness in a JMdict-curated list. (1 to 2)
    rankSpec?: number
    /// Ranking of commonness in a loanwords list. (1 to 2)
    rankGai?: number

    /// Commonness score for this heading, for sorting search results.
    /// Higher is more common. If undefined, the value is 0.
    score?: number
}


export type HeadingRankField = keyof Pick<
    Heading,
    "rankNews" | "rankNf" | "rankIchi" | "rankSpec" | "rankGai">


export type HeadingTag =
    | JmdictRaw.KanjiElementPriTag
    | JmdictRaw.KanjiElementInfoTag
    | JmdictRaw.ReadingElementPriTag
    | JmdictRaw.ReadingElementInfoTag
    | "uk"


export interface Definition
{
    pos: PartOfSpeechTag[]
    gloss: string[]
}


export type PartOfSpeechTag = JmdictRaw.PartOfSpeechTag