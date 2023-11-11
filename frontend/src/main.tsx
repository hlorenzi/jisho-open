import * as Solid from "solid-js"
import * as SolidWeb from "solid-js/web"
import * as Framework from "./framework/index.ts"
import * as Api from "./api.ts"
import * as Pages from "./pages.ts"


SolidWeb.render(
    App,
    document.getElementById("app")!)


function App()
{
    return <>
        <Framework.Theme/>
        <Framework.Router
            routes={[
                { patterns: ["/", Pages.Search.urlPattern, Pages.Search.urlPatternToken],
                    acceptsNoReload: true,
                    load: async () => (await import("./pages/PageSearch.tsx")).PageSearch },

                { patterns: [Pages.KanjiWords.urlPattern],
                    load: async () => (await import("./pages/PageKanjiWords.tsx")).PageKanjiWords },

                { patterns: [Pages.LoginFake.urlPattern],
                    load: async () => (await import("./pages/PageLoginFake.tsx")).PageLoginFake },
    
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