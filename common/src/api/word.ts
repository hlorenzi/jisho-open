import * as JmdictRaw from "../../../backend/src/importing/jmdict_raw.ts"
import * as Inflection from "../inflection.ts"


export type Entry = {
    id: string
    headings: Heading[]
    senses: Sense[]
    inflections?: Inflection.Breakdown
    pitch?: PitchAccent[]

    /// Commonness score for this entry as a whole,
    /// for sorting search results. Higher is more common.
    score: number
}


export type Heading = {
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
    jlpt?: 5 | 4 | 3 | 2 | 1
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


export type PitchAccent = {
    text: string
}


export type Sense = {
    pos: PartOfSpeechTag[]
    gloss: Gloss[]
    misc?: MiscTag[]
    field?: FieldDomainTag[]
    info?: string[]
    lang?: LanguageSource[]
    xref?: CrossReference[]
    dialect?: DialectTag[]
    restrict?: string[]
}


export type Gloss =
    | string
    | { text: string, type: GlossTypeTag }


export type LanguageSource = {
    language?: LanguageTag
    partial?: boolean
    wasei?: boolean
    source?: string
}


export type CrossReference = {
    base: string
    reading?: string
    senseIndex?: number
    type?: "antonym"
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
    | "adj" // custom
    | "v" // custom
    | "v2" // custom
    | "v2-k" // custom
    | "v2-s" // custom
    | "v4" // custom
    | "v5" // custom
    | "vmasu" // custom
    | "virr" // custom
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


export type LanguageTag =
    | "eng"
    | "afr"
    | "ain"
    | "alg"
    | "amh"
    | "ara"
    | "arn"
    | "bnt"
    | "bre"
    | "bul"
    | "bur"
    | "chi"
    | "chn"
    | "cze"
    | "dan"
    | "dut"
    | "epo"
    | "est"
    | "fil"
    | "fin"
    | "fre"
    | "geo"
    | "ger"
    | "glg"
    | "grc"
    | "gre"
    | "haw"
    | "heb"
    | "hin"
    | "hun"
    | "ice"
    | "ind"
    | "ita"
    | "khm"
    | "kor"
    | "kur"
    | "lat"
    | "lit"
    | "mal"
    | "mao"
    | "mas"
    | "may"
    | "mnc"
    | "mol"
    | "mon"
    | "nor"
    | "per"
    | "pol"
    | "por"
    | "rum"
    | "rus"
    | "san"
    | "scr"
    | "slo"
    | "slv"
    | "som"
    | "spa"
    | "swa"
    | "swe"
    | "tah"
    | "tam"
    | "tgl"
    | "tha"
    | "tib"
    | "tur"
    | "ukr"
    | "urd"
    | "vie"
    | "yid"


export type MiscTag =
    | "abbr"
    | "aphorism"
    | "arch"
    | "char"
    | "chn"
    | "col"
    | "company"
    | "creat"
    | "dated"
    | "dei"
    | "derog"
    | "doc"
    | "euph"
    | "ev"
    | "fam"
    | "fem"
    | "fict"
    | "form"
    | "given"
    | "group"
    | "hist"
    | "hon"
    | "hum"
    | "id"
    | "joc"
    | "leg"
    | "m-sl"
    | "male"
    | "myth"
    | "net-sl"
    | "obj"
    | "obs"
    | "on-mim"
    | "organization"
    | "oth"
    | "person"
    | "place"
    | "poet"
    | "pol"
    | "product"
    | "proverb"
    | "quote"
    | "rare"
    | "relig"
    | "sens"
    | "serv"
    | "ship"
    | "sl"
    | "station"
    | "surname"
    | "uk"
    | "unclass"
    | "vulg"
    | "work"
    | "X"
    | "yoji"


export type FieldDomainTag =
    | "agric"
    | "anat"
    | "archeol"
    | "archit"
    | "art"
    | "astron"
    | "audvid"
    | "aviat"
    | "baseb"
    | "biochem"
    | "biol"
    | "bot"
    | "Buddh"
    | "bus"
    | "cards"
    | "chem"
    | "Christn"
    | "cloth"
    | "comp"
    | "cryst"
    | "dent"
    | "ecol"
    | "econ"
    | "elec"
    | "electr"
    | "embryo"
    | "engr"
    | "ent"
    | "film"
    | "finc"
    | "fish"
    | "food"
    | "gardn"
    | "genet"
    | "geogr"
    | "geol"
    | "geom"
    | "go"
    | "golf"
    | "gramm"
    | "grmyth"
    | "hanaf"
    | "horse"
    | "kabuki"
    | "law"
    | "ling"
    | "logic"
    | "MA"
    | "mahj"
    | "manga"
    | "math"
    | "mech"
    | "med"
    | "met"
    | "mil"
    | "mining"
    | "music"
    | "noh"
    | "ornith"
    | "paleo"
    | "pathol"
    | "pharm"
    | "phil"
    | "photo"
    | "physics"
    | "physiol"
    | "politics"
    | "print"
    | "psy"
    | "psyanal"
    | "psych"
    | "rail"
    | "rommyth"
    | "Shinto"
    | "shogi"
    | "ski"
    | "sports"
    | "stat"
    | "stockm"
    | "sumo"
    | "telec"
    | "tradem"
    | "tv"
    | "vidg"
    | "zool"


export type DialectTag =
    | "bra"
    | "hob"
    | "ksb"
    | "ktb"
    | "kyb"
    | "kyu"
    | "nab"
    | "osb"
    | "rkb"
    | "std"
    | "thb"
    | "tsb"
    | "tsug"


export type GlossTypeTag =
    | "equ"
    | "expl"
    | "fig"
    | "lit"
    | "tm"


export type FilterTag =
    CommonnessTag |
    PartOfSpeechTag |
    MiscTag |
    FieldDomainTag |
    LanguageTag | "wasei" |
    DialectTag |
    GlossTypeTag