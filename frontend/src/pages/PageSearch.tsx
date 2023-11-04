import * as Solid from "solid-js"
import * as Framework from "../framework/index.ts"
import * as Api from "../api.ts"
import * as Pages from "../pages.ts"
import { Searchbox } from "../components/Searchbox.tsx"
import { EntryWord } from "../components/EntryWord.tsx"


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
            <Solid.Switch>
                <Solid.Match when={ result.type === "word" }>
                    <EntryWord entry={ result as Api.Word.Entry }/>
                </Solid.Match>
                <Solid.Match when={ result.type === "section" }>
                    <hr/>
                </Solid.Match>
            </Solid.Switch>
        }
        </Solid.For>
    </>
}