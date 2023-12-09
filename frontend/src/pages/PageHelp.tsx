import * as Solid from "solid-js"
import { styled } from "solid-styled-components"
import * as Framework from "../framework/index.ts"
import * as App from "../app.tsx"
import { Page } from "../components/Page.tsx"


export function PageHelp(props: Framework.RouteProps)
{
    return <Page title="Help">

        <br/>
        <h1>Help</h1>
        <Framework.HorizontalBar/>
        <br/>

        <Framework.Link
            label="🎴 Anki Import and Card Styling"
            href={ App.Pages.HelpAnki.url }
        />

    </Page>
}