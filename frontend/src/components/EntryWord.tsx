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


export function EntryWord(props: {
    entry: Api.Word.Entry,
    query: Api.Search.Query,
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
        <InflectionBreakdown breakdown={ props.entry.inflections }/>
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
    entry: Api.Word.Entry,
    wordId: string,
    headings: Api.Word.Heading[],
    query: Api.Search.Query,
})
{
    const headings = props.headings
        .filter(h => !h.searchOnlyKanji && !h.searchOnlyKana)

    const allKanjiWithDuplicates = headings
        .flatMap(h => [...h.base].filter(c => Kana.isKanji(c)))
    
    const allKanji =
        [...new Set<string>(allKanjiWithDuplicates)].join("")

    const popupEllipsis = Framework.makePopupPageWide({
        childrenFn: () =>
            <HeadingEllipsisPopup
                entry={ props.entry }
                wordId={ props.wordId }
                allKanji={ allKanji }
            />,
    })

    const popupBookmark = Framework.makePopupPageWide({
        childrenFn: () =>
            <div>In construction...</div>,
    })

    return <header>
        <Solid.For each={ headings }>{ (heading, index) =>
            <Heading
                heading={ heading }
                first={ index() === 0 }
                last={ index() === headings.length - 1 }
                query={ props.query }
            />
        }
        </Solid.For>

        <Framework.Button
            label={ <Framework.IconEllipsis/> }
            onClick={ ev => popupEllipsis.onOpen(ev.currentTarget) }
            style={{ position: "relative", top: "-0.4em" }}
        />

        <Framework.Button
            label={ <Framework.IconBookmark color={ Framework.themeVar("iconGreenColor") }/> }
            onClick={ ev => popupBookmark.onOpen(ev.currentTarget) }
            style={{ position: "relative", top: "-0.4em" }}
        />

        { popupEllipsis.rendered }

        { popupBookmark.rendered }
    </header> 
}


function HeadingEllipsisPopup(props: {
    entry: Api.Word.Entry,
    wordId: string,
    allKanji: string,
})
{
    return <>
        <Solid.Show when={ props.allKanji.length !== 0 }>
            <Framework.ButtonPopupPageWide
                label={ <>
                    <Framework.IconMagnifyingGlass/>
                    { ` Inspect all kanji: ${ props.allKanji }` }
                </> }
                href={ Pages.Search.urlForQuery(`${ props.allKanji } #k`) }
            />
        </Solid.Show>
        <Framework.HorizontalBar/>
        <Framework.ButtonPopupPageWide
            label="View in JMdict"
            href={ Pages.Jmdict.urlForWordId(props.wordId) }
        />
        <Framework.ButtonPopupPageWide
            label="Log entry to console"
            onClick={ () => console.log(props.entry) }
        />
    </>
}


function Heading(props: {
    first: boolean,
    last: boolean,
    heading: Api.Word.Heading,
    query: Api.Search.Query,
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

    const commonness =
        JmdictTags.getCommonness(props.heading)

    const kanjiWithDuplicates = [...props.heading.base]
        .filter(c => Kana.isKanji(c))
    
    const kanji =
        [...new Set<string>(kanjiWithDuplicates)].join("")

    const baseNormalized = Kana.normalizeWidthForms(props.heading.base)
    const readingNormalized = Kana.normalizeWidthForms(props.heading.reading ?? "")

    let isQueryMatch = false
    if (props.query.strJapaneseSplit.some(s =>
            s === baseNormalized ||
            s === readingNormalized ||
            s === Kana.toHiragana(baseNormalized) ||
            s === Kana.toHiragana(readingNormalized)))
        isQueryMatch = true

    const popup = Framework.makePopupPageWide({
        childrenFn: () =>
            <HeadingPopup
                popup={ popup }
                base={ props.heading.base }
                reading={ props.heading.reading }
                kanji={ kanji }
            />,
    })
    
    return <>
        <HeadingBlock
            first={ props.first }
            last={ props.last }
            faded={ !!faded }
            queryMatch={ isQueryMatch }
            onClick={ ev => popup.onOpen(ev.currentTarget) }
        >

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
                    
                    <Solid.Show when={ props.heading.gikunOrJukujikun }>
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
        </HeadingBlock>

        { popup.rendered }
    </>
}


const HeadingBlock = styled.button<{
    faded: boolean,
    first: boolean,
    last: boolean,
    queryMatch: boolean,
}>`
    margin: 0;
    margin-inline-start: -0.2em;
    margin-inline-end: ${ props => props.last ? `0.25em` : `1em` };
    padding: 0.1em 0.2em 0 0.2em;
    border: 0;
    display: inline-block;
    font-family: inherit;
    font-size: ${ props => props.first ? `1.6em` : `1.2em` };
    border-radius: 0.25rem;
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


const HeadingText = styled.span`
    font-weight: bold;
`


const HeadingTagsWrapper = styled.sup`
`


const HeadingTags = styled.sup`
    font-size: 0.5em;
`


function HeadingPopup(props: {
    popup: Framework.PopupData,
    kanji: string,
    base: string,
    reading?: string,
})
{
    return <>
        <Solid.Show when={ props.kanji.length !== 0 }>
            <Framework.ButtonPopupPageWide
                label={ <>
                    <Framework.IconMagnifyingGlass/>
                    { ` Inspect kanji: ${ props.kanji }` }
                </> }
                href={ Pages.Search.urlForQuery(`${ props.kanji } #k`) }
            />
        </Solid.Show>

        <Framework.ButtonPopupPageWide
            label={ `Copy ${ props.base } to the clipboard` }
            onClick={ () => {
                Framework.copyToClipboard(props.base)
                props.popup.onClose()
            }}
        />

        <Solid.Show when={ props.reading }>
            <Framework.ButtonPopupPageWide
                label={ `Copy ${ props.reading } to the clipboard` }
                onClick={ () => {
                    Framework.copyToClipboard(props.reading!)
                    props.popup.onClose()
                }}
            />
        </Solid.Show>

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
    senses: Api.Word.Sense[],
})
{
    let currentPos: string[] = []

    const list: Solid.JSX.Element[] = []

    for (const sense of props.senses)
    {
        // Check whether the part-of-speech tags have changed between senses
        if (!sense.pos.every(pos => currentPos.some(curr => curr === pos)) ||
            !currentPos.every(pos => sense.pos.some(curr => curr === pos)))
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
                    href={ Pages.Search.urlForQuery(query) }
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
    pitches?: Api.Word.PitchAccent[],
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