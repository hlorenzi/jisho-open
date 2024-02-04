import * as Solid from "solid-js"
import { styled } from "solid-styled-components"
import * as Framework from "../framework/index.ts"
import * as App from "../app.tsx"
import { Page } from "../components/Page.tsx"
import { Searchbox } from "../components/Searchbox.tsx"
import { PitchAccentRender } from "../components/PitchAccentRender.tsx"
import { FuriganaRuby } from "../components/Furigana.tsx"
import * as Tags from "../components/Tags.tsx"


export function PageHelpSymbols(props: Framework.RouteProps)
{
    return <Page title="Help / Symbols and Notation">

        <Searchbox position="inline"/>
        <br/>

        <h1>
            Help &gt; 🔣 Symbols and Notation
        </h1>
        <br/>
        
        <h2>Word Icons</h2>
        <Framework.HorizontalBar/>

        <WordIconsGrid>

            <Tags.TagCommonness commonness={ "veryCommon" }/>

            <div>
                The word is very frequently used
                (with this specific spelling variant).
            </div>

            <Tags.TagCommonness commonness={ "common" }/>

            <div>
                The word is somewhat commonly used
                (with this specific spelling variant).
            </div>

            <Tags.TagIrregularKanji show/>

            <div>
                This spelling variant is irregular.
            </div>

            <Tags.TagRareKanji show/>

            <div>
                This spelling variant is rarely used.
            </div>

            <Tags.TagOutdatedKanji show/>

            <div>
                This spelling variant is outdated or historical.
            </div>

            <Tags.TagNonJouyou show/>

            <div>
                This spelling variant uses kanji from outside the jōyō list.
            </div>

            <Tags.TagAteji show/>

            <div>
                This spelling variant uses ateji reading, which is when
                kanji are used purely phonetically, disregarding their individual meanings.
            </div>

            <Tags.TagGikun show/>

            <div>
                This spelling variant uses gikun reading (also called jukujikun), which is when
                kanji are used purely semantically, disregarding their individual readings.
            </div>

            <Tags.TagSearchOnlyKanji show/>

            <div>
                This spelling variant is included for more easily matching to user searches,
                but should not be considered to be in standard use.
            </div>

        </WordIconsGrid>


        <br/>
        <br/>
        <h2>Furigana</h2>
        <Framework.HorizontalBar/>

        <FuriganaBorder>
            <FuriganaRuby furigana={ [["大人", "おとな"], ["っぽい", ""]] }/>
        </FuriganaBorder>
        <FuriganaBorder>
            <FuriganaRuby furigana={ [["此間", "こないだ"]] }/>
        </FuriganaBorder>
        <br/>
        A dotted line above a group of kanji indicates
        indivisible reading compounds. These can usually be attributed to
        gikun, but they can also occur due to other linguistic
        phenomenons.


        <br/>
        <br/>
        <br/>
        <h2>Pitch Accent</h2>
        <Framework.HorizontalBar/>

        <div style={{ "font-size": "1.25em" }}>
            <PitchAccentRender pitch="ꜛはꜜし"/>
            <PitchAccentRender pitch="はꜛしꜜ"/>
            <PitchAccentRender pitch="はꜛし"/>
        </div>
        The lines indicate where the accent is.
        <br/>
        <br/>
        In the first example, accent is on は.
        <br/>
        In the second and third examples, it is on し.
        <br/>
        <br/>
        If there is no final pitch drop, as in the third example,
        any particles following the word should also be accented.
        <br/>

        <br/>
        <div style={{ "font-size": "1.25em" }}>
            <PitchAccentRender pitch="しょꜛく*ひん"/>
        </div>
        A dotted border indicates that the syllable is devoiced, which
        means that the corresponding vowel is less pronounced.
        <br/>

        <br/>
        <div style={{ "font-size": "1.25em" }}>
            <PitchAccentRender pitch="ひꜛげ~"/>
        </div>
        A wavy underline indicates that the syllable is nasalized.

    </Page>
}


const WordIconsGrid = styled.div`
    display: grid;
    grid-template: auto / auto 1fr;
    grid-gap: 0.5em;
    text-align: baseline;
    align-items: baseline;
`


const FuriganaBorder = styled.div`
    display: inline-block;
    background-color: ${ Framework.themeVar("textStrongBkgColor") };
    border-radius: ${ Framework.themeVar("borderRadius") };
    padding: 0.6em 0.25em 0 0.25em;
    margin-right: 1em;
    font-size: 1.5em;
`