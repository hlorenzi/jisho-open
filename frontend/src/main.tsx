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
    const [searchbox, setSearchbox] = Solid.createSignal("はし")

    const [searched, setSearched] = Solid.createSignal("")

    const [searchResults, setSearchResults] = Solid.createResource(
        searched,
        async (searched) => {
            const res = await Api.search({
                query: searchbox(),
            })
            console.log("search", searched, res)
            return res.entries
        })

    const onSearch = async () => {
        setSearched(searchbox())
    }
    
    return <>
        <h2>Lorenzi's Jisho</h2>
        <Framework.Link href="/test">
            Test Page
        </Framework.Link>
        <br/>
        <br/>
        <input
            type="text"
            value={ searchbox() }
            onInput={ ev => setSearchbox(ev.target.value) }
            onKeyDown={ ev => { if (ev.key === "Enter") onSearch() }}/>
        <button onClick={ onSearch }>
            Search
        </button>
        <br/>
        <br/>
        <Solid.For each={ searchResults.latest }>{ (result) =>
            <article>
                <strong>
                    <Solid.For each={ result.headings }>{ (heading) =>
                        <>
                        <ruby>
                            { heading.base }
                            <rt>{ heading.reading }</rt>
                        </ruby>
                        { " - " }
                        </>
                    }
                    </Solid.For>
                </strong>
                <Solid.For each={ result.defs }>{ (def) =>
                    <div> - { def.gloss.join("; ") }</div>
                }
                </Solid.For>
                <br/>
            </article>
        }
        </Solid.For>
    </>
}