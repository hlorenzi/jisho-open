import * as Solid from "solid-js"
import { styled } from "solid-styled-components"
import * as Framework from "../index.ts"


export function Error(props: {
    message?: string,
})
{
    return <>
        <Layout>
            <LogoLayout>
                <IconWrapper>
                    <Framework.Image
                        src="https://accounts.hlorenzi.com/icon_round_256.png"
                        style={{ height : "100%" }}
                    />
                </IconWrapper>

                <div>
                    { props.message }

                    <br/>
                    <br/>
                
                    <Framework.Link
                        label="Back to Home"
                        href="/"
                    />
                </div>
            </LogoLayout>
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


const LogoLayout = styled.div`
    grid-row: 2;
    grid-column: 2;
    display: grid;
    grid-template: auto / auto auto;
    width: fit-content;
    align-content: center;
    align-items: center;
    justify-content: start;
    justify-items: start;
    column-gap: 1em;
`


const IconWrapper = styled.div`
    width: 8em;
    height: 8em;
    opacity: 0.5;
`