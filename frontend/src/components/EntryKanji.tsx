import * as Solid from "solid-js"
import { styled } from "solid-styled-components"
import * as Framework from "../framework/index.ts"
import * as Pages from "../pages.ts"
import * as Api from "common/api/index.ts"
import * as Kana from "common/kana.ts"
import * as JmdictTags from "common/jmdict_tags.ts"
import * as Furigana from "common/furigana.ts"
import { FuriganaSideBySide } from "./Furigana.tsx"
import * as Tags from "./Tags.tsx"


export function EntryKanji(props: {
    entry: Api.Kanji.Entry
})
{
    const commonness = JmdictTags.getKanjiCommonness(props.entry)

    return <Entry>
        <Header>
            <KanjiCharacter>
                { props.entry.id }
                
                <KanjiTagsWrapper>
                    <Tags.TagCommonness commonness={ commonness }/>
                    <Tags.TagJlpt jlpt={ props.entry.jlpt }/>
                </KanjiTagsWrapper>

            </KanjiCharacter>
            <div>
                <div>
                    { props.entry.meanings.join("; ") }
                </div>
                <TagsWrapper>
                    <Tags.TagJouyou jouyou={ props.entry.jouyou }/>
                    <Tags.TagKanjiNews rankNews={ props.entry.rankNews }/>
                </TagsWrapper>
            </div>
        </Header>

        <ReadingsLayout>
            <Solid.Show when={ props.entry.kunyomi.length !== 0 }>
                <ReadingsLabel>kun'yomi:</ReadingsLabel>
                <div>
                    <Solid.For each={ props.entry.kunyomi }>{ (kunyomi) =>
                        <Reading reading={ kunyomi }/>
                    }
                    </Solid.For>
                </div>
            </Solid.Show>

            <Solid.Show when={ props.entry.onyomi.length !== 0 }>
                <ReadingsLabel>on'yomi:</ReadingsLabel>
                <div>
                    <Solid.For each={ props.entry.onyomi }>{ (onyomi) =>
                        <Reading reading={ onyomi }/>
                    }
                    </Solid.For>
                </div>
            </Solid.Show>

            <ReadingsLabel>strokes:</ReadingsLabel>
            <div>
                <StrokeCount>
                    { props.entry.strokeCount }
                    <Solid.Show when={ props.entry.strokeCounts }>
                        (or { props.entry.strokeCounts!.join(", ") })
                    </Solid.Show>
                </StrokeCount>

                <span style={{
                    "margin-left": "1em",
                    "font-size": "0.8em",
                    color: Framework.themeVar("text3rdColor"),
                }}>
                    <Framework.Link
                        label={ <>
                            <Framework.IconMagnifyingGlass/>
                            View diagram
                        </>}
                    />
                </span>
            </div>
        </ReadingsLayout>

        <br/>

        <ExampleWords
            kanji={ props.entry.id }
            exampleWords={ props.entry.exampleWords }
        />

        <span style={{
            "font-size": "0.8em",
            color: Framework.themeVar("text3rdColor"),
        }}>
            <Framework.Link
                label={ <>
                    <Framework.IconVerticalEllipsis/>
                    View all { props.entry.wordCount ?? 0 } words
                </>}
            />
        </span>
    </Entry>
}


const Entry = styled.article`
    margin-block-end: 0.75em;
`


const Header = styled.div`
    display: grid;
    grid-template: auto / auto 1fr;
    align-items: center;
    justify-items: start;
    justify-content: start;
    column-gap: 1em;
    margin-top: -1em;
    margin-bottom: -1em;
`


const KanjiCharacter = styled.div`
    font-size: 6em;
    font-weight: bold;
`


const KanjiTagsWrapper = styled.sup`
    position: relative;
    top: -2em;
    font-size: 0.15em;
`


const TagsWrapper = styled.div`
    font-size: 0.8em;
    margin-top: 0.25em;
`


const ReadingsLayout = styled.div`
    display: grid;
    grid-template: auto auto / auto 1fr;
    align-items: baseline;
    justify-items: start;
    justify-content: start;
    column-gap: 1em;
`


const ReadingsLabel = styled.div`
    justify-self: end;
    font-size: 0.8em;
    color: ${ Framework.themeVar("text2ndColor") };
`


const StrokeCount = styled.div`
    display: inline-block;
    font-weight: bold;
`


export function Reading(props: {
    reading: Api.Kanji.Reading
})
{
    return <ReadingEntry
        faded={ props.reading.commonness === undefined }
    >
        { props.reading.text }
        <ReadingTagsWrapper>
            <Tags.TagCommonness
                commonness={ props.reading.commonness }
            />
        </ReadingTagsWrapper>
    </ReadingEntry>
}


const ReadingEntry = styled.div<{
    faded: boolean,
}>`
    display: inline-block;
    margin-inline-end: 1em;
    font-weight: bold;

    color: ${ props => props.faded ?
        Framework.themeVar("text3rdColor") :
        Framework.themeVar("textColor")
    };
`


const ReadingTagsWrapper = styled.sup`
    font-size: 0.5em;
`


function ExampleWords(props: {
    kanji: string,
    exampleWords: Api.KanjiWordCrossRef.Word[],
})
{
    return <ExampleWordLayout>
        <Solid.For each={ props.exampleWords }>{ (exampleWord) => {
            const furigana = Furigana.decode(exampleWord.furigana)

            return <ExampleWordEntry>
                <Framework.Link
                    href={ Pages.Search.urlForQuery(Furigana.extractBase(Furigana.decode(exampleWord.furigana))) }
                    noUnderline
                >
                    <ExampleWordHeading>
                        <span>
                            { Furigana.extractBase(furigana) }
                        </span>
                        <ExampleWordTagsWrapper>
                            <Tags.TagCommonness
                                commonness={ exampleWord.commonness }
                            />
                            <Tags.TagJlpt
                                jlpt={ exampleWord.jlpt }
                            />
                            <Solid.Show when={ exampleWord.rare }>
                                <Framework.IconArrowDownHollow
                                    title="rare"
                                    color={ Framework.themeVar("iconBlueColor") }
                                />
                            </Solid.Show>
                            <Solid.Show when={ exampleWord.outdated }>
                                <Framework.IconArrowDown
                                    title="outdated"
                                    color={ Framework.themeVar("iconBlueColor") }
                                />
                            </Solid.Show>
                            <Solid.Show when={ exampleWord.irregular }>
                                <Framework.IconIrregular
                                    title="irregular"
                                    color={ Framework.themeVar("iconRedColor") }
                                />
                            </Solid.Show>
                        </ExampleWordTagsWrapper>
                        <ExampleWordReading
                            kanji={ props.kanji }
                            furigana={ furigana }
                        />
                    </ExampleWordHeading>
                </Framework.Link>
                <ExampleWordSense>
                    { exampleWord.sense }
                </ExampleWordSense>
                <br/>
            </ExampleWordEntry>
        }}
        </Solid.For>
    </ExampleWordLayout>
}


const ExampleWordLayout = styled.div`
`


const ExampleWordEntry = styled.div`
    text-indent: -1em;
    padding-left: 1em;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow-x: hidden;
`


const ExampleWordHeading = styled.span`
    font-weight: bold;
`


const ExampleWordTagsWrapper = styled.sup`
    font-size: 0.5em;
`


const ExampleWordSense = styled.span`
    color: ${ Framework.themeVar("text2ndColor") };
`


export function ExampleWordReading(props: {
    kanji: string,
    furigana: Furigana.Furigana,
    children?: Solid.JSX.Element,
})
{
    return <>
        【
        <Solid.For each={ props.furigana }>{ (segment, index) =>
            <>
            { index() > 0 ? "・" : "" }
            <ExampleWordReadingSegment
                faded={ segment[0].indexOf(props.kanji) < 0 }
            >
                { segment[1] || segment[0] }
            </ExampleWordReadingSegment>
            </>
        }
        </Solid.For>
        】
    </>
}


const ExampleWordReadingSegment = styled.span<{
    faded: boolean,
}>`
    ${ props => props.faded ?
        `color: ${ Framework.themeVar("text3rdColor") }` :
        ``
    };
`