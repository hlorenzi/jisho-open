import * as Solid from "solid-js"
import { styled } from "solid-styled-components"
import * as Api from "common/api/index.ts"
import * as Inflection from "common/inflection.ts"
import { FuriganaRender } from "./FuriganaRender.tsx"
import { InflectionPath } from "./InflectionPath.tsx"


export function EntryWord(props: {
    entry: Api.Word.Entry
})
{
    return <Entry>
        <strong>
            <Solid.For each={ props.entry.headings }>{ (heading) =>
                <span style={{ "margin-right": "1em" }}>
                    <FuriganaRender encoded={ heading.furigana }/>
                </span>
            }
            </Solid.For>
        </strong>

        <InflectionBreakdown breakdown={ props.entry.inflections }/>
        <Definitions defs={ props.entry.defs }/>
    </Entry>
}


function InflectionBreakdown(props: {
    breakdown?: Inflection.Breakdown,
})
{
    return <Solid.For each={ props.breakdown }>{ (path) =>
        <p> ・ <InflectionPath path={ path }/></p>
    }
    </Solid.For>
}


function Definitions(props: {
    defs: Api.Word.Definition[],
})
{
    let currentPos: string[] = []

    const defs: Solid.JSX.Element[] = []

    for (const def of props.defs)
    {
        // Check whether the part-of-speech tags have changed between definitions
        if (!def.pos.every(pos => currentPos.some(curr => curr === pos)) ||
            !currentPos.every(pos => def.pos.some(curr => curr === pos)))
        {
            defs.push(<PartOfSpeech>{ def.pos.join(", ") }</PartOfSpeech>)
            currentPos = def.pos
        }

        defs.push(<li>{ def.gloss.join("; ") }</li>)
    }

    return <ol>{ defs }</ol>
}


const Entry = styled.article`
    margin-block-end: 1em;
`


const PartOfSpeech = styled.p`
    color: green;
`