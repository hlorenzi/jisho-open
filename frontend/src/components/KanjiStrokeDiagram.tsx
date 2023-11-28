import * as Solid from "solid-js"
import { styled } from "solid-styled-components"
import * as Framework from "../framework/index.ts"


export function KanjiStrokeDiagram(props: {
    kanji: string,
    style?: Solid.JSX.CSSProperties,
})
{
    const owner = Solid.getOwner()

    const [svgPanels] = Solid.createResource(
        props.kanji,
        async (kanji) => {
            const kanjiUnicode = kanji
                .codePointAt(0)!
                .toString(16)
                .padStart(5, "0")
        
            const kanjiVgUrl =
                `https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/${ kanjiUnicode }.svg`
        
            const res = await fetch(kanjiVgUrl)
            if (!res.ok)
                return [<div>(No stroke diagram available.)</div>]

            const svgText = await res.text()
            const parser = new DOMParser()
            const svg = parser.parseFromString(svgText, "image/svg+xml")
            
            const strokeCount = countStrokesRecursively(svg.documentElement)
            return Solid.runWithOwner(owner, () => {
                const svgPanels: Solid.JSX.Element[] = []
                for (let panel = 0; panel < strokeCount; panel++)
                    svgPanels.push(buildSvg(svg, panel))
                return svgPanels
            })
        })

    return <Solid.Suspense fallback={ <Framework.LoadingBar/> }>
        <Layout style={ props.style }>
            { svgPanels() }
        </Layout>
    </Solid.Suspense>
}


const Layout = styled.div`
    text-align: center;
`


function countStrokesRecursively(node: Element): number
{
    let count = 0

    if (node.tagName === "path")
        count++

    for (const child of node.children)
        count += countStrokesRecursively(child)

    return count
}


type SvgBuildData = {
    renderPrev: Solid.JSX.Element[],
    renderMain: Solid.JSX.Element[],
    renderNext: Solid.JSX.Element[],
    strokeIndex: number,
    panelIndex: number,
}


function buildSvg(
    svg: Document,
    panelIndex: number)
    : Solid.JSX.Element
{
    const data: SvgBuildData = {
        renderPrev: [],
        renderMain: [],
        renderNext: [],
        strokeIndex: 0,
        panelIndex,
    }
    
    buildSvgRecursively(data, svg.documentElement)

    return <svg
        viewBox="0 0 109 109"
        style={{ width: "5.25em", "min-width": 0 }}
    >
        <path
            fill="none"
            stroke={ Framework.themeVar("borderColor") }
            stroke-width={ 2 }
            stroke-linecap="round"
            stroke-linejoin="round"
            d="
                M 0,0
                L 109,0
                L 109,109
                L 0,109
                Z
        "/>

        <path
            fill="none"
            stroke={ Framework.themeVar("text4thColor") }
            stroke-width={ 2 }
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-dasharray="5,5"
            d="
                M 0,54.5
                L 109,54.5
                M 54.5,0
                L 54.5,109
        "/>

        { data.renderNext }
        { data.renderPrev }
        { data.renderMain }

        <text
            x="4" y="4"
            fill={ Framework.themeVar("text3rdColor") }
            dominant-baseline="hanging"
            style={{ "user-select": "none" }}
        >
            { panelIndex + 1 }
        </text>
    </svg>
}


function buildSvgRecursively(data: SvgBuildData, node: Element)
{
    if (node.tagName == "path")
    {
        const strokeColor =
            data.strokeIndex == data.panelIndex ?
                Framework.themeVar("textColor") :
            data.strokeIndex < data.panelIndex ?
                Framework.themeVar("text3rdColor") :
                "transparent"

        const d = node.getAttribute("d")!
        const path = <path
            fill={ "none" }
            stroke={ strokeColor }
            stroke-width={ 3 }
            stroke-linecap="round"
            stroke-linejoin="round"
            d={ d }
        />

        if (data.strokeIndex == data.panelIndex)
        {
            data.renderMain.push(path)

            const point = d.slice(d.toLowerCase().indexOf("m") + 1)
            const x = parseFloat(point.slice(0, point.indexOf(",")))
            const y = parseFloat(point.slice(point.indexOf(",") + 1))

            data.renderMain.push(<circle
                cx={ x }
                cy={ y }
                r={ 4 }
                fill={ Framework.themeVar("iconRedColor") }
            />)
        }
        else if (data.strokeIndex < data.panelIndex)
            data.renderPrev.push(path)
        else
            data.renderNext.push(path)

        data.strokeIndex++
    }

    for (const child of node.children)
    {
        buildSvgRecursively(data, child)
    }
}