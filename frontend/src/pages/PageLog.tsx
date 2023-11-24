import * as Solid from "solid-js"
import { styled } from "solid-styled-components"
import * as Framework from "../framework/index.ts"
import * as App from "../app.tsx"
import { Page } from "../components/Page.tsx"
import { Searchbox } from "../components/Searchbox.tsx"
import { UserIdLink } from "../components/User.tsx"


export function PageLog(props: Framework.RouteProps)
{
    const [data] = Solid.createResource(
        props.routeMatch, // FIXME: Why is this needed?
        async () => {
            const log = await App.Api.logGet()

            return log
        })

        
    return <Page title="Community">

        <Searchbox position="inline"/>
        <br/>

        <Solid.Show when={ data() }>
            <h1>
                Server Log
            </h1>
            <Framework.HorizontalBar/>

            <LogList>
                <Solid.For each={ data()!.entries }>
                { (entry) =>
                    <div>
                        <LogDate>
                            { Framework.dateToIsoStr(entry.date) }
                        </LogDate>
                        { " " }
                        { entry.text }
                    </div>
                }
                </Solid.For>
            </LogList>

        </Solid.Show>
    </Page>
}


export const LogList = styled.div`
    background-color: ${ Framework.themeVar("textStrongBkgColor") };
    border-radius: ${ Framework.themeVar("borderRadius") };
    font-family: monospace;
`


export const LogDate = styled.span`
    color: ${ Framework.themeVar("text3rdColor") };
    font-family: monospace;
    font-size: 0.6em;
`