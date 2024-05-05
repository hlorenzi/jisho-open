import * as Solid from "solid-js"
import { styled } from "solid-styled-components"
import * as Framework from "../framework/index.ts"
import * as App from "../app.tsx"
import * as Kana from "common/kana.ts"
import * as JmdictTags from "common/jmdict_tags.ts"
import * as Furigana from "common/furigana.ts"
import { FuriganaSideBySide } from "./Furigana.tsx"
import * as Tags from "./Tags.tsx"


export function EntryKanjiWords(props: {
    entry: App.Api.KanjiWordCrossRef.Entry
})
{
    return <Entry>

        <WordBuckets
            kanji={ props.entry.id }
            wordBuckets={ props.entry.readings }
        />
    </Entry>
}


const Entry = styled.article`
    margin-block-end: 0.75em;
`


function WordBuckets(props: {
    kanji: string,
    wordBuckets: App.Api.KanjiWordCrossRef.ReadingBucket[],
})
{
    const bucketExpandedSignal = (bucket: string) =>
        Framework.createHistorySignal(`wordBucket:${ bucket }`, false)

    return <WordBucketsLayout>
        <Solid.For each={ props.wordBuckets }>{ (wordBucket) => {

            const [isExpanded, setIsExpanded] =
                bucketExpandedSignal(wordBucket.reading)

            const wordEntries = Solid.createMemo(() =>
                wordBucket.entries.slice(0, !isExpanded() ? 5 : undefined))

            const additionalEntryNum =
                wordBucket.entries.length - 5
            
            return <>
                <Divider/>

                <Reading>
                    <Framework.Link
                        onClick={ () => additionalEntryNum > 0 && setIsExpanded(!isExpanded()) }
                        noUnderline
                        style={{ display: "inline-block", height: "100%" }}
                    >
                        { wordBucket.reading || "others" }
                    </Framework.Link>
                </Reading>
                
                <Words>
                    <Solid.For each={ wordEntries() }>{ (word) => {
                        const furigana = Furigana.decode(word.furigana)

                        return <WordEntry>
                            <Framework.Link
                                href={ App.Pages.Search.urlForBaseReading(Furigana.extractBase(furigana), Furigana.extractReading(furigana)) }
                                noUnderline
                            >
                                <WordHeading>
                                    <span>
                                        { Furigana.extractBase(furigana) }
                                    </span>
                                    <WordTagsWrapper>
                                        <Tags.TagCommonness
                                            commonness={ word.commonness }
                                        />
                                        <Tags.TagJlpt
                                            jlpt={ word.jlpt }
                                        />
                                        <Tags.TagAteji
                                            show={ word.ateji }
                                        />
                                        <Tags.TagGikun
                                            show={ word.gikun }
                                        />
                                        <Solid.Show when={ word.rare }>
                                            <Framework.IconArrowDownHollow
                                                title="rare"
                                                color={ Framework.themeVar("iconBlueColor") }
                                            />
                                        </Solid.Show>
                                        <Solid.Show when={ word.outdated }>
                                            <Framework.IconArrowDown
                                                title="outdated"
                                                color={ Framework.themeVar("iconBlueColor") }
                                            />
                                        </Solid.Show>
                                        <Solid.Show when={ word.irregular }>
                                            <Framework.IconIrregular
                                                title="irregular"
                                                color={ Framework.themeVar("iconRedColor") }
                                            />
                                        </Solid.Show>
                                    </WordTagsWrapper>
                                    <FuriganaSideBySide
                                        skipBase
                                        highlightKanji={ props.kanji }
                                        furigana={ furigana }
                                    />
                                </WordHeading>
                            </Framework.Link>
                            <WordSense>
                                { word.sense }
                            </WordSense>
                            <br/>
                        </WordEntry>
                    }}
                    </Solid.For>

                    <span style={{ color: Framework.themeVar("text3rdColor") }}>
                        <Solid.Show when={ additionalEntryNum > 0 && !isExpanded() }>
                            <Framework.Link
                                label={ `+${ additionalEntryNum }` }
                                onClick={ () => setIsExpanded(true) }
                            />
                        </Solid.Show>

                        <Solid.Show when={ isExpanded() }>
                            <Framework.Link
                                label={ `- Collapse` }
                                onClick={ () => setIsExpanded(false) }
                            />
                        </Solid.Show>
                    </span>
                </Words>
            </>
        }}
        </Solid.For>
    </WordBucketsLayout>
}


const WordBucketsLayout = styled.div`
    display: grid;
    grid-template: auto / auto 1fr;
    grid-row-gap: 0.5em;
    grid-column-gap: 0.5em;
`


const Divider = styled.div`
    grid-column: 1 / 3;
    border-bottom: 1px solid ${ Framework.themeVar("borderColor") };
`


const Reading = styled.div`
    border-right: 1px solid ${ Framework.themeVar("borderColor") };
    color: ${ Framework.themeVar("text2ndColor") };
    font-size: 0.8em;
    font-weight: ${ App.cssVarJapaneseFontWeight };
    writing-mode: vertical-lr;
    display: inline-block;
    justify-content: stretch;
    width: fit-content;
    text-align: center;
`


const Words = styled.div`
    overflow-x: hidden;
    align-self: center;
`


const WordEntry = styled.div`
    text-indent: -1em;
    padding-left: 1em;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow-x: hidden;
`


const WordHeading = styled.span`
    font-weight: ${ App.cssVarJapaneseFontWeight };
`


const WordTagsWrapper = styled.sup`
    font-size: 0.5em;
`


const WordSense = styled.span`
    color: ${ Framework.themeVar("text2ndColor") };
`