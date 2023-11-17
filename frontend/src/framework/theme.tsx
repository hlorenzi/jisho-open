import * as Solid from "solid-js"
import * as SolidWeb from "solid-js/web"
import * as Styled from "solid-styled-components"
import * as Framework from "./index.ts"


export function themeVar<T extends keyof Theme>(
    name: T)
    : string
{
    return `var(--theme-${ name })`
}


export type Theme = {
    id: string
    name: string

    pageBigMinWidth: string
    pagePaddingBig: string
    pagePaddingSmall: string

    themeColor: string
    voidBkgColor: string
    pageBkgColor: string

    borderColor: string
    focusOutlineColor: string
    focusOutlineWidth: string
    popupOverlayColor: string
    popupShadowColor: string

    textColor: string
    text2ndColor: string
    text3rdColor: string
    text4thColor: string
    textDisabledColor: string
    textStrongBkgColor: string
    textHighlightBkgColor: string

    linkHoverColor: string
    linkPressColor: string

    buttonHoverBkgColor: string
    buttonPressBkgColor: string
    buttonAccentColor: string
    buttonDangerColor: string
    buttonToggledBkgColor: string
    
    loadingBar1stColor: string
    loadingBar2ndColor: string
    loadingBarBkgColor: string
    
    iconGreenColor: string
    iconRedColor: string
    iconYellowColor: string
    iconBlueColor: string
    iconDetailColor: string

    iconAtejiColor: string
    iconGikunColor: string
    iconJlptN5Color: string
    iconJlptN4Color: string
    iconJlptN3Color: string
    iconJlptN2Color: string
    iconJlptN1Color: string
    iconJouyou1Color: string
    iconJouyou2Color: string
    iconJouyou3Color: string
    iconJouyou4Color: string
    iconJouyou5Color: string
    iconJouyou6Color: string
    iconJouyou7Color: string
    iconJinmeiyouColor: string
    iconNewsColor: string
    iconWikipediaColor: string
    iconAnimeDramaColor: string
}


export const themeLight: Theme = {
    id: "light",
    name: "Light",
    
    pageBigMinWidth: "900px",
    pagePaddingBig: "3rem",
    pagePaddingSmall: "1rem",

    themeColor: "#77ab00",
    voidBkgColor: "#f8f8f8",
    pageBkgColor: "#ffffff",

    borderColor: "#cccccc",
    focusOutlineColor: "#77ab00",
    focusOutlineWidth: "2px",
    popupOverlayColor: "#00000018",
    popupShadowColor: "#00000020",

    textColor: "#454545",
    text2ndColor: "#666666",
    text3rdColor: "#aaaaaa",
    text4thColor: "#cccccc",
    textDisabledColor: "#a0a0a0",
    textStrongBkgColor: "#eee",
    textHighlightBkgColor: "#f0ffda",

    linkHoverColor: "#408000",
    linkPressColor: "#224400",

    buttonHoverBkgColor: "#ddd8",
    buttonPressBkgColor: "#cccc",
    buttonAccentColor: "#77ab00",
    buttonDangerColor: "#ff682f",
    buttonToggledBkgColor: "#9dd128",
    
    loadingBar1stColor: "#77ab00",
    loadingBar2ndColor: "#dbe19e",
    loadingBarBkgColor: "#eeeeee",
    
    iconGreenColor: "#00aa00",
    iconRedColor: "#e61414",
    iconYellowColor: "#ffaa00",
    iconBlueColor: "#0068ff",
    iconDetailColor: "#ffffff",
    
    iconAtejiColor: "#5886e4",
    iconGikunColor: "#5886e4",
    iconJlptN5Color: "#f78441",
    iconJlptN4Color: "#ff8b54",
    iconJlptN3Color: "#ff7f59",
    iconJlptN2Color: "#ff7d68",
    iconJlptN1Color: "#ff7575",
    iconJouyou1Color: "#1da6ff",
    iconJouyou2Color: "#2a9af3",
    iconJouyou3Color: "#3277ea",
    iconJouyou4Color: "#3b5ce8",
    iconJouyou5Color: "#4851f1",
    iconJouyou6Color: "#5e43da",
    iconJouyou7Color: "#7742c3",
    iconJinmeiyouColor: "#7742c3",
    iconNewsColor: "#0096ee",
    iconWikipediaColor: "#53abab",
    iconAnimeDramaColor: "#5c6ebb",
}


export const themeDarkGray: Theme = {
    ...themeLight,
    id: "dark",
    name: "Dark Gray",

    themeColor: "#202122",
    voidBkgColor: "#202122",
    pageBkgColor: "#2c2e31",

    borderColor: "#616671",
    focusOutlineColor: "#77ab00",
    popupOverlayColor: "#00000040",
    popupShadowColor: "#00000060",

    textColor: "#dcddde",
    text2ndColor: "#72767d",
    text3rdColor: "#64666d",
    text4thColor: "#444548",
    textDisabledColor: "#72767d",
    textHighlightBkgColor: "#35363a",
    textStrongBkgColor: "#212225",

    linkHoverColor: "#ffffff",
    linkPressColor: "#5c5d61",

    buttonHoverBkgColor: "#3b3d44",
    buttonPressBkgColor: "#1b1e21",
    buttonAccentColor: "#5ebf3e",
    buttonDangerColor: "#ec4226",
    
    loadingBar1stColor: "#77ab00",
    loadingBar2ndColor: "#dbe19e",
    loadingBarBkgColor: "#202122",

    iconGreenColor: "#3a9c6a",
    iconRedColor: "#c14733",
    iconBlueColor: "#00aaff",
    iconDetailColor: "#020029",
}


const themeDarkBlue: Theme = {
    ...themeLight,
    id: "dark-blue",
    name: "Dark Blue",

    themeColor: "#020029",
    voidBkgColor: "#0e0f15",
    pageBkgColor: "#020029",

    borderColor: "#304579",
    focusOutlineColor: "#557db9",
    popupOverlayColor: "#00000040",
    popupShadowColor: "#00000060",

    textColor: "#9db6dc",
    text2ndColor: "#4761ab",
    text3rdColor: "#2e459a",
    text4thColor: "#233473",
    textDisabledColor: "#2e459a",
    textHighlightBkgColor: "#1c2438",
    textStrongBkgColor: "#1c2438",

    linkHoverColor: "#daecff",
    linkPressColor: "#4f6680",

    buttonHoverBkgColor: "#293044",
    buttonPressBkgColor: "#161d3c",
    buttonAccentColor: "#5ebf3e",
    buttonDangerColor: "#ec4226",
    
    loadingBar1stColor: "#9db6dc",
    loadingBar2ndColor: "#4761ab",
    loadingBarBkgColor: "#2e459a",

    iconGreenColor: "#3a9c6a",
    iconRedColor: "#c14733",
    iconBlueColor: "#00aaff",
    iconDetailColor: "#020029",
}


const themeDarkRed: Theme = {
    ...themeLight,
    id: "dark-red",
    name: "Dark Red",

    themeColor: "#332222",
    voidBkgColor: "#2a1b1b",
    pageBkgColor: "#332222",

    borderColor: "#863b2f",
    focusOutlineColor: "#f16532",
    popupOverlayColor: "#00000040",
    popupShadowColor: "#00000060",

    textColor: "#ecb268",
    text2ndColor: "#bd8149",
    text3rdColor: "#82553b",
    text4thColor: "#6b4935",
    textDisabledColor: "#82553b",
    textHighlightBkgColor: "#562d26",
    textStrongBkgColor: "#562d26",

    linkHoverColor: "#f5deb3",
    linkPressColor: "#a95600",

    buttonHoverBkgColor: "#562d26",
    buttonPressBkgColor: "#290505",
    buttonAccentColor: "#5ebf3e",
    buttonDangerColor: "#ec4226",
    
    loadingBar1stColor: "#926a45",
    loadingBar2ndColor: "#863b2f",
    loadingBarBkgColor: "#bd8149",

    iconGreenColor: "#5ebf3e",
    iconRedColor: "#ec4226",
    iconBlueColor: "#00aaff",
    iconDetailColor: "#332222",
}


const themeHighContrast: Theme = {
    ...themeLight,
    id: "high-contrast",
    name: "High Contrast",

    themeColor: "#000000",
    voidBkgColor: "#000",
    pageBkgColor: "#000",

    borderColor: "#ccc",
    focusOutlineColor: "#0f0",
    popupOverlayColor: "#0000",
    popupShadowColor: "#0000",

    textColor: "#fff",
    text2ndColor: "#ccc",
    text3rdColor: "#aaa",
    text4thColor: "#888",
    textDisabledColor: "#ccc",
    textHighlightBkgColor: "#222",
    textStrongBkgColor: "#222",

    linkHoverColor: "#fff",
    linkPressColor: "#ddd",

    buttonHoverBkgColor: "#000",
    buttonPressBkgColor: "#222",
    buttonAccentColor: "#0f0",
    buttonDangerColor: "#f00",
    
    loadingBar1stColor: "#ddd",
    loadingBar2ndColor: "#666",
    loadingBarBkgColor: "#222",

    iconGreenColor: "#0f0",
    iconYellowColor: "#ff0",
    iconRedColor: "#f00",
    iconBlueColor: "#0af",
    iconDetailColor: "#000",
}


const themeChromaKey: Theme = {
    ...themeLight,
    id: "chroma-key",
    name: "Chroma-Key",

    themeColor: "#000000",
    voidBkgColor: "#00f",
    pageBkgColor: "#00f",

    borderColor: "#fff",
    focusOutlineColor: "#9d0",
    popupOverlayColor: "#0000",
    popupShadowColor: "#0000",

    textColor: "#fff",
    text2ndColor: "#ccc",
    text3rdColor: "#aaa",
    text4thColor: "#888",
    textDisabledColor: "#ccc",
    textStrongBkgColor: "#00d",
    textHighlightBkgColor: "#00d",

    linkHoverColor: "#fff",
    linkPressColor: "#ddd",

    buttonHoverBkgColor: "#00d",
    buttonPressBkgColor: "#008",
    buttonAccentColor: "#0f0",
    buttonDangerColor: "#f00",
    
    loadingBar1stColor: "#77ab00",
    loadingBar2ndColor: "#dbe19e",
    loadingBarBkgColor: "#eeeeee",

    iconGreenColor: "#00ff00",
    iconYellowColor: "#ffaa00",
    iconRedColor: "#f00",
    iconBlueColor: "#6bf",
    iconDetailColor: "#000",
}


export const themes: Theme[] = [
    themeLight,
    themeDarkGray,
    themeDarkBlue,
    themeDarkRed,
    themeHighContrast,
    themeChromaKey,
]


export function makeCssForTheme(
    theme: Theme)
    : string
{
    let globalCssStr = ":root {\n"
    for (const entry of Object.entries(theme))
    {
        if (entry[0] == "name")
            continue
        
        globalCssStr += "--theme-" + entry[0] + ": " + entry[1] + ";\n"
    }
    globalCssStr += "}"

    return globalCssStr
}


export function Theme()
{
    const data = Solid.createMemo(() => {
        const prefs = Framework.usePrefs({ theme: "auto" })
    
        const prefersDark =
            window.matchMedia("(prefers-color-scheme: dark)").matches

        const theme =
            themes.find(th => th.id === prefs.theme) ??
            (prefersDark ? themeDarkGray : themeLight)
            
        const metaThemeColor = document.querySelector("meta[name=theme-color]")
        if (metaThemeColor)
            metaThemeColor.setAttribute(
                "content",
                theme.themeColor ?? "#ffffff")

        return {
            theme,
            globalStyle: Styled.createGlobalStyles`
                ${ makeCssForTheme(theme) }
            `
        }
    })

    return <SolidWeb.Dynamic component={ data().globalStyle }/>
}