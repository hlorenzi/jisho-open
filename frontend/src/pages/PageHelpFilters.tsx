import * as Solid from "solid-js"
import { styled } from "solid-styled-components"
import * as Framework from "../framework/index.ts"
import * as App from "../app.tsx"
import { Page } from "../components/Page.tsx"
import { Searchbox } from "../components/Searchbox.tsx"


export function PageHelpFilters(props: Framework.RouteProps)
{
    return <Page title="Help / Filter Tags">

        <Searchbox position="inline"/>
        <br/>

        <h1>
            Help &gt; 🏷️ Filter Tags
        </h1>

        <br/>
        <h2>Search Examples</h2>
        <Framework.HorizontalBar/>
        <br/>

        Try multiple filter tags together:<br/>
        ・ <SearchLink query="#veryCommon #v5m #vi"/><br/>
        <br/>
        Try negated filter tags with
        <MonospaceBkg>
            !
        </MonospaceBkg>
        to exclude matching words:<br/>
        ・ <SearchLink query="#n1 #common #!veryCommon"/><br/>
        ・ <SearchLink query="#common #v5b #!vt"/><br/>
        <br/>
        Try filter tags supplementing a text query:<br/>
        ・ <SearchLink query="*飛* #common #!n"/><br/>
        ・ <SearchLink query="*を* #!exp"/><br/>
        <br/>
        Note that 
        <MonospaceBkg>
            #!name
        </MonospaceBkg>
        is always implied if you don't specify
        any name-related tags yourself.
        <br/>
        <br/>
        You can also enable Debug Mode via <Framework.IconWrench/> Settings
        to be able to see all filter tags associated with any dictionary entry.

        <br/>
        <br/>
        <br/>
        <h2>🏷️ Available Filter Tags</h2>
        <Framework.HorizontalBar/>
        <br/>

        This list shows only the most common filter tags.<br/>
        For a comprehensive list, refer to the <Framework.Link
            href="https://www.edrdg.org/jmwsgi/edhelp.py?svc=jmdict&sid=#kwabbr"
            label="JMdict documentation"
        />.<br/>
        <br/>

        <TagGrid>

            <TagRow tag="#veryCommon" descr="very common words"/>
            <TagRow tag="#common" descr="very common and somewhat common words"/>
            <TagRow tag="#jlpt" descr="JLPT words in any level"/>
            <TagRow tag="#n5" descr="JLPT N5 words"/>
            <TagRow tag="#n4" descr="JLPT N4 words"/>
            <TagRow tag="#n3" descr="JLPT N3 words"/>
            <TagRow tag="#n2" descr="JLPT N2 words"/>
            <TagRow tag="#n1" descr="JLPT N1 words"/>
            
            <TagRowSkip/>
            <TagRow tag="#n" descr="nouns"/>
            <TagRow tag="#pn" descr="pronouns"/>
            <TagRow tag="#conj" descr="conjunctions"/>
            <TagRow tag="#exp" descr="expressions"/>
            <TagRow tag="#ctr" descr="counters"/>
            <TagRow tag="#prt" descr="particles"/>
            <TagRow tag="#int" descr="interjections"/>
            <TagRow tag="#name" descr="names of people, places, and products"/>

            <TagRowSkip/>
            <TagRow tag="#adj" descr="all adjectives"/>
            <TagRow tag="#adj-i" descr="i-adjectives"/>
            <TagRow tag="#adj-na" descr="na-adjectives"/>
            <TagRow tag="#adj-no" descr="no-adjectives"/>
            <TagRow tag="#adj-pn" descr="pre-noun adjectivals"/>
            <TagRow tag="#adj-t" descr="taru-adjectives"/>
            <TagRow tag="#adj-f" descr="nouns or verbs acting prenominally"/>
            <TagRow tag="#adj-ix" descr="irregular いい adjectives"/>

            <TagRowSkip/>
            <TagRow tag="#adv" descr="all adverbs"/>
            <TagRow tag="#adv-to" descr="to-adverbs"/>

            <TagRowSkip/>
            <TagRow tag="#v" descr="all verbs"/>
            <TagRow tag="#vt" descr="transitive verbs"/>
            <TagRow tag="#vi" descr="intransitive verbs"/>
            <TagRow tag="#v1" descr="ichidan verbs"/>
            <TagRow tag="#v5" descr="godan verbs"/>
            <TagRow tag="#vs" descr="suru verbs"/>
            <TagRow tag="#vk" descr="kuru verbs"/>
            <TagRow tag="#virr" descr="irregular verbs"/>

            <TagRowSkip/>
            <TagRow tag="#v5u" descr="godan verbs ending in う"/>
            <TagRow tag="#v5r" descr="godan verbs ending in る"/>
            <TagRow tag="#v5t" descr="godan verbs ending in つ"/>
            <TagRow tag="#v5k" descr="godan verbs ending in く"/>
            <TagRow tag="#v5g" descr="godan verbs ending in ぐ"/>
            <TagRow tag="#v5s" descr="godan verbs ending in す"/>
            <TagRow tag="#v5b" descr="godan verbs ending in ぶ"/>
            <TagRow tag="#v5m" descr="godan verbs ending in む"/>
            <TagRow tag="#v5n" descr="godan verbs ending in ぬ"/>

            <TagRowSkip/>
            <TagRow tag="#v2" descr="all archaic nidan verbs"/>
            <TagRow tag="#v4" descr="all archaic yodan verbs"/>

            <TagRowSkip/>
            <TagRow tag="#eng" descr="words from English"/>
            <TagRow tag="#por" descr="words from Portuguese"/>
            <TagRow tag="#spa" descr="words from Spanish"/>
            <TagRow tag="#fre" descr="words from French"/>
            <TagRow tag="#ger" descr="words from German"/>
            <TagRow tag="#wasei" descr="wasei words"/>

            <TagRowSkip/>
            <TagRow tag="#heiban" descr="words with heiban pitch accent"/>
            <TagRow tag="#atamadaka" descr="words with atamadaka pitch accent"/>
            <TagRow tag="#nakadaka" descr="words with nakadaka pitch accent"/>
            <TagRow tag="#odaka" descr="words with odaka pitch accent"/>

        </TagGrid>

    </Page>
}


const MonospaceBkg = styled.span`
    font-family: monospace;
    background-color: ${ Framework.themeVar("textStrongBkgColor") };
    border-radius: ${ Framework.themeVar("borderRadius") };
    padding: 0.25em 0.25em;
    margin: 0 0.25em;
`

const TagGrid = styled.div`
    display: grid;
    grid-template: auto / auto auto 1fr;
    grid-row-gap: 0.25em;
    grid-column-gap: 0.5em;
    text-align: baseline;
    align-items: baseline;
`


function SearchLink(props: {
    query: string,
})
{
    return <Framework.Link
        href={ "/search/" + encodeURIComponent(props.query) }
    >
        <MonospaceBkg>
            { props.query }
        </MonospaceBkg>
    </Framework.Link>
}


function TagRow(props: {
    tag: string,
    descr: string,
})
{
    return <>
        <div style={{
            "justify-self": "start",
            "padding-left": "0.5em",
        }}>
            <SearchLink query={ props.tag }/>
        </div>
        <div>
            { props.descr }
        </div>
        <div/>
    </>
}


const TagRowSkip = styled.div`
    grid-column: 1 / -1;
    border-bottom: 1px solid ${ Framework.themeVar("borderColor") };
    margin-top: 0.5em;
    margin-bottom: 0.5em;
`