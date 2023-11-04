import * as Solid from "solid-js"
import * as SolidWeb from "solid-js/web"
import * as Framework from "./framework/index.ts"
import * as Api from "./api.ts"
import * as Pages from "./pages.ts"
import { PageSearch } from "./pages/PageSearch.tsx"


SolidWeb.render(
    App,
    document.getElementById("app")!)


function App()
{
    return <>
        <Framework.Theme/>
        <Framework.Router
            routes={[
                { patterns: ["/", Pages.Search.urlPattern],
                    noReload: true,
                    load: async () => PageSearch },

                { patterns: ["/test"],
                    load: async () => Framework.PageTest },

                { patterns: ["*"],
                    load: async () => () => <h2>Page not found</h2> },
            ]}
        />
    </>
}


export function PageHelloWorld()
{
    return <>
        <h2>Lorenzi's Jisho</h2>
        <Framework.Link href="/test">
            Test Page
        </Framework.Link>
    </>
}