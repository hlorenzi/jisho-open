import * as Solid from "solid-js"
import { styled } from "solid-styled-components"
import * as Framework from "../framework/index.ts"
import * as App from "../app.tsx"
import { Page } from "../components/Page.tsx"
import { Searchbox } from "../components/Searchbox.tsx"
import { AnalyticsBox } from "../components/AnalyticsBox.tsx"


export function PageHome(props: Framework.RouteProps)
{
    const examples = [
        ["English search", "\"begin\""],
        ["Japanese search", "召し上がる"],
        ["Rōmaji search", "kantoku"],
        ["Partial search", "??直*"],
        ["Filter search", "#common #v5b #!vt"],
        ["Name search", "eiji #name"],
        ["Kanji look-up", "国連安保理 #k"],
        ["Kanji search by reading", "na mei #k"],
        ["Kanji search by meaning", "\"power\" #k"],
        ["Kanji search by components", "冂虫 #c"],
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
                Japanese-English dictionary project!
                It was written in
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
                as the UI management framework.
                Check the repository out on <Highlight>
                    <Framework.Link
                        href={ App.githubUrl }
                        label="GitHub"
                    />
                </Highlight>!
            </CardSlot>
            
            <AnalyticsBox/>
            
            <CardSlot>
                <Framework.IconBookmark/>
                { " " }
                You can create and
                <Highlight>
                    <Framework.Link
                        href={ App.Pages.Community.url }
                        label="share"
                        addSpaces
                    />
                </Highlight>
                custom study lists with your searched words,
                and you can export them in an <Highlight><Framework.Link
                    href="https://apps.ankiweb.net/"
                    label="Anki"
                /></Highlight>-compatible format.
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
                        <ExampleLink>
                            { example[0] }:
                            { " " }
                            <Highlight>
                                <Framework.Link
                                    href={ App.Pages.Search.urlForQuery(example[1]) }
                                >
                                    { example[1] }
                                </Framework.Link>
                            </Highlight>
                        </ExampleLink>
                    }
                    </Solid.For>
                </ul>
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


const ExampleLink = styled.li`
    margin-bottom: 0.25em;
`