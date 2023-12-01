import * as Solid from "solid-js"
import { styled, keyframes } from "solid-styled-components"
import * as Framework from "../index.ts"


export function RouterTransition(props: {
    firstLoad: boolean,
})
{
    let dialogRef: HTMLDialogElement | undefined = undefined

    Solid.createEffect(() => {
        dialogRef?.showModal()
    })

    return <DivWrapper ref={ dialogRef } inert>
        <Framework.LoadingBar ignoreLayout/>

        <Solid.Show when={ props.firstLoad }>
            <Framework.Welcome/>
        </Solid.Show>
    </DivWrapper>
}


const backdropKeyframes = keyframes`
    0% {
	    opacity: 0;
    }

    100% {
	    opacity: 1
    }
`


const DivWrapper = styled.dialog`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    margin: 0;
    padding: 0;
    border: 0;
    overflow: hidden;
    background-color: ${ Framework.themeVar("pageTransitionOverlayColor") };
    z-index: 10000;

    animation-name: ${ backdropKeyframes };
    animation-duration: 0.5s;
    animation-fill-mode: forwards;
`


export function RouterTransitionEnd()
{
    return <DivWrapperEnd inert/>
}


const backdropEndKeyframes = keyframes`
    0% {
	    opacity: 1;
    }

    50% {
	    opacity: 1;
    }

    100% {
	    opacity: 0;
    }
`


const DivWrapperEnd = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: ${ Framework.themeVar("voidBkgColor") };
    z-index: 10000;
    
    animation-name: ${ backdropEndKeyframes };
    animation-duration: 0.1s;
    animation-fill-mode: forwards;
`