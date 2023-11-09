import * as Solid from "solid-js"
import { styled } from "solid-styled-components"
import * as Framework from "../framework/index.ts"
import * as Api from "../api.ts"
import * as Pages from "../pages.ts"
import { Searchbox } from "../components/Searchbox.tsx"
import { EntryWord } from "../components/EntryWord.tsx"
import { EntryKanji } from "../components/EntryKanji.tsx"


const defaultLimit = 10


export function PageSearch(props: Framework.RouteProps)
{
    const searchQuery = Solid.createMemo(
        () => props.routeMatch()?.matches[Pages.Search.matchQuery] ?? "")

    const [limit, setLimit] = Framework.createHistorySignal("limit", defaultLimit)

    const [searchResults] = Solid.createResource(
        () => [searchQuery(), limit()] as const,
        async (src) => {
            const res = await Api.search({
                query: src[0],
                limit: src[1],
            })
            console.log("PageSearch Api.search", src[0], res)
            return res
        })
    
    return <Framework.Page title={ searchQuery() }>
        <Searchbox
            initialText={ searchQuery() }
        />

        <Solid.Show when={ searchResults.loading }>
            <Framework.LoadingBar/>
        </Solid.Show>
    
        <Solid.For each={ searchResults.latest?.entries }>{ (result, index) =>
            <Solid.Switch>

                <Solid.Match when={ result.type === "word" }>
                    <EntryWord
                        entry={ result as Api.Word.Entry }
                        query={ searchResults.latest!.query }
                    />
                </Solid.Match>

                <Solid.Match when={ result.type === "kanji" }>
                    <EntryKanji entry={ result as Api.Kanji.Entry }/>
                </Solid.Match>

                <Solid.Match when={
                    result.type === "section" &&
                    result.section !== "continue" &&
                    result.section !== "end" &&
                    index() > 0
                }>
                    <Framework.HorizontalBar/>
                </Solid.Match>

                <Solid.Match when={
                    result.type === "section" &&
                    result.section === "continue"
                }>
                    <Framework.HorizontalBar/>
                    <SectionContinue>
                        <Framework.Link
                            label={ <>
                                <Framework.IconVerticalEllipsis/>
                                Load more results
                            </> }
                            onClick={ () => setLimit(limit() + 20) }
                            disabled={ searchResults.loading }
                            noUnderline
                        />
                    </SectionContinue>
                </Solid.Match>

                <Solid.Match when={
                    result.type === "section" &&
                    result.section === "end"
                }>
                    <Framework.HorizontalBar/>
                    <SectionEnd>
                        End of results.
                    </SectionEnd>
                </Solid.Match>

            </Solid.Switch>
        }
        </Solid.For>

        <Solid.Show when={ searchResults.loading }>
            <Framework.LoadingBar/>
        </Solid.Show>
    
    </Framework.Page>
}


const SectionContinue = styled.div`
    margin: 1em 0;
    color: ${ Framework.themeVar("text3rdColor") };
`


const SectionEnd = styled.div`
    margin: 1em 0;
    color: ${ Framework.themeVar("text3rdColor") };
    font-style: italic;
`