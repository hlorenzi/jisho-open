import * as Solid from "solid-js"
import { styled } from "solid-styled-components"
import * as Framework from "../framework/index.ts"


type JlptLevel = 5 | 4 | 3 | 2 | 1


type JouyouGrade = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10


export function TagCommonness(props: {
    commonness?: "veryCommon" | "common" | 2 | 1
})
{
    return <>
        <Solid.Show when={ props.commonness === "veryCommon" || props.commonness === 2 }>
            <Framework.IconArrowUp
                title="very common"
                color={ Framework.themeVar("iconGreenColor") }
            />
        </Solid.Show>

        <Solid.Show when={ props.commonness === "common" || props.commonness === 1 }>
            <Framework.IconArrowUpHollow
                title="somewhat common"
                color={ Framework.themeVar("iconGreenColor") }
            />
        </Solid.Show>
    </>
}


export function TagJlpt(props: {
    jlpt?: JlptLevel,
})
{
    return <Solid.Show when={ props.jlpt !== undefined }>
        <Framework.TextTag
            title={ `Appears in the Japanese Language Proficiency Test at level N${ props.jlpt }.` }
            label={ `N${ props.jlpt }` }
            bkgColor={ Framework.themeVar(`iconJlptN${ props.jlpt!.toString() as `${ JlptLevel }` }Color`) }
        />     
    </Solid.Show>
}


export function TagJouyou(props: {
    jouyou?: JouyouGrade,
})
{
    return <Solid.Show when={ props.jouyou !== undefined }>
        <Framework.TextTag
            title={ `Jōyō kanji, taught in grade ${ props.jouyou }.` }
            label={ `Jōyō Grade ${ props.jouyou }` }
            bkgColor={ Framework.themeVar(`iconJouyou${ props.jouyou!.toString() as `${ JouyouGrade }` }Color`) }
        />
    </Solid.Show>
}


export function TagKanjiNews(props: {
    rankNews?: number,
})
{
    return <Solid.Show when={ props.rankNews !== undefined }>
        <Framework.TextTag
            title={ `Ranks #${ props.rankNews } out of 2501 on the list of most common kanji used in newspapers.` }
            label={ `News #${ props.rankNews }` }
            bkgColor={ Framework.themeVar("iconNewsColor") }
        />
    </Solid.Show>
}