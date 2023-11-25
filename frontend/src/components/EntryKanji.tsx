import * as Solid from "solid-js"
import { styled } from "solid-styled-components"
import * as Framework from "../framework/index.ts"
import * as App from "../app.tsx"
import * as Kana from "common/kana.ts"
import * as JmdictTags from "common/jmdict_tags.ts"
import * as Furigana from "common/furigana.ts"
import { KanjiStrokeDiagram } from "./KanjiStrokeDiagram.tsx"
import * as Tags from "./Tags.tsx"


export function EntryKanji(props: {
    entry: App.Api.Kanji.Entry,
    noExampleWords?: boolean,
})
{
    const commonness = JmdictTags.getKanjiCommonness(props.entry)

    const popupDiagram = Framework.makePopupPageWide({
        childrenFn: () =>
            <KanjiDiagramWrapper>
                <KanjiStrokeDiagram kanji={ props.entry.id }/>
            </KanjiDiagramWrapper>,
    })

    return <Entry>
        <Header>
            <KanjiCharacter
                lang="ja"
            >
                { props.entry.id }
                
                <KanjiTagsWrapper>
                    <Tags.TagCommonness commonness={ commonness }/>
                </KanjiTagsWrapper>

            </KanjiCharacter>
            <div>
                <Solid.Show
                    when={ props.entry.meanings.length !== 0 }
                    fallback={ <span style={{ "font-style": "italic" }}>(No information available.)</span> }
                >
                    { props.entry.meanings.join("; ") }
                </Solid.Show>
                <TagsWrapper>
                    <Tags.TagJlpt jlpt={ props.entry.jlpt }/>
                    <Tags.TagJouyou jouyou={ props.entry.jouyou }/>
                    <Tags.TagJinmeiyou jinmeiyou={ props.entry.jinmeiyou }/>
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
                        { " " }
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
                        </> }
                        onClick={ ev => popupDiagram.open(ev.currentTarget) }
                    />
                </span>
            </div>
        </ReadingsLayout>

        <Solid.Show when={ !props.noExampleWords && props.entry.exampleWords }>
            <br/>

            <ExampleWords
                kanji={ props.entry.id }
                exampleWords={ props.entry.exampleWords! }
            />

            <span style={{
                "font-size": "0.8em",
                color: Framework.themeVar("text3rdColor"),
            }}>
                <Framework.Link
                    href={ App.Pages.KanjiWords.urlForQuery(props.entry.id) }
                    label={ <>
                        <Framework.IconVerticalEllipsis/>
                        View all { props.entry.wordCount ?? 0 } words
                    </> }
                />
            </span>
        </Solid.Show>

        { popupDiagram.rendered }
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
    column-gap: 0.5em;
    margin-top: -1em;
    margin-bottom: -0.5em;
`


const KanjiCharacter = styled.div`
    font-size: 6em;
    font-weight: ${ App.cssVarJapaneseFontWeight };
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
    column-gap: 0.5em;
`


const ReadingsLabel = styled.div`
    justify-self: end;
    font-size: 0.8em;
    color: ${ Framework.themeVar("text2ndColor") };
`


const StrokeCount = styled.div`
    display: inline-block;
    font-weight: ${ App.cssVarJapaneseFontWeight };
`


const KanjiDiagramWrapper = styled.article`
    margin-top: 0.5em;
    margin-bottom: 0.5em;
`


export function Reading(props: {
    reading: App.Api.Kanji.Reading
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
    font-weight: ${ App.cssVarJapaneseFontWeight };

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
    exampleWords: App.Api.KanjiWordCrossRef.Word[],
})
{
    return <ExampleWordLayout>
        <Solid.For each={ props.exampleWords }>{ (exampleWord) => {
            const furigana = Furigana.decode(exampleWord.furigana)

            return <ExampleWordEntry>
                <Framework.Link
                    href={ App.Pages.Search.urlForQuery(`${ Furigana.extractBase(furigana) } ${ Furigana.extractReading(furigana) }`) }
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
    font-weight: ${ App.cssVarJapaneseFontWeight };
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