import * as Styled from "solid-styled-components"


export function themeVar<T extends keyof Theme>(
    name: T)
    : string
{
    return `var(--theme-${ name })`
}


export type Theme = {
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
    iconJouyou8Color: string
    iconJouyou9Color: string
    iconJouyou10Color: string
    iconNewsColor: string
    iconWikipediaColor: string
    iconAnimeDramaColor: string
}


export const themeLight: Theme = {
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
    textHighlightBkgColor: "#fffcaa",

    linkHoverColor: "#408000",
    linkPressColor: "#224400",

    buttonHoverBkgColor: "#f0f0f0",
    buttonPressBkgColor: "#dddddd",
    buttonAccentColor: "#77ab00",
    buttonDangerColor: "#ff682f",
    
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
    iconJouyou8Color: "#7742c3",
    iconJouyou9Color: "#7742c3",
    iconJouyou10Color: "#7742c3",
    iconNewsColor: "#0096ee",
    iconWikipediaColor: "#53abab",
    iconAnimeDramaColor: "#5c6ebb",
}


export const themeDarkGray: Theme = {
    ...themeLight,

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
    text3rdColor: "#444548",
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


export const themes: Theme[] = [
    themeLight,
    themeDarkGray,
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
    const prefersDark =
        window.matchMedia("(prefers-color-scheme: dark)").matches

    const theme = prefersDark ? themeDarkGray : themeLight

    const metaThemeColor = document.querySelector("meta[name=theme-color]")
    if (metaThemeColor)
        metaThemeColor.setAttribute("content", theme.themeColor || "#ffffff")

    const GlobalStyles = Styled.createGlobalStyles`
        ${ makeCssForTheme(theme) }
    `
    return <GlobalStyles/>
}