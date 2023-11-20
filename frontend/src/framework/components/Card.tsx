import * as Solid from "solid-js"
import { styled } from "solid-styled-components"
import * as Framework from "../index.ts"


export function Card(props: Framework.ButtonBehaviorProps & {
    label?: Solid.JSX.Element,
    icon?: Solid.JSX.Element,
    href?: string,
    children?: Solid.JSX.Element,
    style?: Solid.JSX.CSSProperties,
})
{
    return <CardLayout
        hasHover={ !!props.href }
    >

        <Solid.Show when={ props.href }>
            <Framework.Link
                href={ props.href }
                noUnderline
            >
                { props.children }
            </Framework.Link>
        </Solid.Show>

        <Solid.Show when={ !props.href }>
            { props.children }
        </Solid.Show>

    </CardLayout>
}


const CardLayout = styled.div<{
    hasHover: boolean
}>`
    display: inline-block;
    width: 100%;
    padding: 0.25em 0.5em;
    background-color: ${ Framework.themeVar("pageBkgColor") };
    border: 1px solid ${ Framework.themeVar("borderColor") };
    border-radius: ${ Framework.themeVar("borderRadius") };
    box-shadow: 0 0.15em 0.15em ${ Framework.themeVar("popupShadowColor") };
    transition: background-color 0.05s;

    ${ props => props.hasHover ? `
        &:hover {
            background-color: ${ Framework.themeVar("buttonHoverBkgColor") };
        }
    ` : `` }
`