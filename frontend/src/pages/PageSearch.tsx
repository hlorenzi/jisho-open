import * as Solid from "solid-js"
import * as Framework from "../framework/index.ts"
import * as Api from "../api.ts"
import * as Pages from "../pages.ts"
import { Searchbox } from "../components/Searchbox.tsx"


export function PageSearch(props: Framework.RouteProps)
{
    const searchQuery = Solid.createMemo(
        () => props.routeMatch()?.matches[Pages.Search.matchQuery] ?? "")

    const [searchResults] = Solid.createResource(
        searchQuery,
        async (searched) => {
            const res = await Api.search({
                query: searchQuery(),
            })
            console.log("PageSearch Api.search", searched, res)
            return res.entries
        })
    
    return <>
        <h2>Lorenzi's Jisho</h2>

        <Framework.Link href="/test">Test Page</Framework.Link><br/><br/>

        <Searchbox
            initialText={ searchQuery() }
        />

        <Solid.Show when={ searchResults.loading }>
            <Framework.LoadingBar/>
        </Solid.Show>
    
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