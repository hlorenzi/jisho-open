import * as Xml from "../backend/dataentry/xml.js"


export type KanjiElementPriTag =
    | "ichi1"
    | "news1"
    | "news2"
    | `nf${string}`
    | "spec1"


export type KanjiElementInfoTag =
    | "rK"


export type ReadingElementPriTag =
    | "ichi1"
    | "news1"
    | "news2"
    | `nf${string}`
    | "spec1"
    | "spec2"


export type PartOfSpeechTag =
    | "adj-na"
    | "adj-no"
    | "adv"
    | "adv-to"
    | "conj"
    | "exp"
    | "prt"
    | "n"
    | "suf"
    | "v1" 
    | "v5b"
    | "v5g"
    | "v5m"
    | "v5r"
    | "vi"
    | "vs"
    | "vt"


export type MiscTag =
    | "col"
    | "on-mim"
    | "uk"
    | "yoji"


export type GlossTypeTag =
    | "lit"


export interface Entry
{
    ent_seq: [string]
    r_ele: EntryREle[]
}


export interface EntryKEle
{
    keb: [string]
    ke_pri?: KanjiElementPriTag[]
    ke_inf?: KanjiElementInfoTag[]
}


export interface EntryREle
{
    reb: [string]
    re_pri?: ReadingElementPriTag[]
    re_nokanji?: unknown[]
}


export interface EntrySense
{
    pos: PartOfSpeechTag[]
    xref?: string[]
    misc?: MiscTag[]
    s_inf?: string[]
    gloss: EntryGloss[]
}


export type EntryGloss =
    string |
    EntryGlossExtended


export interface EntryGlossExtended
{
    [Xml.xml2jsTextKey]: string
    [Xml.xml2jsAttributeKey]: {
        g_type?: GlossTypeTag
    }
}