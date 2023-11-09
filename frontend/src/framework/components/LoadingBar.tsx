import * as Solid from "solid-js"
import { styled, keyframes } from "solid-styled-components"
import * as Framework from "../index.ts"


export function LoadingBar(props: {
    height?: number,
})
{
    return <Wrapper>
        <DivLoadingBar
            height={ props.height ?? 10 }
        />
    </Wrapper>
}


const stripeWidth = 20


const loadingBarKeyframes = keyframes`
    0%
    {
        transform: translate(-320px, 0);
    }

    100%
    {
        transform: translate(-240px, 0);
    }
`


const Wrapper = styled.div`
    height: 0;
    overflow-y: visible;
`


const DivLoadingBar = styled.div<{
    height: number,
}>`
    width: 200%;
    height: ${ props => props.height }px;
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