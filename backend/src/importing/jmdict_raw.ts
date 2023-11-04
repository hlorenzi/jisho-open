import * as Xml from "./xml.ts"
import * as Api from "common/api/index.ts"


export interface Entry
{
    ent_seq: [string]
    k_ele?: EntryKEle[]
    r_ele: EntryREle[]
    sense: EntrySense[]
}


export type KanjiElementPriTag =
    | "ichi1"
    | "ichi2"
    | "news1"
    | "news2"
    | `nf${string}`
    | "spec1"
    | "spec2"
    | "gai1"
    | "gai2"


export type KanjiElementInfoTag =
    | "ateji"
    | "iK"
    | "ik"
    | "oK"
    | "rK"
    | "sK"


export type ReadingElementPriTag = KanjiElementPriTag


export type ReadingElementInfoTag =
    | "gikun"
    | "ik"
    | "ok"
    | "sk"


export type PartOfSpeechTag = Api.Word.PartOfSpeechTag


export type MiscTag =
    | "col"
    | "on-mim"
    | "uk"
    | "yoji"


export type GlossTypeTag =
    | "lit"


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
    re_inf?: ReadingElementInfoTag[]
    re_nokanji?: unknown[]
    re_restr?: string[]
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