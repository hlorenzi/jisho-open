import * as Solid from "solid-js"
import { styled } from "solid-styled-components"
import * as Framework from "../framework/index.ts"
import * as App from "../app.tsx"
import { Page } from "../components/Page.tsx"
import { Searchbox } from "../components/Searchbox.tsx"


export function PageHome(props: Framework.RouteProps)
{
    const examples = [
        ["English search", "\"begin\""],
        ["Japanese search", "召し上がる"],
        ["Rōmaji search", "kantoku"],
        ["Partial search", "??直*"],
        ["Filter search", "#common #v5b #!vt"],
        ["Kanji look-up", "国連安保理 #k"],
        ["Kanji search by reading", "na mei #k"],
        ["Kanji search by meaning", "\"power\" #k"],
        ["Inflection breakdown", "食べちゃった"],
        ["Sentence analysis", "毎日私は学校に鉛筆を持っていきますよ。"],
    ]

    return <Page>

        <Searchbox position="inline"/>
        <br/>
        
        <CardList>
            <CardSlot>
                <HighlightAndBold>Lorenzi's Jisho</HighlightAndBold> is
                a web frontend for the
                <Highlight>
                    <Framework.Link
                        href="https://www.edrdg.org/wiki/index.php/JMdict-EDICT_Dictionary_Project"
                        label="JMdict"
                        addSpaces
                    />
                </Highlight>
                project, a Japanese-English dictionary database.
            </CardSlot>
            <CardSlot>
                <Framework.IconMagnifyingGlass/>
                { " " }
                Our search function provides extra features, such
                as pitch accent information, breakdown of inflected phrases,
                and full sentence analysis. <Highlight>
                Try these queries:</Highlight>
                <br/>
                <br/>
                <ul>
                    <Solid.For each={ examples }>
                    { (example) =>
                        <li>
                            { example[0] }:
                            { " " }
                            <Highlight>
                                <Framework.Link
                                    href={ App.Pages.Search.urlForQuery(example[1]) }
                                >
                                    { example[1] }
                                </Framework.Link>
                            </Highlight>
                        </li>
                    }
                    </Solid.For>
                </ul>
            </CardSlot>
            <CardSlot>
                <Framework.IconBookmark/>
                { " " }
                Browse the
                <Highlight>
                    <Framework.Link
                        href={ App.Pages.Community.url }
                        label="study lists"
                        addSpaces
                    />
                </Highlight>
                created by the community!
            </CardSlot>
            <CardSlot>
                <Framework.IconSparkles/>
                { " " }
                The frontend was written in
                <Highlight>
                    <Framework.Link
                        href="https://www.typescriptlang.org/"
                        label="TypeScript"
                        addSpaces
                    />
                </Highlight>
                and uses
                <Highlight>
                    <Framework.Link
                        href="https://www.solidjs.com/"
                        label="Solid"
                        addSpaces
                    />
                </Highlight>
                as the UI management framework!
                Check the repository out on <Highlight>
                    <Framework.Link
                        href={ App.githubUrl }
                        label="GitHub"
                    />
                </Highlight>!
            </CardSlot>
        </CardList>
    </Page>
}


const CardList = styled.div`
    display: flex;
    flex-wrap: wrap;
    width: 100%;
`


const Highlight = styled.span`
    color: ${ Framework.themeVar("textColor") };
`


const HighlightAndBold = styled.span`
    font-weight: bold;
    color: ${ Framework.themeVar("textColor") };
`


const CardSlot = styled.div`
    display: inline-block;
    flex-grow: 1;
    flex-basis: 50em;
    margin: 0.25em;
    color: ${ Framework.themeVar("text2ndColor") };
    background-color: ${ Framework.themeVar("textStrongBkgColor") };
    border-radius: ${ Framework.themeVar("borderRadius") };
    padding: 1em;
`