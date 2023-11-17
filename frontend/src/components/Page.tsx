import * as Solid from "solid-js"
import { styled } from "solid-styled-components"
import * as Framework from "../framework/index.ts"
import * as App from "../app.ts"
import { UserLabel } from "../components/User.tsx"


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
            return await App.Api.authenticate()
        })

    const redirectUrl = window.location.href
        
    return <>
        <Framework.ButtonPopupPageWide
            label="Home"
            href={ "/" }
        />

        <Framework.ButtonPopupPageWide
            label="Community"
            href={ "/" }
        />

        <Framework.HorizontalBar/>
        
        <Solid.Show when={ !authUser().latest?.id }>
            <Framework.ButtonPopupPageWide
                label="Log in"
                href={ App.Api.Login.urlForRedirect(redirectUrl) }
                native
            />
        </Solid.Show>

        <Solid.Show when={ authUser().latest?.id }>
            <Framework.ButtonPopupPageWide
                label={ <UserLabel user={ authUser().latest }/> }
                href={ App.Pages.User.urlForUserId(authUser().latest!.id!) }
            />
            <Framework.ButtonPopupPageWide
                label="Log out"
                href={ App.Api.Logout.urlForRedirect(redirectUrl) }
                native
            />
        </Solid.Show>

        <Framework.HorizontalBar/>
        
        <Framework.Select
            label="Theme"
            value={ () => App.usePrefs().theme }
            onChange={ (value) => App.mergePrefs({ theme: value }) }
            options={ [
                { label: "Auto Light/Dark", value: "auto" },
                ...Framework.themes.map(th => ({
                    label: th.name,
                    value: th.id,
                })),
            ]}
        />
    </>
}