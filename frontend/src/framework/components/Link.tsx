import * as Solid from "solid-js"
import * as Styled from "solid-styled-components"
import * as Framework from "../index.ts"


export function Link(props: Framework.AnchorBehaviorProps & {
    children?: Solid.JSX.Element,
    label?: Solid.JSX.Element,
})
{
    return <a
        onClick={ ev => Framework.onAnchorClick(ev, props) }
        title={ props.title }
        href={ props.href || "#" }
        target={ props.target }
    >
        { props.children || props.label }
    </a>
}