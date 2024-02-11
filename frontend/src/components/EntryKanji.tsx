import * as Solid from "solid-js"
import { styled } from "solid-styled-components"
import * as Framework from "../framework/index.ts"
import * as App from "../app.tsx"
import * as Kana from "common/kana.ts"
import * as JmdictTags from "common/jmdict_tags.ts"
import * as Furigana from "common/furigana.ts"
import { KanjiStrokeDiagram } from "./KanjiStrokeDiagram.tsx"
import * as Tags from "./Tags.tsx"
import { FuriganaSideBySide } from "./Furigana.tsx"


export function EntryKanji(props: {
    entry: App.Api.Kanji.Entry,
    noExampleWords?: boolean,
})
{
    const commonness = JmdictTags.getKanjiCommonness(props.entry)

    const [extraInfoOpen, setExtraInfoOpen] = Framework.createHistorySignal(
        props.entry.id + ":extraInfo",
        false)

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
                <Solid.Show when={ App.usePrefs().debugMode }>
                    <DebugInfo>
                        [score: { props.entry.score ?? 0 }]
                    </DebugInfo>
                </Solid.Show>
            </div>
        </Header>

        <ReadingsLayout>
            <Solid.Show when={ props.entry.kunyomi.length !== 0 }>
                <ReadingsLabel>kun'yomi:</ReadingsLabel>
                <div>
                    <Solid.For each={ props.entry.kunyomi }>{ (kunyomi) =>
                        <Reading
                            entry={ props.entry }
                            reading={ kunyomi }
                        />
                    }
                    </Solid.For>
                </div>
            </Solid.Show>

            <Solid.Show when={ props.entry.onyomi.length !== 0 }>
                <ReadingsLabel>on'yomi:</ReadingsLabel>
                <div>
                    <Solid.For each={ props.entry.onyomi }>{ (onyomi) =>
                        <Reading
                            entry={ props.entry }
                            reading={ onyomi }
                        />
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
                        onClick={ ev => {
                            App.analyticsEvent("resultsKanjiViewDiagram")
                            popupDiagram.open(ev.currentTarget)
                        }}
                    />
                </span>
            </div>
        </ReadingsLayout>
            
        <Solid.Show when={
            !props.noExampleWords &&
            props.entry.exampleWords !== undefined &&
            props.entry.exampleWords.length !== 0 &&
            props.entry.wordCount !== undefined &&
            props.entry.wordCount !== 0
        }>
            <ExampleWords
                kanji={ props.entry.id }
                exampleWords={ props.entry.exampleWords! }
            />
        </Solid.Show>

        <div style={{
            "margin-top": "0.5em",
            "font-size": "0.8em",
            color: Framework.themeVar("text3rdColor"),
        }}>
            <Solid.Show when={
                !props.noExampleWords &&
                props.entry.wordCount !== undefined &&
                props.entry.wordCount !== 0
            }>
                <Framework.Link
                    href={ App.Pages.KanjiWords.urlForQuery(props.entry.id) }
                    label={ <>
                        <Framework.IconVerticalEllipsis/>
                        View all { props.entry.wordCount ?? 0 } words
                    </> }
                />

                <span style={{ "margin-right": "2em" }}>
                    { " " }
                </span>
            </Solid.Show>

            <Framework.Link
                label={ <>
                    { extraInfoOpen() ?
                        <Framework.IconTriangleUp/> :
                        <Framework.IconTriangleDown/>
                    }
                    More info
                </> }
                onClick={ () => setExtraInfoOpen(!extraInfoOpen()) }
            />
        </div>

        <Solid.Show when={ extraInfoOpen() }>
            <ExtraInfo entry={ props.entry }/>
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


const DebugInfo = styled.span`
    color: ${ Framework.themeVar("text3rdColor") };
    font-size: 0.8rem;
    font-weight: normal;
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
    entry: App.Api.Kanji.Entry,
    reading: App.Api.Kanji.Reading
})
{
    const readingWithScore = Solid.createMemo(() => {
        if (!App.usePrefs().debugMode)
            return undefined

        const readingsNormalized = props.entry.readings
            .map(r => ({
                reading: Kana.toHiragana(r.reading),
                score: r.score,
            }))
            
        let myReading = Kana.toHiragana(props.reading.text)
        const periodIndex = myReading.indexOf(".")
        if (periodIndex >= 0)
            myReading = myReading.slice(0, periodIndex)

        return readingsNormalized
            .find(r => r.reading === myReading)
    })

    return <ReadingEntry
        faded={ props.reading.commonness === undefined }
    >
        { props.reading.text }
        <ReadingTagsWrapper>
            <Tags.TagCommonness
                commonness={ props.reading.commonness }
            />
        </ReadingTagsWrapper>
        <Solid.Show when={ App.usePrefs().debugMode }>
            <DebugInfo>
                [score: { readingWithScore()?.score ?? "--" }]
            </DebugInfo>
        </Solid.Show>
    </ReadingEntry>
}


export function ReadingPlain(props: {
    entry: App.Api.Kanji.Entry,
    reading: string
})
{
    return <ReadingEntry faded={ false }>
        { props.reading }
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
                        <FuriganaSideBySide
                            skipBase
                            highlightKanji={ props.kanji }
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
    margin-top: 0.5em;
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


function ExtraInfo(props: {
    entry: App.Api.Kanji.Entry,
})
{
    return <ExtraInfoLayout>

        <Solid.Show when={ props.entry.nanori && props.entry.nanori.length !== 0 }>
            <ExtraInfoRow>
                <ExtraInfoLabel>nanori:</ExtraInfoLabel>
                <ExtraInfoContent>
                    <Solid.For each={ props.entry.nanori }>
                    { (nanori) =>
                        <ReadingPlain
                            entry={ props.entry }
                            reading={ nanori }
                        />
                    }
                    </Solid.For>
                </ExtraInfoContent>
            </ExtraInfoRow>
        </Solid.Show>

        <ExtraInfoStructuralCategory entry={ props.entry }/>

        <Solid.Show when={ props.entry.keiseiPhonetic }>
            <ExtraInfoRow>
                <ExtraInfoLabel>used phonetically in:</ExtraInfoLabel>
                <ExtraInfoContent>
                    <ExtraInfoKanjiList>
                        <Solid.For each={ props.entry.keiseiPhonetic }>
                        { (k) =>
                            <Framework.Link
                                href={ App.Pages.Search.urlForKanjiQuery(k) }
                                label={ k }
                                noUnderline
                            />
                        }
                        </Solid.For>
                    </ExtraInfoKanjiList>
                </ExtraInfoContent>
            </ExtraInfoRow>
        </Solid.Show>

        <Solid.Show when={ props.entry.keiseiSemantic }>
            <ExtraInfoRow>
                <ExtraInfoLabel>used semantically in:</ExtraInfoLabel>
                <ExtraInfoContent>
                    <ExtraInfoKanjiList>
                        <Solid.For each={ props.entry.keiseiSemantic }>
                        { (k) =>
                            <Framework.Link
                                href={ App.Pages.Search.urlForKanjiQuery(k) }
                                label={ k }
                                noUnderline
                            />
                        }
                        </Solid.For>
                    </ExtraInfoKanjiList>
                </ExtraInfoContent>
            </ExtraInfoRow>
        </Solid.Show>

        <ExtraInfoComponents
            kanji={ props.entry.id }
            components={ props.entry.components }
        />

        <ExtraInfoDecomposition descrSeq={ props.entry.descrSeq }/>

        <ExtraInfoCodepoint kanji={ props.entry.id }/>

    </ExtraInfoLayout>
}


const ExtraInfoLayout = styled.div`
    margin-top: 0.5em;
    margin-left: calc(0.5em - 0.5px);
    border-left: 2px solid ${ Framework.themeVar("text3rdColor") };
`


const ExtraInfoRow = styled.div`
    display: grid;
    grid-template: auto / auto auto;
    align-items: baseline;
    justify-items: start;
    justify-content: start;
    margin-bottom: 0.75em;
    margin-left: 0.5em;
`


const ExtraInfoLabel = styled.div`
    display: inline-block;
    margin-right: 0.5em;
    font-size: 0.8em;
    color: ${ Framework.themeVar("text2ndColor") };
`


const ExtraInfoContent = styled.div`
    display: inline-block;
    color: ${ Framework.themeVar("textColor") };
`


const ExtraInfoKanjiList = styled.div`
    display: flex;
    flex-wrap: wrap;
    column-gap: 0.15em;
    justify-items: start;
    justify-content: start;
`


const ExtraInfoLinksLayout = styled.div`
    color: ${ Framework.themeVar("text3rdColor") };
    font-size: 0.8em;
    margin-top: 0.25em;
`


const structCatDisplayNames: Record<App.Api.Kanji.StructuralCategoryType, string> = {
    "shoukei": "pictographic (shōkei moji)",
    "shiji": "simple indicative (shiji moji)",
    "kaii": "compound indicative (kaii moji)",
    "keisei": "phono-semantic (keisei moji)",
    "shinjitai": "new-form character (shinjitai)",
    "kokuji": "national character (kokuji)",
    "derivative": "derivative",
    "rebus": "rebus",
    "unknown": "unknown",
}


function ExtraInfoStructuralCategory(props: {
    entry: App.Api.Kanji.Entry,
})
{
    if (!props.entry.structuralCategory)
        return <></>

    const displayName = structCatDisplayNames[props.entry.structuralCategory.type]
    if (!displayName)
        return <></>

    return <ExtraInfoRow>
        <ExtraInfoLabel>structural category:</ExtraInfoLabel>
        <ExtraInfoContent>
            { displayName }
            { props.entry.structuralCategory.type === "keisei" ?
                <>
                <br/>
                <ExtraInfoLabel>phonetic:</ExtraInfoLabel>
                <ExtraInfoContent lang="ja">
                    <Framework.Link
                        noUnderline
                        label={ props.entry.structuralCategory.phonetic }
                        href={ App.Pages.Search.urlForKanjiQuery(props.entry.structuralCategory.phonetic) }
                    />
                </ExtraInfoContent>
                { " " }
                <ExtraInfoLabel>semantic:</ExtraInfoLabel>
                <ExtraInfoContent lang="ja">
                    <Framework.Link
                        noUnderline
                        label={ props.entry.structuralCategory.semantic }
                        href={ App.Pages.Search.urlForKanjiQuery(props.entry.structuralCategory.semantic) }
                    />
                </ExtraInfoContent>
                </>
            :
                <></>
            }
        </ExtraInfoContent>
    </ExtraInfoRow>
}


function ExtraInfoComponents(props: {
    kanji: string,
    components?: string[],
})
{
    if (!props.components ||
        props.components.length === 0)
        return <></>

    if (props.components.length === 1 &&
        props.components[0] === props.kanji)
        return <></>
    
    return <ExtraInfoRow>
        <ExtraInfoLabel>components:</ExtraInfoLabel>
        <ExtraInfoContent>
            <ExtraInfoKanjiList lang="ja">
                <Solid.For each={ props.components }>
                { (part) =>
                    <Framework.Link
                        label={ part }
                        href={ App.Pages.Search.urlForKanjiQuery(part) }
                        noUnderline
                    />
                }
                </Solid.For>
            </ExtraInfoKanjiList>
            <ExtraInfoLinksLayout>
                <Framework.Link
                    label={ <><Framework.IconMagnifyingGlass/> Perform a component search</> }
                    href={ App.Pages.Search.urlForComponentsQuery(props.components!.join("")) }
                />
            </ExtraInfoLinksLayout>
        </ExtraInfoContent>
    </ExtraInfoRow>
}


function ExtraInfoDecomposition(props: {
    descrSeq?: App.Api.Kanji.DescriptionSequence[],
})
{
    if (!props.descrSeq)
        return <></>
    
    return <ExtraInfoRow>
        <ExtraInfoLabel>decomposition:</ExtraInfoLabel>
        <ExtraInfoContent>
            <DecompositionRow descrSeq={ props.descrSeq }/>
        </ExtraInfoContent>
    </ExtraInfoRow>
}


const ignoreDecomposition = new Set<string>([..."⺀〢丁丂七丄丅丆三不下上万与中乃乂之了亇二五互亞亡亠亥大天夫夬夭夕士壬土千卄卅半升午匕北力刀儿兀元水电立竹艹並丰丯主乆乊么𠂈𠂔𠄐𠄞𠄟𠄠戈弋衣火习𦍌䒑王金𤴓𠫓氺失𡳾屯兼方龷毛𠀎禾勿爫争"])


function DecompositionRow(props: {
    descrSeq: App.Api.Kanji.DescriptionSequence[],
})
{
    return <DecompositionLayout lang="ja">
        <Solid.For each={ props.descrSeq }>
        { (descrSeq, column) =>
            typeof descrSeq === "string" ?
                <div style={{
                    "z-index": 2,
                    "grid-row": 1,
                    "grid-column": column() + 1,
                    "padding": "0 0.15em",
                }}>
                    <Framework.Link
                        label={ descrSeq }
                        href={ !Kana.isKanji(descrSeq) ?
                            undefined :
                            App.Pages.Search.urlForKanjiQuery(descrSeq) }
                        noUnderline
                    />
                </div>
            :
                <>
                <div style={{
                    "z-index": 2,
                    "grid-row": 1,
                    "grid-column": column() + 1,
                    "padding": "0 0.15em",
                }}>
                    <Framework.Link
                        label={ descrSeq[0] }
                        href={ !Kana.isKanji(descrSeq[0]) ?
                            undefined :
                            App.Pages.Search.urlForKanjiQuery(descrSeq[0]) }
                        noUnderline
                    />
                </div>
                <Solid.Show when={ !ignoreDecomposition.has(descrSeq[0]) }>
                    <div style={{
                        "z-index": 2,
                        "grid-row": 2,
                        "grid-column": column() + 1,
                    }}>
                        <DecompositionSubGroupLayout>
                            <Framework.IconArrowDownRight
                                color={ Framework.themeVar("text3rdColor") }
                            />
                            <DecompositionRow
                                descrSeq={ descrSeq[1] }
                            />
                        </DecompositionSubGroupLayout>
                    </div>
                </Solid.Show>
                </>
        }
        </Solid.For>
        {/*<DecompositionGroupShading endColumn={ props.descrSeq.length + 1 }/>*/}
    </DecompositionLayout>
}


const DecompositionLayout = styled.div`
    display: grid;
    grid-auto-columns: auto;
    grid-row-gap: 0.15em;
    justify-items: start;
    justify-content: start;
    margin-right: 0.25em;
`


const DecompositionSubGroupLayout = styled.div`
    display: grid;
    grid-template: auto / auto auto;
    justify-items: start;
    justify-content: start;
    margin-left: 0.25em;
    border-top: 2px solid ${ Framework.themeVar("text3rdColor") };
`


const DecompositionGroupShading = styled.div<{
    endColumn: number,
}>`
    z-index: 1;
    grid-row: 1;
    grid-column: 1 / ${ props => props.endColumn };
    justify-self: stretch;
    justify-content: stretch;
    background-color: ${ Framework.themeVar("textStrongBkgColor") };
    border-radius: ${ Framework.themeVar("borderRadius") };
    width: 100%;
    height: 100%;
`


function ExtraInfoCodepoint(props: {
    kanji: string,
})
{
    const hex = props.kanji.codePointAt(0)?.toString(16)
    const uri = encodeURIComponent(props.kanji)

    return <>
        <ExtraInfoRow>
            <ExtraInfoLabel>Unicode codepoint:</ExtraInfoLabel>
            <ExtraInfoContent>
                U+{ hex }
                <ExtraInfoLinksLayout>
                    <Framework.Link
                        href={ `https://www.unicode.org/cgi-bin/GetUnihanData.pl?codepoint=${ hex }` }
                        label={ <><Framework.IconExternal/> Unihan</> }
                    />
                    { " " }
                    <Framework.Link
                        href={ `https://r12a.github.io/uniview/?char=${ hex }` }
                        label={ <><Framework.IconExternal/> UniView</> }
                    />
                    { " " }
                    <Framework.Link
                        href={ `https://en.wiktionary.org/wiki/${ uri }#Japanese` }
                        label={ <><Framework.IconExternal/> Wiktionary</> }
                    />
                </ExtraInfoLinksLayout>
            </ExtraInfoContent>
        </ExtraInfoRow>
    </>
}