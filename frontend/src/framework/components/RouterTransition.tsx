import * as Solid from "solid-js"
import { styled } from "solid-styled-components"
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


const DivWrapper = styled("div")`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: ${ Framework.themeVar("pageTransitionOverlayColor") };
    z-index: 1;
`