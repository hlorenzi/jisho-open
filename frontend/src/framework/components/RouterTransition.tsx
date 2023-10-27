import * as Solid from "solid-js"
import * as Styled from "solid-styled-components"
import * as Framework from "../index.ts"


const DivWrapper = Styled.styled("div")`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: #fff8;
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