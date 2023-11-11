import * as Solid from "solid-js"
import { styled } from "solid-styled-components"
import * as Framework from "../index.ts"


export function LogoHeader(props: {
    sideMenuFn?: () => Solid.JSX.Element,
})
{
    const popup = Framework.makePopupSideMenu({
        childrenFn: props.sideMenuFn,
    })

    return <Layout>
        <Framework.Link
            href="/"
            noUnderline
            style={{ display: "block", width: "fit-content" }}
        >
            <LogoLayout>
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
            </LogoLayout>
        </Framework.Link>

        <div/>

        <Framework.Button
            label={ <Framework.IconMenu/> }
            title="Menu"
            onClick={ popup.open }
            noBorder
            style={{ width: "3em", height: "3em"}}
        />

        { popup.rendered }
    </Layout>
}


const Layout = styled.header`
    display: grid;
    margin-top: 0.25em;
    margin-bottom: 0.5em;
    grid-template: auto / auto 1fr auto;
    width: 100%;
    align-content: center;
    align-items: center;
    justify-content: start;
    justify-items: start;
`


const LogoLayout = styled.div`
    display: grid;
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