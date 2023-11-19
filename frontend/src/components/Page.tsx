import * as Solid from "solid-js"
import { styled } from "solid-styled-components"
import * as Framework from "../framework/index.ts"
import * as App from "../app.tsx"
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
    const authUser = Framework.createAsyncSignal(
        null,
        async () => {
            return await App.Api.authenticate()
        })

    const [isSettingsOpen, setSettingsOpen] = Solid.createSignal(false)

    const redirectUrl = window.location.href
        
    return <>
        <Solid.Show when={ !isSettingsOpen() }>
            <Framework.ButtonPopupPageWide
                label="Home"
                href={ "/" }
            />

            <Framework.ButtonPopupPageWide
                label="Community"
                href={ "/" }
            />

            <Framework.HorizontalBar/>

            <Framework.ButtonPopupPageWide
                icon={ <Framework.IconWrench/> }
                label="Settings"
                onClick={ () => setSettingsOpen(true) }
            />

            <Framework.ButtonPopupPageWide
                icon={ <Framework.IconHelp/> }
                label="Help"
            />

            <Framework.HorizontalBar/>

            <Solid.Show when={ !authUser().loading } fallback={
                <Framework.LoadingSpinner/>
            }>
                <Solid.Show when={ !authUser().latest?.id }>
                    <Framework.ButtonPopupPageWide
                        label="Log in"
                        href={ App.Api.Login.urlForRedirect(redirectUrl) }
                        native
                    />
                    <Framework.ButtonPopupPageWide
                        label=""
                        disabled
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
            </Solid.Show>
        </Solid.Show>
        
        <Solid.Show when={ isSettingsOpen() }>
            <SettingsPanel
                back={ () => setSettingsOpen(false) }
            />
        </Solid.Show>
    </>
}


function SettingsPanel(props: {
    back: () => void,
})
{
    return <>
        <Framework.ButtonPopupPageWide
            icon={ <Framework.IconArrowLeft/> }
            label="Back"
            onClick={ props.back }
        />

        <Framework.HorizontalBar/>
        
        <Framework.Select
            label="Theme"
            value={ () => App.usePrefs().theme }
            onChange={ (value) => App.mergePrefs({ theme: value }) }
            options={ [
                { label: "System Light/Dark", value: Framework.systemThemeId },
                ...Framework.themes.map(th => ({
                    label: th.name,
                    value: th.id,
                })),
            ]}
        />
        
        <Framework.Select
            label="Japanese Font Style"
            value={ () => App.usePrefs().japaneseFontStyle }
            onChange={ (value) => App.mergePrefs({ japaneseFontStyle: value }) }
            options={ [
                { label: "Regular", value: "regular" },
                { label: "Bold", value: "bold" },
            ]}
        />

        <Framework.HorizontalBar/>
        
        <Framework.Select
            label="Debug Mode"
            value={ () => App.usePrefs().debugMode ? "on" : "off" }
            onChange={ (value) => App.mergePrefs({ debugMode: value === "on" }) }
            options={ [
                { label: "Off", value: "off" },
                { label: "On", value: "on" },
            ]}
        />

    </>
}