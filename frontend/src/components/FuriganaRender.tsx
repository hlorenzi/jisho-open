import * as Solid from "solid-js"
import { styled } from "solid-styled-components"
import * as Furigana from "common/furigana.ts"


export function FuriganaRender(props: {
    encoded?: string,
})
{
    const furigana = Furigana.decode(props.encoded ?? "")

    return <ruby lang="ja">
        <Solid.For each={ furigana }>{ (segment) =>
            <>
            { segment[0] }
            <Rt>{ segment[1] === segment[0] ? "" : segment[1] }</Rt>
            </>
        }
        </Solid.For>
    </ruby>
}


const Rt = styled.rt`
    user-select: none;
`