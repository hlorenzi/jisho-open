import * as Solid from "solid-js"
import { styled } from "solid-styled-components"


const StyledSvg = styled.svg<{
    color: string,
}>`
    position: relative;
    top: 0;
    width: 1.25em;
    height: 1.25em;
    margin: -0.25em 0.05em;
    pointer-events: none;
    color: ${ props => props.color };
`


export type IconBaseProps = {
    title?: string
    viewBox?: string
    marginRight?: boolean
    style?: Solid.JSX.CSSProperties
    children?: Solid.JSX.Element
    color?: string
}


export function IconBase(props: IconBaseProps)
{
	return <span title={ props.title }>
        <StyledSvg
            viewBox={ props.viewBox || "0 0 100 100" }
            color={ props.color ?? "currentColor" }
            style={ props.style }
        >
            { props.children }
        </StyledSvg>

        { !props.marginRight ? null :
            " "
        }
    </span>
}