import * as Solid from "solid-js"
import { styled } from "solid-styled-components"
import * as Framework from "../framework/index.ts"
import * as Pages from "../pages.ts"
import * as Api from "common/api/index.ts"
import * as Kana from "common/kana.ts"
import * as Inflection from "common/inflection.ts"
import * as JmdictTags from "common/jmdict_tags.ts"
import { FuriganaRuby } from "./Furigana.tsx"
import { InflectionBreakdown } from "./InflectionBreakdown.tsx"
import { PitchAccentRender } from "./PitchAccentRender.tsx"
import * as Tags from "./Tags.tsx"


export function EntrySentence(props: {
    entry: Api.Search.SentenceAnalysis,
    query: Api.Search.Query,
    tokenIndex: number | undefined,
})
{
    return <Entry>
        <Sentence>
            <Solid.For each={ props.entry.tokens }>
            { (token, index) =>
                <Token
                    isCurrent={ index() === props.tokenIndex }
                >
                    <Framework.Link
                        href={ Pages.Search.urlForQueryToken(props.query.strRaw, index()) }
                        noReload={ props.tokenIndex !== undefined /* avoid a Solid.Suspense bug? */ }
                        noUnderline
                    >
                        <FuriganaRuby
                            encoded={ token.furigana }
                        />
                    </Framework.Link>
                </Token>
            }
            </Solid.For>
        </Sentence>

        <Solid.Show when={ props.tokenIndex === undefined }>
            <Information>
                Click one of the sentence fragments above to search.
            </Information>
        </Solid.Show>
    </Entry>
}


const Entry = styled.article`
    margin-bottom: 0.5em;
`


const Sentence = styled.article`
    margin-bottom: 0.5em;
    padding: 0.5em;
    font-size: 1.35em;
    background-color: ${ Framework.themeVar("textStrongBkgColor") };
    border-radius: ${ Framework.themeVar("borderRadius") };
`


const Information = styled.article`
    color: ${ Framework.themeVar("text3rdColor") };
    font-style: italic;
`


const Token = styled.span<{
    isCurrent: boolean,
}>`
    margin: 0 0.2em;

    ${ props => props.isCurrent ? `
        border-bottom: 4px solid ${ Framework.themeVar("focusOutlineColor") };
        font-weight: bold;
    ` : `` }
`