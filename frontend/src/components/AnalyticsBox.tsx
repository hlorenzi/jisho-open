import * as Solid from "solid-js"
import { styled } from "solid-styled-components"
import * as Framework from "../framework/index.ts"
import * as App from "../app.tsx"
import * as Pages from "../pages.ts"


export function AnalyticsBox()
{
    const analytics = Framework.createAsyncSignal(
        () => {},
        async () => {
            return App.Api.analyticsDailyGet()
        })

    
    const formatInteger = (value?: number): string => {
        if (value === undefined)
            return "---"

        const separator = ","

        if (value < 1000)
            return value.toString()

        if (value < 1_000_000)
            return Math.floor(value / 1000).toFixed(0) + separator +
                (value % 1000).toString().padStart(3, "0")

        return Math.floor(value / 1_000_000).toFixed(0) + separator +
            Math.floor(value / 1000).toFixed(0).padStart(3, "0") + separator +
            (value % 1000).toString().padStart(3, "0")
    }


    return <AnalyticsLayout>
        <div style={{ "justify-self": "start" }}>
            Daily stats:
        </div>

        <div>
            <AnalyticsNumber>
                { formatInteger(analytics().latest?.["search"]?.value) }
            </AnalyticsNumber>
            <br/>
            searches
        </div>

        <div>
            <AnalyticsNumber>
                { formatInteger(analytics().latest?.["studylistWordAdd"]?.value) }
            </AnalyticsNumber>
            <br/>
            words added to study lists
        </div>

        <div>
            <AnalyticsNumber>
                { formatInteger(analytics().latest?.["studylistId"]?.value) }
            </AnalyticsNumber>
            <br/>
            study lists used
        </div>
    </AnalyticsLayout>
}


const AnalyticsLayout = styled.div`
    flex-grow: 1;
    flex-basis: 50em;
    margin: 0.25em;
    padding: 1em;
    color: ${ Framework.themeVar("text2ndColor") };
    background-color: ${ Framework.themeVar("textStrongBkgColor") };
    border-radius: ${ Framework.themeVar("borderRadius") };
    display: grid;
    grid-template: 1fr / auto auto auto auto;
    column-gap: 2em;
    align-items: center;
    justify-items: center;
    text-align: center;
`


const AnalyticsNumber = styled.span`
    font-size: 1.25em;
    font-weight: bold;
`