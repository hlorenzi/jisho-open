import * as Solid from "solid-js"
import { styled } from "solid-styled-components"
import * as Framework from "../framework/index.ts"
import * as App from "../app.tsx"
import * as Kana from "common/kana.ts"
import * as JmdictTags from "common/jmdict_tags.ts"
import { FuriganaRuby } from "./Furigana.tsx"
import { InflectionBreakdown } from "./InflectionBreakdown.tsx"
import { InflectionTable, hasTable } from "./InflectionTable.tsx"
import { PitchAccentRender } from "./PitchAccentRender.tsx"
import { StudyListPopup } from "./StudyListPopup.tsx"
import * as Tags from "./Tags.tsx"


export function EntryWord(props: {
    entry: App.Api.Word.Entry,
    query: App.Api.Search.Query,
})
{
    const ignoreUsageInPlainKanaMiscTag =
        !Kana.hasKanji(props.entry.headings[0].base)

    return <Entry>
        <Headings
            entry={ props.entry }
            wordId={ props.entry.id }
            headings={ props.entry.headings }
            query={ props.query }
        />
        <InflectionBreakdown
            breakdown={ props.entry.inflections }
        />
        <Senses
            ignoreUkMiscTag={ ignoreUsageInPlainKanaMiscTag }
            senses={ props.entry.senses }
        />
        <PitchAccentEntries
            pitches={ props.entry.pitch }
        />
    </Entry>
}


const Entry = styled.article`
    margin-block-end: 0.75em;
`


function Headings(props: {
    entry: App.Api.Word.Entry,
    wordId: string,
    headings: App.Api.Word.Heading[],
    query: App.Api.Search.Query,
})
{
    const data = Solid.createMemo(() => {
        const prefs = App.usePrefs()

        const headings = prefs.resultsShowSearchOnlyHeadings ?
            props.headings :
            props.headings
                .filter(h => !h.searchOnlyKanji && !h.searchOnlyKana)

        const allKanjiWithDuplicates = headings
            .flatMap(h => [...h.base].filter(c => Kana.isKanji(c)))
        
        const allKanji =
            [...new Set<string>(allKanjiWithDuplicates)].join("")

        return {
            headings,
            allKanji,
        }
    })

    const popupEllipsis = Framework.makePopupPageWide({
        childrenFn: () =>
            <HeadingEllipsisPopup
                entry={ props.entry }
                wordId={ props.wordId }
                allKanji={ data().allKanji }
                popup={ popupEllipsis }
            />,
    })

    const popupBookmark = Framework.makePopupPageWide({
        childrenFn: () =>
            <StudyListPopup
                wordId={ props.wordId }
                popup={ popupBookmark }
            />,
    })

    return <header>
        <Solid.For each={ data().headings }>{ (heading, index) =>
            <Heading
                entry={ props.entry }
                heading={ heading }
                first={ index() === 0 }
                last={ index() === data().headings.length - 1 }
                query={ props.query }
            />
        }
        </Solid.For>

        <Framework.Button
            label={ <Framework.IconEllipsis/> }
            onClick={ ev => popupEllipsis.open(ev.currentTarget) }
            iconPadding
            style={{ position: "relative", top: "-0.2em" }}
        />

        <Framework.Button
            label={ <Framework.IconBookmark color={ Framework.themeVar("iconGreenColor") }/> }
            onClick={ ev => popupBookmark.open(ev.currentTarget) }
            iconPadding
            style={{ position: "relative", top: "-0.2em" }}
        />

        { popupEllipsis.rendered }

        { popupBookmark.rendered }
    </header> 
}


function HeadingEllipsisPopup(props: {
    entry: App.Api.Word.Entry,
    wordId: string,
    allKanji: string,
    popup: Framework.PopupPageWideData,
})
{
    return <>
        <Solid.Show when={ props.allKanji.length !== 0 }>
            <Framework.ButtonPopupPageWide
                label={ <>
                    <Framework.IconMagnifyingGlass/>
                    { ` Inspect all kanji: ${ props.allKanji }` }
                </> }
                href={ App.Pages.Search.urlForQuery(`${ props.allKanji } #k`) }
            />
        </Solid.Show>
        <Framework.HorizontalBar/>
        <Framework.ButtonPopupPageWide
            label={ <>View JMdict entry <Framework.IconExternal/></> }
            href={ App.Pages.Jmdict.urlForWordId(props.wordId) }
        />
        <Framework.ButtonPopupPageWide
            label="Log entry to console"
            onClick={ () => {
                console.log(props.entry)
                props.popup.close()
            }}
        />
    </>
}


function Heading(props: {
    first: boolean,
    last: boolean,
    entry: App.Api.Word.Entry,
    heading: App.Api.Word.Heading,
    query: App.Api.Search.Query,
})
{
    const faded =
        props.heading.rareKanji ||
        props.heading.irregularKanji ||
        props.heading.irregularKana ||
        props.heading.irregularOkurigana ||
        props.heading.outdatedKanji ||
        props.heading.outdatedKana ||
        props.heading.searchOnlyKanji ||
        props.heading.searchOnlyKana

    const kanjiWithDuplicates = [...props.heading.base]
        .filter(c => Kana.isKanji(c))
    
    const kanji =
        [...new Set<string>(kanjiWithDuplicates)].join("")

    const baseNormalized = Kana.normalizeWidthForms(props.heading.base)
    const readingNormalized = Kana.normalizeWidthForms(props.heading.reading ?? "")

    const partOfSpeechTags = props.entry.senses.flatMap(s => s.pos)

    let isQueryMatch = false
    if (props.query.strJapaneseSplit.some(s =>
            s === baseNormalized ||
            s === readingNormalized ||
            s === Kana.toHiragana(baseNormalized) ||
            s === Kana.toHiragana(readingNormalized)))
        isQueryMatch = true

    const popupInflectionTable = Framework.makePopupFull({
        childrenFn: () =>
            <InflectionTable
                term={ props.heading.base }
                partOfSpeechTags={ partOfSpeechTags }
            />,
    })
    
    const popup = Framework.makePopupPageWide({
        childrenFn: () =>
            <HeadingPopup
                popup={ popup }
                base={ props.heading.base }
                reading={ props.heading.reading }
                partOfSpeechTags={ partOfSpeechTags }
                kanji={ kanji }
                openInflectionTable={ popupInflectionTable.open }
            />,
    })
    
    return <>
        <HeadingBlock
            first={ props.first }
            last={ props.last }
            faded={ !!faded }
            queryMatch={ isQueryMatch }
            onClick={ ev => popup.open(ev.currentTarget) }
        >
            <HeadingLabel heading={ props.heading }/>            
        </HeadingBlock>

        { popup.rendered }

        { popupInflectionTable.rendered }
    </>
}


const HeadingBlock = styled.button<{
    faded: boolean,
    first: boolean,
    last: boolean,
    queryMatch: boolean,
}>`
    margin: 0;
    margin-inline-end: ${ props => props.last ? `0.25em` : `1em` };
    padding: 0.1em 0.2em 0 0.2em;
    border: 0;
    display: inline-block;
    font-family: inherit;
    font-size: ${ props => props.first ? `1.6em` : `1.2em` };
    border-radius: ${ Framework.themeVar("borderRadius") };
    transition: color 0.05s, background-color 0.05s;
    cursor: pointer;

    background-color: ${ props => props.queryMatch ?
        Framework.themeVar("textHighlightBkgColor") :
        "transparent"
    };

    color: ${ props => props.faded ?
        Framework.themeVar("text3rdColor") :
        Framework.themeVar("textColor")
    };

    &:hover
    {
        color: ${ Framework.themeVar("textColor") };
        background-color: ${ Framework.themeVar("buttonHoverBkgColor") };
    }

    &:active
    {
        background-color: ${ Framework.themeVar("buttonPressBkgColor") };
    }
`


export function HeadingLabel(props: {
    heading: App.Api.Word.Heading,
})
{
    const commonness =
        JmdictTags.getCommonness(props.heading)

    return <>
        <HeadingText>
            <FuriganaRuby encoded={ props.heading.furigana }/>
        </HeadingText>

        <HeadingTagsWrapper>
            <HeadingTags>
                <Tags.TagCommonness commonness={ commonness }/>
                <Tags.TagJlpt jlpt={ props.heading.jlpt }/>
                
                <Solid.Show when={ props.heading.ateji }>
                    <Framework.TextTag
                        title="ateji reading"
                        label="A"
                        bkgColor={ Framework.themeVar("iconAtejiColor") }
                    />
                </Solid.Show>
                
                <Solid.Show when={ props.heading.gikun }>
                    <Framework.TextTag
                        title="gikun reading"
                        label="G"
                        bkgColor={ Framework.themeVar("iconGikunColor") }
                    />
                </Solid.Show>
                
                <Solid.Show when={ props.heading.rareKanji }>
                    <Framework.IconArrowDownHollow
                        title="rare kanji"
                        color={ Framework.themeVar("iconBlueColor") }
                    />
                </Solid.Show>
                
                <Solid.Show when={ props.heading.outdatedKanji }>
                    <Framework.IconArrowDown
                        title="outdated kanji"
                        color={ Framework.themeVar("iconBlueColor") }
                    />
                </Solid.Show>
                
                <Solid.Show when={ props.heading.outdatedKana }>
                    <Framework.IconArrowDown
                        title="outdated kana"
                        color={ Framework.themeVar("iconBlueColor") }
                    />
                </Solid.Show>
                
                <Solid.Show when={ props.heading.irregularKanji }>
                    <Framework.IconIrregular
                        title="irregular kanji"
                        color={ Framework.themeVar("iconRedColor") }
                    />
                </Solid.Show>
                
                <Solid.Show when={ props.heading.irregularKana }>
                    <Framework.IconIrregular
                        title="irregular kana"
                        color={ Framework.themeVar("iconRedColor") }
                    />
                </Solid.Show>

                <Solid.Show when={ props.heading.irregularOkurigana }>
                    <Framework.IconIrregular
                        title="irregular okurigana"
                        color={ Framework.themeVar("iconRedColor") }
                    />
                </Solid.Show>

                <Solid.Show when={ props.heading.searchOnlyKanji }>
                    <Framework.TextTag
                        title="search-only kanji"
                        label="Ø"
                        bkgColor={ Framework.themeVar("iconRedColor") }
                    />
                </Solid.Show>
                
                <Solid.Show when={ props.heading.searchOnlyKana }>
                    <Framework.TextTag
                        title="search-only kana"
                        label="Ø"
                        bkgColor={ Framework.themeVar("iconRedColor") }
                    />
                </Solid.Show>

            </HeadingTags>
        </HeadingTagsWrapper>
    </>
}


const HeadingText = styled.span`
    font-weight: ${ App.cssVarJapaneseFontWeight };
`


const HeadingTagsWrapper = styled.sup`
`


const HeadingTags = styled.span`
    font-size: 0.5em;
`


function HeadingPopup(props: {
    popup: Framework.PopupPageWideData,
    partOfSpeechTags: App.Api.Word.PartOfSpeechTag[],
    kanji: string,
    base: string,
    reading?: string,
    openInflectionTable: () => void,
})
{
    return <>
        <Solid.Show when={ props.kanji.length !== 0 }>
            <Framework.ButtonPopupPageWide
                label={ <>
                    <Framework.IconMagnifyingGlass/>
                    { ` Inspect kanji: ${ props.kanji }` }
                </> }
                href={ App.Pages.Search.urlForQuery(`${ props.kanji } #k`) }
            />
        </Solid.Show>

        <Solid.Show when={ hasTable(props.partOfSpeechTags) }>
            <Framework.ButtonPopupPageWide
                label="View conjugation/inflections"
                onClick={ () => {
                    props.popup.close()
                    props.openInflectionTable()
                }}
            />
        </Solid.Show>

        <Framework.HorizontalBar/>

        <Framework.ButtonPopupPageWide
            label={ `Copy ${ props.base } to the clipboard` }
            onClick={ () => {
                Framework.copyToClipboard(props.base)
                props.popup.close()
            }}
        />

        <Solid.Show when={ props.reading && props.reading !== props.base }>
            <Framework.ButtonPopupPageWide
                label={ `Copy ${ props.reading } to the clipboard` }
                onClick={ () => {
                    Framework.copyToClipboard(props.reading!)
                    props.popup.close()
                }}
            />
        </Solid.Show>

        <Framework.HorizontalBar/>

        <Framework.ButtonPopupPageWide
            label={ <>
                <Framework.IconBookmark color={ Framework.themeVar("iconGreenColor") }/>
                { ` Add this specific spelling to a study list...` }
            </> }
            onClick={ () => {} }
        />
    </>
}


function Senses(props: {
    ignoreUkMiscTag: boolean,
    senses: App.Api.Word.Sense[],
})
{
    let currentPos: string[] = []

    const list: Solid.JSX.Element[] = []

    for (const sense of props.senses)
    {
        // Check whether the part-of-speech tags have changed between senses
        if (!sense.pos.every(pos => currentPos.some(pos2 => pos2 === pos)) ||
            !currentPos.every(pos => sense.pos.some(pos2 => pos2 === pos)))
        {
            const partsOfSpeech = sense.pos
                .map(pos => JmdictTags.nameForPartOfSpeechTag(pos))
                .join(", ")

            list.push(<PartOfSpeech>{ partsOfSpeech }</PartOfSpeech>)
            currentPos = sense.pos
        }

        // Build gloss text
        const gloss: Solid.JSX.Element[] = []
        for (let i = 0; i < sense.gloss.length; i++)
        {
            const apiGloss = sense.gloss[i]

            if (i > 0)
                gloss.push("; ")
            
            if (typeof apiGloss === "string")
                gloss.push(apiGloss)
            else
            {
                gloss.push(<SenseGlossExpl>{ apiGloss.text }</SenseGlossExpl>)

                switch (apiGloss.type)
                {
                    case "lit":
                        gloss.push(<sup title="literal meaning">[lit.]</sup>)
                        break
                    case "fig":
                        gloss.push(<sup title="figuratively">[fig.]</sup>)
                        break
                    case "tm":
                        gloss.push(<span title="trademark">™</span>)
                        break
                    case "expl":
                        break
                    default:
                        gloss.push(<sup>[{ apiGloss.type }]</sup>)
                        break
                }
            }
        }

        const line: Solid.JSX.Element[] = []
        line.push(<span>{ gloss }</span>)

        // Build field/domain tag text
        if (sense.field)
        {
            const text = sense.field
                .map(tag => JmdictTags.nameForFieldDomainTag(tag))
                .join(", ")

            line.push(<SenseInfo> —&nbsp;{ text }</SenseInfo>)
        }

        // Build misc tag text
        const miscTags = sense.misc?.filter(
            tag => !props.ignoreUkMiscTag || tag !== "uk")

        if (miscTags && miscTags.length !== 0)
        {
            const text = miscTags
                .map(tag => JmdictTags.nameForMiscTag(tag))
                .join(", ")

            line.push(<SenseInfo> —&nbsp;{ text }</SenseInfo>)
        }

        // Build dialect text
        if (sense.dialect)
        {
            const text = sense.dialect
                .map(tag => JmdictTags.nameForDialectTag(tag))
                .join(", ")

            line.push(<SenseInfo> —&nbsp;{ text }</SenseInfo>)
        }

        // Build information text
        if (sense.info)
        {
            const text = sense.info.join(" — ")
            line.push(<SenseInfo> —&nbsp;{ text }</SenseInfo>)
        }

        // Build restriction text
        if (sense.restrict)
        {
            const text = sense.restrict.join(", ")
            line.push(<SenseInfo> —&nbsp;only applies to { text }</SenseInfo>)
        }

        // Build source-language text
        if (sense.lang)
        {
            const langs: string[] = []

            const isWasei = sense.lang.some(l => l.wasei)
            const isPartial = sense.lang.some(l => l.partial)

            if (isWasei)
                langs.push(`wasei`)

            for (let i = 0; i < sense.lang.length; i++)
            {
                const lang = sense.lang[i]
                const isFirst = i === 0

                if (lang.language)
                    langs.push(
                        `${ isPartial && isFirst ? `partially ` : `` }` +
                        `${ isFirst ? `from ` : `` }` +
                        `${ JmdictTags.nameForLanguageTag(lang.language) }` +
                        `${ lang.source ? ` "${ lang.source }"` : `` }`)
                else if (lang.source)
                    langs.push(
                        `${ isPartial && isFirst ? `partially ` : `` }` +
                        `${ isFirst ? `from ` : `` }` +
                        `"${ lang.source }"`)
            }

            line.push(<SenseInfo> —&nbsp;{ langs.join(", ") }</SenseInfo>)
        }

        // Build cross-reference text and links
        for (const xref of sense.xref ?? [])
        {
            const text =
                xref.type === "antonym" ? "antonym: " :
                "see "

            const query = 
                xref.base +
                (xref.reading ? ` ${ xref.reading }` : ``)

            const link =
                <Framework.Link
                    href={ App.Pages.Search.urlForQuery(query) }
                >
                    { xref.base }
                    { xref.reading ?
                        `【${ xref.reading }】` : `` }
                    { xref.senseIndex ?
                        ` (sense ${ xref.senseIndex })` : `` }
                </Framework.Link>
            
            line.push(<SenseInfo> 🡆&nbsp;{ text }{ link }</SenseInfo>)
        }

        list.push(<li>{ line }</li>)
    }

    return <section>
        <SenseList>{ list }</SenseList>
    </section>
}


const PartOfSpeech = styled.p`
    color: ${ Framework.themeVar("iconGreenColor") };
    font-size: 0.8em;
`


const SenseList = styled.ol`
    margin-block-start: 0;
    margin-block-end: 0;
    padding-inline-start: 1.75em;

    counter-reset: item;

    & li::marker {
        color: ${ Framework.themeVar("text4thColor") };
        content: counter(item) " • ";
        font-size: 0.8em;
        padding-inline-end: 0.25em;
    }

    & li {
        counter-increment: item;
    }
`


const SenseGlossExpl = styled.span`
    font-style: italic;
`


const SenseInfo = styled.span`
    color: ${ Framework.themeVar("text2ndColor") };
    font-size: 0.8em;
`


function PitchAccentEntries(props: {
    pitches?: App.Api.Word.PitchAccent[],
})
{
    return <Solid.Show when={ props.pitches }>
        <PitchAccentSection>
            <Solid.For each={ props.pitches }>{ (pitch) =>
                <PitchAccentRender pitch={ pitch.text }/>
            }
            </Solid.For>
        </PitchAccentSection>
    </Solid.Show>
}


const PitchAccentSection = styled.section`
    margin-top: 0.4em;
    padding-left: 1.75em;
`