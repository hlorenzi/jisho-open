import * as Solid from "solid-js"
import * as SolidWeb from "solid-js/web"
import * as Styled from "solid-styled-components"
import * as Framework from "./framework/index.ts"

export * as Api from "./api.ts"
export * as Pages from "./pages.ts"


export const githubUrl = "https://github.com/hlorenzi/jisho-open"


export type Prefs = {
    debugMode: boolean
    theme: string

    searchboxPosition: "inline" | "bottom"

    japaneseFontStyle: "regular" | "half-bold" | "bold"
    resultsShowSearchOnlyHeadings: boolean

    studylistOrdering: "activity" | "name"
    studylistWordOrdering: "date-added" | "kana"

    studylistExportHtmlCss: boolean
    studylistExportKanjiLevel: "common" | "jouyou" | "uncommon" | "rare"
    studylistExportSkipKatakana: boolean
}


export const prefsDefault: Prefs = {
    debugMode: false,
    theme: "auto",

    searchboxPosition: "inline",

    japaneseFontStyle: "bold",
    resultsShowSearchOnlyHeadings: false,

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


const cssJapaneseFontWeight = "--pref-japaneseFontWeight"
export const cssVarJapaneseFontWeight = `var(${ cssJapaneseFontWeight })`


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
        `
    })
}