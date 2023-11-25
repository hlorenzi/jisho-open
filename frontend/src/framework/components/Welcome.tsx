import * as Solid from "solid-js"
import { styled } from "solid-styled-components"
import * as Framework from "../index.ts"


export function Welcome(props: {
    message?: string,
})
{
    return <>
        <Layout>
            <IconWrapper>
                <Framework.Image
                    src="https://accounts.hlorenzi.com/icon_round_256.png"
                    style={{ height : "100%" }}
                />
            </IconWrapper>
        </Layout>
    </>
}


const Layout = styled.header`
    display: grid;
    grid-template: 1fr auto 1fr / 1fr auto 1fr;
    width: 100%;
    min-height: 100vh;
    align-content: center;
    align-items: center;
    justify-content: start;
    justify-items: start;
`


const IconWrapper = styled.div`
    width: 12em;
    height: 12em;
    opacity: 0.5;
    grid-column: 2;
    grid-row: 2;
`