import * as Solid from "solid-js"
import * as Styled from "solid-styled-components"


const stripeWidth = 20


const loadingBarKeyframes = Styled.keyframes`
    0%
    {
        transform: translate(-320px, 0);
    }

    100%
    {
        transform: translate(-240px, 0);
    }
`


const DivLoadingBar = Styled.styled("div")(
    (props: {
        height: number,
    }) => `
    --theme-loadingBar1stColor: #77ab00;
    --theme-loadingBar2ndColor: #dbe19e;

    width: 200%;
    height: ${ props.height }px;
    outline: none;
    background-color: transparent;
    background-size: calc(100% + 640px) 100%;
    background-repeat: repeat;
    background-image: repeating-linear-gradient(
        -30deg,
        var(--theme-loadingBar1stColor),
        var(--theme-loadingBar1stColor) ${ stripeWidth }px,
        var(--theme-loadingBar2ndColor) ${ stripeWidth + 0.5 }px,
        var(--theme-loadingBar2ndColor) ${ stripeWidth * 2 - 0.5 }px,
        var(--theme-loadingBar1stColor) ${ stripeWidth * 2 }px);

    animation-name: ${ loadingBarKeyframes };
    animation-duration: 1.75s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
`)


export function LoadingBar(props: {
    height?: number,
})
{
    return <DivLoadingBar
        height={ props.height ?? 10 }
    />
}