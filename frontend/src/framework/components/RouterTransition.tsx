import * as Solid from "solid-js"
import { styled } from "solid-styled-components"
import * as Framework from "../index.ts"


const DivWrapper = styled("div")`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: ${ Framework.themeVar("pageTransitionOverlayColor") };
    z-index: 1;
`


export function RouterTransition(props: {
    height?: number,
})
{
    return <DivWrapper inert>
        <Framework.LoadingBar/>
    </DivWrapper>
}