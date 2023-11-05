import * as Solid from "solid-js"
import { styled } from "solid-styled-components"


const Styled = styled.div<{
    textColor: string,
    bkgColor: string,
}>`
    display: inline-block;
    position: relative;
    margin: 0 0.05em;
    padding: 0.1em 0.25em;
    border-radius: 0.25em;
    font-weight: bold;
    color: ${ props => props.textColor };
    background-color: ${ props => props.bkgColor };
    text-indent: 0;
    user-select: none;
`


export function TextTag(props: {
    title: string,
    label: string,
    textColor?: string,
    bkgColor?: string,
})
{
    return <Styled
        lang="en"
        title={ props.title }
        textColor={ props.textColor ?? "white" }
        bkgColor={ props.bkgColor ?? "gray" }
    >
        { props.label }
    </Styled>
}