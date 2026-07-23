import * as Xml from "./xml.ts"
import * as Api from "common/api/index.ts"


export interface Entry
{
    ent_seq: [string]
    k_ele?: EntryKEle[]
    r_ele: EntryREle[]
    info?: Info[]
    lsource?: LanguageSource[]
    sense: Sense[]
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


export interface Sense
{
    pos: Api.Word.PartOfSpeechTag[]
    xref?: Xref[]
    ant?: string[]
    misc?: Api.Word.MiscTag[]
    field?: Api.Word.FieldDomainTag[]
    s_inf?: string[]
    dial?: Api.Word.DialectTag[]
    stagr?: string[]
    stagk?: string[]
    gloss: EntryGloss[]
    example?: Example[]
}


export type EntryGloss =
    string |
    EntryGlossExtended


export interface EntryGlossExtended
{
    [Xml.xml2jsTextKey]: string
    [Xml.xml2jsAttributeKey]: {
        g_type: Api.Word.GlossTypeTag
    }
}


export type Info = {
    [Xml.xml2jsTextKey]: string
    [Xml.xml2jsAttributeKey]: {
        inf_type: "note"
    }
}


export type Xref = {
    [Xml.xml2jsTextKey]: string
    [Xml.xml2jsAttributeKey]: {
        type: "see" | "ant" | "syn"
        seq: string
        dict?: string
        sno?: string
        xk?: string
        xr?: string
    }
}


export type LanguageSource = {
    [Xml.xml2jsTextKey]?: string
    [Xml.xml2jsAttributeKey]: {
        "xml:lang": Api.Word.LanguageTag
        ls_wasei?: "y"
        ls_type?: "part"
    }
}


export type Example = {
    ex_srce: unknown[]
    ex_text: string[]
    ex_sent: ExampleSentence[]
}


export type ExampleSentence = {
    [Xml.xml2jsTextKey]?: string
    [Xml.xml2jsAttributeKey]: {
        "xml:lang": "jpn" | "eng"
    }
}