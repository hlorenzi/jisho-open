import * as Solid from "solid-js"
import { styled } from "solid-styled-components"
import * as Framework from "../framework/index.ts"
import * as App from "../app.tsx"
import { Page } from "../components/Page.tsx"
import { Searchbox } from "../components/Searchbox.tsx"
import { EntryWord } from "../components/EntryWord.tsx"
import { EntryKanji } from "../components/EntryKanji.tsx"
import { EntrySentence } from "../components/EntrySentence.tsx"


const limitStart = 10
const limitIncrease = 20


export function PageSearch(props: Framework.RouteProps)
{
    const query = Solid.createMemo(
        () => props.routeMatch()?.matches[App.Pages.Search.matchQuery] ?? "")

    const tokenIndex = Solid.createMemo(() => {
        const tokenStr = props.routeMatch()?.matches[App.Pages.Search.matchToken]
        if (!tokenStr)
            return undefined

        return parseInt(tokenStr)
    })
    
    return <Page title={ query() } searchQuery={ query() }>

        <Searchbox
            initialText={ query() }
            position="inline"
        />

        <SearchboxMarginBottom/>

        <SearchResults
            query={ query }
            tokenIndex={ tokenIndex }
        />
    
    </Page>
}


const SearchboxMarginBottom = styled.div`
    margin-bottom: 0.5em;
`


function SearchResults(props: {
    query: Solid.Accessor<string>,
    tokenIndex?: Solid.Accessor<number | undefined>,
})
{
    const [limit, setLimit] = Framework.createHistorySignal("limit", limitStart)

    const [searchResults] = Solid.createResource(
        () => [props.query(), limit()] as const,
        async (data) => {
            const res = await App.Api.search({
                query: data[0],
                limit: data[1],
            })
            return res
        })

    const queryToken = Solid.createMemo(() => {
        if (!props.tokenIndex)
            return ""

        const tokenIndex = props.tokenIndex()
        if (tokenIndex === undefined)
            return ""

        const sentence = searchResults.latest?.entries[1]
        if (!sentence ||
            sentence.type !== "sentence")
            return ""

        const token = sentence.tokens[tokenIndex]
        if (!token)
            return ""

        if (token.category === "prt" &&
            token.surface_form.length === 1)
            return token.surface_form + " #" + token.category + " #!sentence"

        return token.surface_form + " #!sentence"
    })

    const onIncreaseLimit = () => {
        (document.activeElement as any)?.blur()
        setLimit(limit() + limitIncrease)
    }
    
    return <>
        <Solid.Show when={ searchResults.loading }>
            <Framework.LoadingBar ignoreLayout/>
        </Solid.Show>

        <Results inert={ searchResults.loading ? true : undefined }>
            <Solid.For
                each={ queryToken() === "" ?
                    searchResults.latest?.entries :
                    searchResults.latest?.entries.slice(0, 2) }
            >
            { (result, index) =>
                <Solid.Switch>

                    <Solid.Match when={ result.type === "word" }>
                        <EntryWord
                            entry={ result as App.Api.Word.Entry }
                            query={ searchResults.latest!.query }
                        />
                    </Solid.Match>

                    <Solid.Match when={ result.type === "kanji" }>
                        <EntryKanji entry={ result as App.Api.Kanji.Entry }/>
                    </Solid.Match>

                    <Solid.Match when={ result.type === "sentence" }>
                        <EntrySentence
                            entry={ result as App.Api.Search.SentenceAnalysis }
                            query={ searchResults.latest!.query }
                            tokenIndex={ props.tokenIndex?.() }
                        />
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
                                onClick={ onIncreaseLimit }
                                disabled={ searchResults.loading }
                                noUnderline
                            />
                        </SectionContinue>
                    </Solid.Match>

                    <Solid.Match when={
                        result.type === "section" &&
                        result.section === "end" &&
                        (searchResults.latest?.entries[0].type !== "section" ||
                            searchResults.latest?.entries[0].section !== "sentence" ||
                            searchResults.latest?.entries.length > 3)
                    }>
                        <Framework.HorizontalBar/>
                        <SectionEnd>
                            { searchResults.latest!.entries.length <= 1 ?
                                `No results.` :
                                `End of results.`
                            }
                        </SectionEnd>
                    </Solid.Match>

                </Solid.Switch>
            }
            </Solid.For>
        </Results>

        <Solid.Show when={ searchResults.loading && limit() > limitStart }>
            <Framework.LoadingBar ignoreLayout/>
        </Solid.Show>

        <Solid.Show when={ queryToken() !== "" }>
            <SearchResults
                query={ queryToken }
            />
        </Solid.Show>
    </>
}


const Results = styled.div`
    &[inert] {
        /* opacity: 0.5; */
    }
`


const SectionContinue = styled.div`
    margin: 1em 0;
    color: ${ Framework.themeVar("text3rdColor") };
    font-style: italic;
`


const SectionEnd = styled.div`
    margin: 1em 0;
    color: ${ Framework.themeVar("text3rdColor") };
    font-style: italic;
`