import * as Solid from "solid-js"
import { styled } from "solid-styled-components"
import * as Framework from "../framework/index.ts"
import * as Pages from "../pages.ts"
import * as Api from "common/api/index.ts"
import * as Kana from "common/kana.ts"
import * as JmdictTags from "common/jmdict_tags.ts"


export function EntryKanji(props: {
    entry: Api.Kanji.Entry
})
{
    return <Entry>
        <Header>
            <KanjiCharacter>
                { props.entry.id }
            </KanjiCharacter>
            <div>
                { props.entry.meanings.join("; ") }
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
            <StrokeCount>
                { props.entry.strokeCount }
                <Solid.Show when={ props.entry.strokeCounts }>
                    (or { props.entry.strokeCounts!.join(", ") })
                </Solid.Show>
            </StrokeCount>
        </ReadingsLayout>
    </Entry>
}


const Entry = styled.article`
    margin-block-end: 1em;
`


const Header = styled.div`
    display: grid;
    grid-template: auto / auto 1fr;
    align-items: center;
    justify-items: start;
    justify-content: start;
    column-gap: 1em;
`


const KanjiCharacter = styled.div`
    font-size: 6em;
    font-weight: bold;
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


export function Reading(props: {
    reading: Api.Kanji.Reading
})
{
    return <ReadingEntry>
        { props.reading.text }
    </ReadingEntry>
}


const ReadingEntry = styled.div`
    display: inline-block;
    margin-inline-end: 1em;
    font-weight: bold;
`


const StrokeCount = styled.div`
    display: inline-block;
    font-weight: bold;
`