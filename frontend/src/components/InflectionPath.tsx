import * as Solid from "solid-js"
import { styled } from "solid-styled-components"
import * as Inflection from "common/inflection.ts"


export function InflectionPath(props: {
    path: Inflection.BreakdownPath,
})
{
    const steps: Solid.JSX.Element[] = []

    for (const step of props.path)
    {
        const ruleDisplay = Inflection.table.groups.get(step.ruleId)!.display

        steps.push(<span>{ step.sourceTerm }</span>)
        steps.push(<span>{" 🡆 ["}{ ruleDisplay }{ "] " }</span>)
    }

    steps.push(<span>{ props.path[props.path.length - 1].targetTerm }</span>)

    return <>{ steps }</>
}