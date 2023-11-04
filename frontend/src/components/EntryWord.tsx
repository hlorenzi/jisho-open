import * as Solid from "solid-js"
import { styled } from "solid-styled-components"
import * as Framework from "../framework/index.ts"
import * as Api from "common/api/index.ts"
import * as Inflection from "common/inflection.ts"
import * as JmdictTags from "common/jmdict_tags.ts"
import { FuriganaRender } from "./FuriganaRender.tsx"
import { InflectionPath } from "./InflectionPath.tsx"
import { TextTag } from "./TextTag.tsx"


export function EntryWord(props: {
    entry: Api.Word.Entry
})
{
    return <Entry>
        <Headings headings={ props.entry.headings }/>
        <InflectionBreakdown breakdown={ props.entry.inflections }/>
        <Definitions defs={ props.entry.defs }/>
    </Entry>
}


const Entry = styled.article`
    margin-block-end: 1em;
`


function Headings(props: {
    headings: Api.Word.Heading[],
})
{
    const headings = props.headings
        .filter(h => !h.searchOnlyKanji && !h.searchOnlyKana)

    return <header>
        <Solid.For each={ headings }>{ (heading, index) =>
            <Heading heading={ heading } first={ index() === 0 }/>
        }
        </Solid.For>
    </header> 
}


function Heading(props: {
    first: boolean,
    heading: Api.Word.Heading,
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

    return <HeadingBlock>

        <HeadingText
            first={ props.first }
            faded={ !!faded }
        >
            <FuriganaRender encoded={ props.heading.furigana }/>
        </HeadingText>

        <HeadingTagsWrapper first={ props.first }>
            <HeadingTags>

                <Solid.Show when={ commonness === "veryCommon" }>
                    <Framework.IconArrowUp
                        title="very common"
                        color="var(--theme-iconGreenColor)"
                    />                    
                </Solid.Show>
                
                <Solid.Show when={ commonness === "common" }>
                    <Framework.IconArrowUpHollow
                        title="common"
                        color="var(--theme-iconGreenColor)"
                    />                    
                </Solid.Show>
                
                <Solid.Show when={ props.heading.ateji }>
                    <TextTag
                        title="ateji reading"
                        label="A"
                        bkgColor="var(--theme-iconAtejiColor)"
                    />                    
                </Solid.Show>
                
                <Solid.Show when={ props.heading.gikunOrJukujikun }>
                    <TextTag
                        title="gikun reading"
                        label="G"
                        bkgColor="var(--theme-iconGikunColor)"
                    />                    
                </Solid.Show>
                
                <Solid.Show when={ props.heading.jlpt === 5 }>
                    <TextTag
                        title="JLPT N5"
                        label="N5"
                        bkgColor="var(--theme-iconJlptN5Color)"
                    />                    
                </Solid.Show>
                
                <Solid.Show when={ props.heading.jlpt === 4 }>
                    <TextTag
                        title="JLPT N4"
                        label="N4"
                        bkgColor="var(--theme-iconJlptN4Color)"
                    />                    
                </Solid.Show>
                
                <Solid.Show when={ props.heading.jlpt === 3 }>
                    <TextTag
                        title="JLPT N3"
                        label="N3"
                        bkgColor="var(--theme-iconJlptN3Color)"
                    />                    
                </Solid.Show>
                
                <Solid.Show when={ props.heading.jlpt === 2 }>
                    <TextTag
                        title="JLPT N2"
                        label="N2"
                        bkgColor="var(--theme-iconJlptN2Color)"
                    />                    
                </Solid.Show>
                
                <Solid.Show when={ props.heading.jlpt === 1 }>
                    <TextTag
                        title="JLPT N1"
                        label="N1"
                        bkgColor="var(--theme-iconJlptN1Color)"
                    />                    
                </Solid.Show>
                
                <Solid.Show when={ props.heading.rareKanji }>
                    <Framework.IconArrowDownHollow
                        title="rare kanji"
                        color="var(--theme-iconBlueColor)"
                    />                    
                </Solid.Show>
                
                <Solid.Show when={ props.heading.outdatedKanji }>
                    <Framework.IconArrowDown
                        title="outdated kanji"
                        color="var(--theme-iconBlueColor)"
                    />                    
                </Solid.Show>
                
                <Solid.Show when={ props.heading.outdatedKana }>
                    <Framework.IconArrowDown
                        title="outdated kana"
                        color="var(--theme-iconBlueColor)"
                    />                    
                </Solid.Show>
                
                <Solid.Show when={ props.heading.irregularKanji }>
                    <Framework.IconIrregular
                        title="irregular kanji"
                        color="var(--theme-iconRedColor)"
                    />                    
                </Solid.Show>
                
                <Solid.Show when={ props.heading.irregularKana }>
                    <Framework.IconIrregular
                        title="irregular kana"
                        color="var(--theme-iconRedColor)"
                    />                    
                </Solid.Show>

                <Solid.Show when={ props.heading.irregularOkurigana }>
                    <Framework.IconIrregular
                        title="irregular okurigana"
                        color="#f00"
                    />                    
                </Solid.Show>

                <Solid.Show when={ props.heading.searchOnlyKanji }>
                    <TextTag
                        title="search-only kanji"
                        label="Ø"
                    />                    
                </Solid.Show>
                
                <Solid.Show when={ props.heading.searchOnlyKana }>
                    <TextTag
                        title="search-only kana"
                        label="Ø"
                    />                    
                </Solid.Show>

            </HeadingTags>
        </HeadingTagsWrapper>
    </HeadingBlock>
}


const HeadingBlock = styled.h1`
    margin: 0;
    margin-inline-end: 1.5em;
    display: inline-block;
    font-size: 1em;
`


const HeadingText = styled.span<{
    first: boolean,
    faded: boolean,
}>`
    font-weight: bold;
    font-size: ${ props => props.first ? `1.6em` : `1.2em` };

    ${ props => props.faded ? `
        color: var(--theme-text3rdColor);
        &:hover { color: var(--theme-textColor); }
    ` : `` }
`


const HeadingTagsWrapper = styled.sup<{
    first: boolean,
}>`
    font-size: ${ props => props.first ? `1.6em` : `1.2em` };
`


const HeadingTags = styled.sup`
    font-size: 0.5em;
`


function InflectionBreakdown(props: {
    breakdown?: Inflection.Breakdown,
})
{
    return <Solid.Show when={ props.breakdown }>
        <section>
            <Solid.For each={ props.breakdown }>{ (path) =>
                <p> ・ <InflectionPath path={ path }/></p>
            }
            </Solid.For>
        </section>
    </Solid.Show>
}


function Definitions(props: {
    defs: Api.Word.Definition[],
})
{
    let currentPos: string[] = []

    const defs: Solid.JSX.Element[] = []

    for (const def of props.defs)
    {
        // Check whether the part-of-speech tags have changed between definitions
        if (!def.pos.every(pos => currentPos.some(curr => curr === pos)) ||
            !currentPos.every(pos => def.pos.some(curr => curr === pos)))
        {
            const partsOfSpeech = def.pos
                .map(pos => JmdictTags.getPosName(pos))
                .join(", ")

            defs.push(<PartOfSpeech>{ partsOfSpeech }</PartOfSpeech>)
            currentPos = def.pos
        }

        defs.push(<li>{ def.gloss.join("; ") }</li>)
    }

    return <section>
        <DefinitionList>{ defs }</DefinitionList>
    </section>
}


const PartOfSpeech = styled.p`
    color: var(--theme-iconGreenColor);
    font-size: 0.8em;
`


const DefinitionList = styled.ol`
    counter-reset: item;
    padding-inline-start: 1.75em;

    & li::marker {
        color: var(--theme-textFaintColor);
        content: counter(item) " • ";
        font-size: 0.8em;
        padding-inline-end: 0.25em;
    }

    & li {
        counter-increment: item;
    }
`