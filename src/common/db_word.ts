import * as JmdictRaw from "../backend/importing/jmdict_raw.js"


export interface Entry
{
    _id: string
    headings: Heading[]
    defs: Definition[]
    pos: PartOfSpeechTag[]
}


export interface Heading
{
    /// The word written in kanji, or kana-only if applicable.
    base: string

    /// The kana-only reading for the base word, but
    /// `undefined` if the base word is already kana-only.
    reading?: string

    tags: HeadingTag[]
}


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