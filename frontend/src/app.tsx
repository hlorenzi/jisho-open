import * as Solid from "solid-js"
import * as Framework from "./framework/index.ts"

export * as Api from "./api.ts"
export * as Pages from "./pages.ts"


export const githubUrl = "https://github.com/hlorenzi/jisho-open"


export type Prefs = {
    debugMode: boolean
    theme: string

    searchboxPosition: "inline" | "bottom"

    japaneseFontStyle: "regular" | "half-bold" | "bold"
    resultsWordHeadingSize: "regular" | "large" | "larger" | "largest"
    resultsShowWordSpellings: boolean
    resultsShowSearchOnlyHeadings: boolean
    resultsShowWordRankings: boolean
    resultsShowExampleSentences: boolean

    studylistOrdering: "activity" | "name"
    studylistWordOrdering: "date-added" | "kana"

    studylistImportAttemptDeinflection: boolean

    studylistExportHtmlCss: boolean
    studylistExportKanjiLevel: "common" | "jouyou" | "uncommon" | "rare" | "all"
    studylistExportSkipKatakana: boolean
    studylistExportJsonColumn: boolean
}


export const prefsDefault: Prefs = {
    debugMode: false,
    theme: "auto",

    searchboxPosition: "inline",

    japaneseFontStyle: "bold",
    resultsWordHeadingSize: "regular",
    resultsShowWordSpellings: true,
    resultsShowSearchOnlyHeadings: false,
    resultsShowWordRankings: true,
    resultsShowExampleSentences: false,

    studylistOrdering: "activity",
    studylistWordOrdering: "date-added",

    studylistImportAttemptDeinflection: false,

    studylistExportHtmlCss: true,
    studylistExportKanjiLevel: "common",
    studylistExportSkipKatakana: false,
    studylistExportJsonColumn: false,
}


export function usePrefs(): Prefs
{
    return Framework.usePrefs<Prefs>(prefsDefault)
}


export function mergePrefs(merge: Partial<Prefs>)
{
    Framework.mergePrefs<Prefs>(merge)
}


const cssJapaneseFontWeight = "--pref-japaneseFontWeight"
export const cssVarJapaneseFontWeight = `var(${ cssJapaneseFontWeight })`

const cssWordHeadingFontSize = "--pref-wordHeadingFontSize"
export const cssVarWordHeadingFontSize = `var(${ cssWordHeadingFontSize })`


export function usePrefsCss(): Solid.Accessor<string>
{
    return Solid.createMemo(() => {
        const prefs = usePrefs()

        return `
            ${ cssJapaneseFontWeight }: ${
                prefs.japaneseFontStyle === "regular" ? "regular" :
                prefs.japaneseFontStyle === "half-bold" ? "500" :
                "bold"
            };
            ${ cssWordHeadingFontSize }: ${
                prefs.resultsWordHeadingSize === "regular" ? "1em" :
                prefs.resultsWordHeadingSize === "large" ? "1.25em" :
                prefs.resultsWordHeadingSize === "larger" ? "1.5em" :
                prefs.resultsWordHeadingSize === "largest" ? "1.75em" :
                "1em"
            };
        `
    })
}


export type AnalyticsEvent =
    | "searchByButton"
    | "searchByEnter"
    | "searchClear"
    | "searchInsertKanji"
    | "searchFocusByEsc"
    | "searchFocusByTyping"
    | "resultsViewInflections"
    | "resultsCopyHeadingBase"
    | "resultsCopyHeadingReading"
    | "resultsKanjiViewDiagram"
    | "studylistPopupAdd"
    | "studylistPopupAddSpelling"
    | "studylistPopupRemove"
    | "studylistPopupCreateAndAdd"
    | "studylistCreate"
    | "studylistRename"
    | "studylistDelete"
    | "studylistTogglePublic"
    | "studylistRemoveWords"
    | "studylistImportPreview"
    | "studylistImport"
    | "studylistExport"


export function analyticsEvent(event: AnalyticsEvent)
{
    Framework.Analytics.event(event)
}