import * as Solid from "solid-js"
import { styled } from "solid-styled-components"


const DivTextTag = styled.div<{
    color: string,
    bkgColor: string,
}>`
    display: inline-block;
    position: relative;
    margin: 0 0.05em;
    padding: 0.1em 0.25em;
    border-radius: 0.25em;
    font-weight: bold;
    color: ${ props => props.color };
    background-color: ${ props => props.bkgColor };
    text-indent: 0;
    user-select: none;
`


export function TextTag(props: {
    title: string,
    label: string,
    color?: string,
    bkgColor?: string,
})
{
    return <DivTextTag
        lang="en"
        title={ props.title }
        color={ props.color ?? "white" }
        bkgColor={ props.bkgColor ?? "gray" }
    >
        { props.label }
    </DivTextTag>
}