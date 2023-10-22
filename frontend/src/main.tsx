import * as Solid from "solid-js"
import * as SolidWeb from "solid-js/web"
import * as Framework from "./framework/index.ts"


SolidWeb.render(
    App,
    document.getElementById("app")!)


function App()
{
    return <Framework.Router
        routes={[
            { pattern: "", load: async () => () => <Framework.PageTest/> },
            { pattern: "test", load: async () => () => <Framework.PageTest/> },
            { pattern: "*", load: async () => () => <></> },
        ]}
    />
}


export function PageHelloWorld()
{
    return <h1>
        Hello, world!<br/>
        <Framework.Link href="/test">
            Test Page
        </Framework.Link>
    </h1>
}