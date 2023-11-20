import * as Solid from "solid-js"
import { styled } from "solid-styled-components"
import * as Framework from "../index.ts"


const StyledAnchor = styled.a<{
    noUnderline: boolean,
}>`
    border-radius: ${ Framework.themeVar("borderRadius") };

    color: currentColor;
    transition: color 0.05s;

    ${ props => props.noUnderline ?
        `text-decoration: none;` :
        ``
    }

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
    noUnderline?: boolean,
    addSpaces?: boolean,
    style?: Solid.JSX.CSSProperties,
})
{
    return <>
        <Solid.Show when={ props.addSpaces }>
            { " " }
        </Solid.Show>
        <StyledAnchor
            onClick={ ev => Framework.onAnchorClick(ev, props) }
            title={ props.title }
            href={ props.href || "#" }
            target={ props.target }
            noUnderline={ !!props.noUnderline }
            style={ props.style }
        >
            { props.children || props.label }
        </StyledAnchor>
        <Solid.Show when={ props.addSpaces }>
            { " " }
        </Solid.Show>
    </>
}