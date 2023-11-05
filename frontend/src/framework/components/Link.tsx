import * as Solid from "solid-js"
import { styled } from "solid-styled-components"
import * as Framework from "../index.ts"


const Styled = styled.a`
    color: ${ Framework.themeVar("textColor") };

    &:hover {
        color: ${ Framework.themeVar("linkHoverColor") };
    }

    &:active {
        color: ${ Framework.themeVar("linkPressColor") };
    }
`


export function Link(props: Framework.AnchorBehaviorProps & {
    children?: Solid.JSX.Element,
    label?: Solid.JSX.Element,
})
{
    return <Styled
        onClick={ ev => Framework.onAnchorClick(ev, props) }
        title={ props.title }
        href={ props.href || "#" }
        target={ props.target }
    >
        { props.children || props.label }
    </Styled>
}