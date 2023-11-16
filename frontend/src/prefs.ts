import * as Framework from "./framework/index.ts"


export type Prefs = {
    debugMode: boolean

    studylistOrdering: "activity" | "name"
    studylistWordOrdering: "date-added" | "kana"

    studylistExportHtmlCss: boolean
    studylistExportKanjiLevel: "common" | "jouyou" | "uncommon" | "rare"
    studylistExportSkipKatakana: boolean
}


export const prefsDefault: Prefs = {
    debugMode: false,

    studylistOrdering: "activity",
    studylistWordOrdering: "date-added",

    studylistExportHtmlCss: true,
    studylistExportKanjiLevel: "common",
    studylistExportSkipKatakana: false,
}


export function usePrefs(): Prefs
{
    return Framework.usePrefs<Prefs>(prefsDefault)
}


export function mergePrefs(merge: Partial<Prefs>)
{
    Framework.mergePrefs<Prefs>(merge)
}