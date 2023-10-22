import * as Xml from "./xml.ts"


export interface Entry
{
    literal: [string]
    misc: [EntryMisc]
    reading_meaning?: [EntryReadingMeaning]
}


export type ReadingTypeTag =
    | "ja_kun"
    | "ja_on"
    | "korean_h"
    | "korean_r"
    | "pinyin"
    | "vietnam"


export type MeaningLanguageTag =
    | "es"
    | "fr"
    | "pt"


export interface EntryMisc
{
    grade?: [string]
    stroke_count: [string]
    freq?: [string]
    jlpt?: [string]
}


export interface EntryReadingMeaning
{
    rmgroup: [EntryReadingMeaningGroup]
    nanori?: string[]
}


export interface EntryReadingMeaningGroup
{
    reading?: EntryReading[]
    meaning?: EntryMeaning[]
}


export interface EntryReading
{
    [Xml.xml2jsTextKey]: string
    [Xml.xml2jsAttributeKey]: {
        r_type: ReadingTypeTag
    }
}


export type EntryMeaning =
    string |
    EntryMeaningExtended


export interface EntryMeaningExtended
{
    [Xml.xml2jsTextKey]: string
    [Xml.xml2jsAttributeKey]: {
        m_lang: MeaningLanguageTag
    }
}