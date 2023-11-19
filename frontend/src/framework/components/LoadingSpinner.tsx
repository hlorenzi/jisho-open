import * as Solid from "solid-js"
import { styled, keyframes } from "solid-styled-components"
import * as Framework from "../index.ts"


export function LoadingSpinner(props: {
    size?: string,
    ignoreLayout?: boolean,
})
{
    return <Wrapper ignoreLayout={ !!props.ignoreLayout }>
        <DivLoadingSpinner
            size={ props.size ?? "2em" }
        />
    </Wrapper>
}


const loadingBarKeyframes = keyframes`
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
`


const Wrapper = styled.div<{
    ignoreLayout: boolean,
}>`
    z-index: 1;
    
    ${ props => props.ignoreLayout ? `
        height: 0;
        overflow-y: visible;
    ` : `` }
`


const DivLoadingSpinner = styled.div<{
    size: string,
}>`
    width: ${ props => props.size };
    height: ${ props => props.size };

    border-radius: 50%;
    border-top: 0.5rem solid ${ Framework.themeVar("loadingBar1stColor") };
    border-right: 0.5rem solid ${ Framework.themeVar("loadingBar2ndColor") };
    border-bottom: 0.5rem solid ${ Framework.themeVar("loadingBar1stColor") };
    border-left: 0.5rem solid ${ Framework.themeVar("loadingBar2ndColor") };

    outline: none;

    animation-name: ${ loadingBarKeyframes };
    animation-duration: 1.75s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
`