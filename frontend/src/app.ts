import * as Framework from "./framework/index.ts"

export * as Api from "./api.ts"
export * as Pages from "./pages.ts"


export type Prefs = {
    debugMode: boolean
    theme: string

    studylistOrdering: "activity" | "name"
    studylistWordOrdering: "date-added" | "kana"

    studylistExportHtmlCss: boolean
    studylistExportKanjiLevel: "common" | "jouyou" | "uncommon" | "rare"
    studylistExportSkipKatakana: boolean
}


export const prefsDefault: Prefs = {
    debugMode: false,
    theme: "auto",

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