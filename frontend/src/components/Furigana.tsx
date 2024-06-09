import * as Solid from "solid-js"
import { styled } from "solid-styled-components"
import * as Framework from "../framework/index.ts"
import * as Furigana from "common/furigana.ts"
import * as Kana from "common/kana.ts"


export function FuriganaRuby(props: {
    encoded?: string,
    furigana?: Furigana.Furigana,
})
{
    const furigana = props.furigana ?? Furigana.decode(props.encoded ?? "")

    // Doesn't help with the bounding box.
    //if (Furigana.extractBase(furigana) === Furigana.extractReading(furigana))
    //    return <span>{ Furigana.extractBase(furigana) }</span>

    return <ruby lang="ja">
        <Solid.For each={ furigana }>
        { (segment) => {
            const dotted =
                segment[1] !== "" &&
                segment[1] !== segment[0] &&
                [...segment[0]].length > 1
            
            return <>
                <Solid.Show
                    when={ !!segment[0] }
                    fallback={ <EmptyBase>{ "\u30fb" }</EmptyBase> }
                >
                    { segment[0] }
                </Solid.Show>
                <Rt dotted={ dotted }>
                    <Solid.Show
                        when={ !Kana.hasKanjiOrIterationMark(segment[0]) || segment[1] }
                        fallback={ <EmptyReading>×</EmptyReading> }
                    >
                        { segment[1] }
                    </Solid.Show>
                </Rt>
            </>
        }}
        </Solid.For>
    </ruby>
}


const EmptyBase = styled.span`
    opacity: 0;
    margin-left: -0.15em;
    margin-right: -0.15em;
`


const EmptyReading = styled.span`
    color: ${ Framework.themeVar("iconRedColor") };
`


const Rt = styled.rt<{
    dotted: boolean,
}>`
    font-size: 0.5em;
    user-select: none;

    ${ props => props.dotted ? `
        border-top: 2px dotted var(--theme-text3rdColor);
        border-top-left-radius: 0.75em;
        border-top-right-radius: 0.75em;
        ruby-align: center;
    ` : `` }
`


export function FuriganaSideBySide(props: {
    encoded?: string,
    furigana?: Furigana.Furigana,
    children?: Solid.JSX.Element,
    highlightKanji?: string,
    skipBase?: boolean,
})
{
    const furigana = props.furigana ?? Furigana.decode(props.encoded ?? "")
    const base = Furigana.extractBase(furigana)
    const reading = Furigana.extractReading(furigana)

    return <>
        <Solid.Show when={ !props.skipBase }>
            { base }
        </Solid.Show>
        { props.children }
        <Solid.Show when={ reading !== "" && reading !== base }>
            【
            <Solid.For each={ furigana }>
            { (segment, index) =>
                <>
                { index() > 0 ? "・" : "" }
                <Solid.Show
                    when={ !Kana.hasKanjiOrIterationMark(segment[0]) || segment[1] }
                    fallback={ <EmptyReading>×</EmptyReading> }
                >
                    <HighlightedReading
                        faded={ !!props.highlightKanji && segment[0].indexOf(props.highlightKanji) < 0 }
                    >
                        { segment[1] || segment[0] }
                    </HighlightedReading>
                </Solid.Show>
                </>
            }
            </Solid.For>
            】
        </Solid.Show>
    </>
}


const HighlightedReading = styled.span<{
    faded: boolean,
}>`
    ${ props => props.faded ?
        `color: ${ Framework.themeVar("text3rdColor") }` :
        ``
    };
`