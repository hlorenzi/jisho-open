import * as Solid from "solid-js"
import { styled } from "solid-styled-components"
import * as Framework from "../framework/index.ts"
import * as Api from "../api.ts"


export function Page(props: {
    title?: string,
    children?: Solid.JSX.Element,
})
{
    return <Framework.Page
        siteTitle="Lorenzi's Jisho Open"
        title={ props.title }
        sideMenu={ () => <SideMenu/> }
    >
        { props.children }
    </Framework.Page>
}


function SideMenu(props: {
})
{
    const [authUser] = Framework.createAsyncSignal(
        Solid.createSignal(null)[0],
        async () => {
            return await Api.authenticate()
        })

    const redirectUrl = window.location.href
        
    return <>
        <Solid.Show when={ !authUser().latest?.id }>
            <Framework.ButtonPopupPageWide
                label="Log in"
                href={ Api.Login.urlForRedirect(redirectUrl) }
                native
            />
        </Solid.Show>

        <Solid.Show when={ authUser().latest?.id }>
            <Framework.ButtonPopupPageWide
                label={ <>
                    <Framework.IconUser/>
                    { authUser().latest!.name }
                </>}
            />
            <Framework.ButtonPopupPageWide
                label="Log out"
                href={ Api.Logout.urlForRedirect(redirectUrl) }
                native
            />
        </Solid.Show>
    </>
}