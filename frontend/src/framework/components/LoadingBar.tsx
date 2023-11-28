import * as Solid from "solid-js"
import { styled, keyframes } from "solid-styled-components"
import * as Framework from "../index.ts"


export function LoadingBar(props: {
    ignoreLayout?: boolean,
    progress0to100?: number,
})
{
    return <Wrapper ignoreLayout={ !!props.ignoreLayout }>
        <DivClip
            progress0to100={ props.progress0to100 }
        >
            <DivLoadingBar/>
        </DivClip>
    </Wrapper>
}


const height = "10px"
const stripeWidth = 20


const loadingBarKeyframes = keyframes`
    0% {
        transform: translate(-320px, 0);
    }

    100% {
        transform: translate(-240px, 0);
    }
`


const Wrapper = styled.div<{
    ignoreLayout: boolean,
}>`
    position: relative;
    z-index: 1;
    height: ${ height };

    background-color: ${ Framework.themeVar("textStrongBkgColor") };
    border-radius: ${ Framework.themeVar("borderRadius") };

    overflow-x: hidden;
    
    ${ props => props.ignoreLayout ? `
        height: 0;
        overflow-x: visible;
        overflow-y: visible;
        background-color: transparent;
        border-radius: 0;
    ` : `` }
`


const DivClip = styled.div<{
    progress0to100?: number,
}>`
    position: absolute;
    width: 100%;
    height: ${ height };

    transition: clip-path 0.3s;

    clip-path: polygon(
        ${ props => props.progress0to100 === undefined ? -1000 : 0 }% 0%,
        ${ props => props.progress0to100 ?? 1000 }% 0%, 
        ${ props => props.progress0to100 ?? 1000 }% 100%, 
        ${ props => props.progress0to100 === undefined ? -1000 : 0 }% 100%);
`


const DivLoadingBar = styled.div`
    width: 400%;
    height: ${ height };
    outline: none;
    background-color: transparent;
    background-size: calc(100% + 640px) 100%;
    background-repeat: repeat;
    background-image: repeating-linear-gradient(
        -30deg,
        ${ Framework.themeVar("loadingBar1stColor") },
        ${ Framework.themeVar("loadingBar1stColor") } ${ stripeWidth.toString() }px,
        ${ Framework.themeVar("loadingBar2ndColor") } ${ (stripeWidth + 0.5).toString() }px,
        ${ Framework.themeVar("loadingBar2ndColor") } ${ (stripeWidth * 2 - 0.5).toString() }px,
        ${ Framework.themeVar("loadingBar1stColor") } ${ (stripeWidth * 2).toString() }px);

    animation-name: ${ loadingBarKeyframes };
    animation-duration: 1.75s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
`