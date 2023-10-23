import * as Solid from "solid-js"
import * as SolidWeb from "solid-js/web"
import * as Framework from "./framework/index.ts"
import * as Api from "./api.ts"


SolidWeb.render(
    App,
    document.getElementById("app")!)


function App()
{
    return <Framework.Router
        routes={[
            { pattern: "", load: async () => () => <PageHelloWorld/> },
            { pattern: "test", load: async () => () => <Framework.PageTest/> },
            { pattern: "*", load: async () => () => <></> },
        ]}
    />
}


export function PageHelloWorld()
{
    const search = async () => {
        const res = await Api.search({
            query: "test",
        })
        console.log(res)
    }

    return <h1>
        Hello, world!
        <br/>
        <Framework.Link href="/test">
            Test Page
        </Framework.Link>
        <br/>
        <br/>
        <button onClick={ search }>
            Search
        </button>
    </h1>
}