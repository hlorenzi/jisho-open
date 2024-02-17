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


export function TagAteji(props: {
    show?: boolean,
})
{
    return <Solid.Show when={ props.show }>
        <Framework.TextTag
            title="ateji reading"
            label="A"
            bkgColor={ Framework.themeVar("iconAtejiColor") }
        />
    </Solid.Show>
}


export function TagGikun(props: {
    show?: boolean,
})
{
    return <Solid.Show when={ props.show }>
        <Framework.TextTag
            title="gikun reading"
            label="G"
            bkgColor={ Framework.themeVar("iconGikunColor") }
        />
    </Solid.Show>
}


export function TagNonJouyou(props: {
    show?: boolean,
})
{
    return <Solid.Show when={ props.show }>
        <Framework.IconLozenge
            title="contains kanji from outside the jōyō list"
            color={ Framework.themeVar("iconJouyouColor") }
        />
    </Solid.Show>
}


export function TagRareKanji(props: {
    show?: boolean,
})
{
    return <Solid.Show when={ props.show }>
        <Framework.IconArrowDownHollow
            title="rare kanji"
            color={ Framework.themeVar("iconBlueColor") }
        />
    </Solid.Show>
}


export function TagOutdatedKanji(props: {
    show?: boolean,
})
{
    return <Solid.Show when={ props.show }>
        <Framework.IconArrowDown
            title="outdated kanji"
            color={ Framework.themeVar("iconBlueColor") }
        />
    </Solid.Show>
}


export function TagRareKana(props: {
    show?: boolean,
})
{
    return <Solid.Show when={ props.show }>
        <Framework.IconArrowDownHollow
            title="rare kana"
            color={ Framework.themeVar("iconBlueColor") }
        />
    </Solid.Show>
}


export function TagOutdatedKana(props: {
    show?: boolean,
})
{
    return <Solid.Show when={ props.show }>
        <Framework.IconArrowDown
            title="outdated kana"
            color={ Framework.themeVar("iconBlueColor") }
        />
    </Solid.Show>
}


export function TagIrregularKanji(props: {
    show?: boolean,
})
{
    return <Solid.Show when={ props.show }>
        <Framework.IconIrregular
            title="irregular kanji"
            color={ Framework.themeVar("iconRedColor") }
        />
    </Solid.Show>
}


export function TagIrregularKana(props: {
    show?: boolean,
})
{
    return <Solid.Show when={ props.show }>
        <Framework.IconIrregular
            title="irregular kana"
            color={ Framework.themeVar("iconRedColor") }
        />
    </Solid.Show>
}


export function TagIrregularOkurigana(props: {
    show?: boolean,
})
{
    return <Solid.Show when={ props.show }>
        <Framework.IconIrregular
            title="irregular okurigana"
            color={ Framework.themeVar("iconRedColor") }
        />
    </Solid.Show>
}


export function TagSearchOnlyKanji(props: {
    show?: boolean,
})
{
    return <Solid.Show when={ props.show }>
        <Framework.TextTag
            title="search-only kanji"
            label="Ø"
            bkgColor={ Framework.themeVar("iconRedColor") }
        />
    </Solid.Show>
}


export function TagSearchOnlyKana(props: {
    show?: boolean,
})
{
    return <Solid.Show when={ props.show }>
        <Framework.TextTag
            title="search-only kana"
            label="Ø"
            bkgColor={ Framework.themeVar("iconRedColor") }
        />
    </Solid.Show>
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
            title={
                `Jōyō kanji, taught in ${
                    props.jouyou === 7 ?
                        `high-school.` :
                        `grade ${ props.jouyou }.` }`
            }
            label={ `Jōyō ${
                props.jouyou === 7 ?
                    `High-School` :
                    `Grade ${ props.jouyou }` }`
            }
            bkgColor={ Framework.themeVar(`iconJouyou${ props.jouyou!.toString() as `${ Api.JouyouGrade }` }Color`) }
        />
    </Solid.Show>
}


export function TagJinmeiyou(props: {
    jinmeiyou?: boolean,
})
{
    return <Solid.Show when={ props.jinmeiyou }>
        <Framework.TextTag
            title={ `Jinmeiyō kanji, approved for use in names and official documents.` }
            label={ `Jinmeiyō` }
            bkgColor={ Framework.themeVar("iconJinmeiyouColor") }
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