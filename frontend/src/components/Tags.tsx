import * as Solid from "solid-js"
import { styled } from "solid-styled-components"
import * as Framework from "../framework/index.ts"
import * as Api from "common/api/index.ts"


export function TagCommonness(props: {
    commonness?: Api.CommonnessTag | Api.CommonnessIndex
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
    jlpt?: Api.JlptLevel,
})
{
    return <Solid.Show when={ props.jlpt !== undefined }>
        <Framework.TextTag
            title={ `Appears in the Japanese Language Proficiency Test at level N${ props.jlpt }.` }
            label={ `N${ props.jlpt }` }
            bkgColor={ Framework.themeVar(`iconJlptN${ props.jlpt!.toString() as `${ Api.JlptLevel }` }Color`) }
        />     
    </Solid.Show>
}


export function TagJouyou(props: {
    jouyou?: Api.JouyouGrade,
})
{
    return <Solid.Show when={ props.jouyou !== undefined }>
        <Framework.TextTag
            title={ `Jōyō kanji, taught in grade ${ props.jouyou }.` }
            label={ `Jōyō Grade ${ props.jouyou }` }
            bkgColor={ Framework.themeVar(`iconJouyou${ props.jouyou!.toString() as `${ Api.JouyouGrade }` }Color`) }
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