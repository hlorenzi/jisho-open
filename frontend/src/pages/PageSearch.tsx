import * as Solid from "solid-js"
import * as Framework from "../framework/index.ts"
import * as Api from "../api.ts"
import * as Pages from "../pages.ts"
import { Searchbox } from "../components/Searchbox.tsx"
import { EntryWord } from "../components/EntryWord.tsx"
import { EntryKanji } from "../components/EntryKanji.tsx"


export function PageSearch(props: Framework.RouteProps)
{
    const searchQuery = Solid.createMemo(
        () => props.routeMatch()?.matches[Pages.Search.matchQuery] ?? "")

    Solid.createComputed(() => {
        document.title = `${ searchQuery() } • Lorenzi's Jisho Open`
    })

    const [searchResults] = Solid.createResource(
        searchQuery,
        async (searched) => {
            const res = await Api.search({
                query: searchQuery(),
            })
            console.log("PageSearch Api.search", searched, res)
            return res.entries
        })
    
    return <Framework.Page>
        <Framework.LogoHeader/>
        <br/>
        <Searchbox
            initialText={ searchQuery() }
        />
        <br/>

        <Solid.Show when={ searchResults.loading }>
            <Framework.LoadingBar/>
        </Solid.Show>
    
        <Solid.For each={ searchResults.latest }>{ (result, index) =>
            <Solid.Switch>
                <Solid.Match when={ result.type === "section" && index() > 0 }>
                    <Framework.HorizontalBar/>
                </Solid.Match>
                <Solid.Match when={ result.type === "word" }>
                    <EntryWord entry={ result as Api.Word.Entry }/>
                </Solid.Match>
                <Solid.Match when={ result.type === "kanji" }>
                    <EntryKanji entry={ result as Api.Kanji.Entry }/>
                </Solid.Match>
            </Solid.Switch>
        }
        </Solid.For>
    </Framework.Page>
}