import * as Solid from "solid-js"
import { styled } from "solid-styled-components"
import * as Furigana from "common/furigana.ts"


export function FuriganaRender(props: {
    encoded?: string,
})
{
    const furigana = Furigana.decode(props.encoded ?? "")

    return <ruby lang="ja">
        <Solid.For each={ furigana }>{ (segment) => {
            const dotted =
                segment[1] !== "" &&
                segment[1] !== segment[0] &&
                segment[0].length > 1
            
            return <>
                { segment[0] }
                <Rt dotted={ dotted }>
                    { segment[1] === segment[0] ? "" : segment[1] }
                </Rt>
            </>
        }}
        </Solid.For>
    </ruby>
}


const Rt = styled.rt<{
    dotted: boolean,
}>`
    user-select: none;

    ${ props => props.dotted ? `
        border-top: 2px dotted var(--theme-text3rdColor);
        border-top-left-radius: 0.5em;
        border-top-right-radius: 0.5em;
    ` : `` }
`