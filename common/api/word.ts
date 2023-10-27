import * as JmdictRaw from "../../backend/src/importing/jmdict_raw.ts"


export interface Entry
{
    id: string
    headings: Heading[]
    defs: Definition[]
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