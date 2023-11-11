import * as Solid from "solid-js"
import { styled } from "solid-styled-components"
import * as Framework from "../framework/index.ts"
import * as Api from "../api.ts"
import * as Pages from "../pages.ts"
import { Searchbox } from "../components/Searchbox.tsx"
import { EntryWord } from "../components/EntryWord.tsx"
import { EntryKanji } from "../components/EntryKanji.tsx"
import { EntrySentence } from "../components/EntrySentence.tsx"


const limitStart = 10
const limitIncrease = 20


export function PageSearch(props: Framework.RouteProps)
{
    const query = Solid.createMemo(
        () => props.routeMatch()?.matches[Pages.Search.matchQuery] ?? "")

    const tokenIndex = Solid.createMemo(() => {
        const tokenStr = props.routeMatch()?.matches[Pages.Search.matchToken]
        if (!tokenStr)
            return undefined

        return parseInt(tokenStr)
    })
    
    return <Framework.Page title={ query() }>

        <Searchbox
            initialText={ query() }
        />

        <SearchResults
            query={ query }
            tokenIndex={ tokenIndex }
        />
    
    </Framework.Page>
}


function SearchResults(props: {
    query: Solid.Accessor<string>,
    tokenIndex?: Solid.Accessor<number | undefined>,
})
{
    const [limit, setLimit] = Framework.createHistorySignal("limit", limitStart)

    const [searchResults] = Solid.createResource(
        () => [props.query(), limit()] as const,
        async (data) => {
            const res = await Api.search({
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

        const sentence = searchResults.latest?.entries[0]
        if (!sentence ||
            sentence.type !== "sentence")
            return ""

        const token = sentence.tokens[tokenIndex]
        if (!token)
            return ""

        if (token.category === "prt")
            return token.surface_form + " #" + token.category + " #!sentence"

        return token.surface_form + " #!sentence"
    })
    
    return <>
        <Solid.Show when={ searchResults.loading }>
            <Framework.LoadingBar ignoreLayout/>
        </Solid.Show>

        <Results inert={ searchResults.loading ? true : undefined }>
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

                    <Solid.Match when={ result.type === "sentence" }>
                        <EntrySentence
                            entry={ result as Api.Search.SentenceAnalysis }
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
                                onClick={ () => setLimit(limit() + limitIncrease) }
                                disabled={ searchResults.loading }
                                noUnderline
                            />
                        </SectionContinue>
                    </Solid.Match>

                    <Solid.Match when={
                        result.type === "section" &&
                        result.section === "end" &&
                        searchResults.latest!.entries[0]?.type === "sentence"
                    }>
                        <Solid.Show when={ queryToken() === "" }>
                            <Framework.HorizontalBar/>
                            <SectionEnd>
                                Click one of the sentence fragments above to search.
                            </SectionEnd>
                        </Solid.Show>
                    </Solid.Match>

                    <Solid.Match when={
                        result.type === "section" &&
                        result.section === "end"
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
        opacity: 0.5;
    }
`


const SectionContinue = styled.div`
    margin: 1em 0;
    color: ${ Framework.themeVar("text3rdColor") };
`


const SectionEnd = styled.div`
    margin: 1em 0;
    color: ${ Framework.themeVar("text3rdColor") };
    font-style: italic;
`