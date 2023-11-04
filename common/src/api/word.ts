import * as JmdictRaw from "../../../backend/src/importing/jmdict_raw.ts"
import * as Inflection from "../inflection.ts"


export interface Entry
{
    id: string
    headings: Heading[]
    defs: Definition[]
    inflections?: Inflection.Breakdown

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


export type LookUpHeading = {
    text: string
    score: number
}


export interface Definition
{
    pos: PartOfSpeechTag[]
    gloss: string[]
}


export type CommonnessTag =
    | "veryCommon"
    | "common"


export type PartOfSpeechTag =
    | "adj-f"
    | "adj-i"
    | "adj-ix"
    | "adj-kari"
    | "adj-ku"
    | "adj-na"
    | "adj-nari"
    | "adj-no"
    | "adj-pn"
    | "adj-shiku"
    | "adj-t"
    | "adv"
    | "adv-to"
    | "aux"
    | "aux-adj"
    | "aux-v"
    | "conj"
    | "cop"
    | "ctr"
    | "exp"
    | "int"
    | "n"
    | "n-adv"
    | "n-pr"
    | "n-pref"
    | "n-suf"
    | "n-t"
    | "num"
    | "pn"
    | "pref"
    | "prt"
    | "suf"
    | "unc"
    | "v-unspec"
    | "v1"
    | "v1-s"
    | "v2a-s"
    | "v2b-k"
    | "v2b-s"
    | "v2d-k"
    | "v2d-s"
    | "v2g-k"
    | "v2g-s"
    | "v2h-k"
    | "v2h-s"
    | "v2k-k"
    | "v2k-s"
    | "v2m-k"
    | "v2m-s"
    | "v2n-s"
    | "v2r-k"
    | "v2r-s"
    | "v2s-s"
    | "v2t-k"
    | "v2t-s"
    | "v2w-s"
    | "v2y-k"
    | "v2y-s"
    | "v2z-s"
    | "v4b"
    | "v4g"
    | "v4h"
    | "v4k"
    | "v4m"
    | "v4n"
    | "v4r"
    | "v4s"
    | "v4t"
    | "v5aru"
    | "v5b"
    | "v5g"
    | "v5k"
    | "v5k-s"
    | "v5m"
    | "v5n"
    | "v5r"
    | "v5r-i"
    | "v5s"
    | "v5t"
    | "v5u"
    | "v5u-s"
    | "v5uru"
    | "vi"
    | "vk"
    | "vn"
    | "vr"
    | "vs"
    | "vs-c"
    | "vs-i"
    | "vs-s"
    | "vt"
    | "vz"
    | "vmasu" // custom
    | "surname"
    | "place"
    | "unclass"
    | "company"
    | "product"
    | "work"
    | "masc"
    | "fem"
    | "person"
    | "given"
    | "station"
    | "organization"


export type FilterTag =
    PartOfSpeechTag |
    CommonnessTag |
    string