import * as Solid from "solid-js"
import { styled, keyframes } from "solid-styled-components"
import * as Framework from "../index.ts"


export function RouterTransition(props: {
    firstLoad: boolean,
})
{
    return <DivWrapper inert>
        <Framework.LoadingBar ignoreLayout/>

        <Solid.Show when={ props.firstLoad }>
            <Framework.Welcome/>
        </Solid.Show>
    </DivWrapper>
}


const DivWrapper = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: ${ Framework.themeVar("pageTransitionOverlayColor") };
    z-index: 10000;
`


export function RouterTransitionEnd()
{
    return <DivWrapperEnd inert/>
}


const backdropKeyframes = keyframes`
    0% {
	    background-color: ${ Framework.themeVar("voidBkgColor") };
    }

    50% {
	    background-color: ${ Framework.themeVar("voidBkgColor") };
    }

    100% {
	    background-color: transparent;
    }
`


const DivWrapperEnd = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: transparent;
    z-index: 10000;
    
    animation-name: ${ backdropKeyframes };
    animation-duration: 0.1s;
    animation-fill-mode: forwards;
`