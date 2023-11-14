import * as Solid from "solid-js"
import { styled } from "solid-styled-components"
import * as Framework from "../index.ts"


const StyledHr = styled.hr`
    border: 0;
    border-bottom: 1px solid ${ Framework.themeVar("borderColor") };

    margin-top: 0.25em;
    margin-bottom: 0.25em;
    
	padding-left:  var(--local-pagePadding);
	padding-right: var(--local-pagePadding);
	margin-left:   calc(0px - var(--local-pagePadding));
    margin-right:  calc(0px - var(--local-pagePadding));

    .PopupPageWide & {
        margin-top: 0;
        margin-bottom: 0;

        &:first-child {
            border-bottom: 0;
        }
    }
`


export function HorizontalBar(props: {
    style?: Solid.JSX.CSSProperties,
})
{
	return <StyledHr
        style={ props.style }
    />
}