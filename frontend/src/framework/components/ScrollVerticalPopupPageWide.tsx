import * as Solid from "solid-js"
import { styled } from "solid-styled-components"


export function ScrollVerticalPopupPageWide(props: {
    height: string,
    heightMobile?: string,
    children?: Solid.JSX.Element,
    style?: Solid.JSX.CSSProperties,
})
{
    return <Layout
        height={ props.height }
        heightMobile={ props.heightMobile }
        style={ props.style }
    >
        { props.children }
    </Layout>
}


const Layout = styled.div<{
    height: string,
    heightMobile?: string,
}>`
    overflow-x: hidden;
    overflow-y: auto;
    width: calc(100% + var(--local-pagePadding) * 2);
    height: ${ props => props.height };
    
    @media (pointer: coarse)
    {
        height: ${ props => props.heightMobile ?? props.height };
    }

    margin: 0;
    margin-left: calc(0px - var(--local-pagePadding));
    margin-right: calc(0px - var(--local-pagePadding));
    padding-left: var(--local-pagePadding);
    padding-right: var(--local-pagePadding);
`