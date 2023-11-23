import * as Solid from "solid-js"
import * as Framework from "../framework/index.ts"
import * as App from "../app.tsx"
import { Page } from "../components/Page.tsx"
import { Searchbox } from "../components/Searchbox.tsx"
import { EntryKanji } from "../components/EntryKanji.tsx"
import { EntryKanjiWords } from "../components/EntryKanjiWords.tsx"


export function PageKanjiWords(props: Framework.RouteProps)
{
    const kanji = Solid.createMemo(
        () => props.routeMatch()?.matches[App.Pages.KanjiWords.matchKanji] ?? "")

    const [searchResults] = Solid.createResource(
        kanji,
        async (kanji) => {
            const res = await App.Api.getKanjiWords({
                kanji,
            })
            return res
        })
    
    return <Page title={ `Words for ${ kanji() }` }>
        <Searchbox
            initialText={ kanji() }
            position="inline"
        />
    
        <Solid.Show when={ searchResults() }>
            <Solid.For each={ searchResults()!.entries }>{ (entry, index) =>
                <>
                <EntryKanji
                    entry={ searchResults()!.kanji[index()] }
                    noExampleWords
                />
                <EntryKanjiWords entry={ entry }/>
                </>
            }
            </Solid.For>
        </Solid.Show>
    </Page>
}