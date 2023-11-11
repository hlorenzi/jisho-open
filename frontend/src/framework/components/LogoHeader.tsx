import * as Solid from "solid-js"
import { styled } from "solid-styled-components"
import * as Framework from "../index.ts"


export function LogoHeader()
{
    return <header>
        <Framework.Link
            href="/"
            noUnderline
            style={{ display: "block", width: "fit-content" }}
        >
            <Layout>
                <IconWrapper>
                    <Icon
                        src="https://accounts.hlorenzi.com/icon_round_75.png"
                        srcset="
                            https://accounts.hlorenzi.com/icon_round_75.png,
                            https://accounts.hlorenzi.com/icon_round_150.png 2x
                        "
                    />
                </IconWrapper>
                <StyledH1>
                    Lorenzi's Jisho
                    <sup style={{ "font-size": "0.5em" }}>
                        <Framework.TextTag
                            label="v2 Beta"
                            bkgColor={ Framework.themeVar("themeColor") }
                        />
                    </sup>
                </StyledH1>
            </Layout>
        </Framework.Link>
    </header>
}


const Layout = styled.div`
    display: grid;
    margin-top: 0.25em;
    margin-bottom: 0.5em;
    grid-template: auto / auto auto;
    width: fit-content;
    align-content: center;
    align-items: center;
    justify-content: start;
    justify-items: start;
    column-gap: 0.5em;
`


const IconWrapper = styled.div`
    width: 4em;
    height: 4em;
`


const Icon = styled.img`
    height: 100%;
`


const StyledH1 = styled.h1`
    font-size: 1.7em;
    font-weight: 600;
    letter-spacing: -0.04em;
    margin: 0;
    padding: 0;
`