import * as Solid from "solid-js"
import { styled } from "solid-styled-components"
import * as Framework from "../index.ts"


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
    label: string,
    title?: string,
    textColor?: string,
    bkgColor?: string,
    href?: string,
})
{
    return <Styled
        lang="en"
        title={ props.title }
        textColor={ props.textColor ?? Framework.themeVar("iconDetailColor") }
        bkgColor={ props.bkgColor ?? Framework.themeVar("textStrongBkgColor") }
    >
        { props.label }
    </Styled>
}