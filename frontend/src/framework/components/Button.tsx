import * as Solid from "solid-js"
import { css } from "solid-styled-components"
import * as Framework from "../index.ts"


const styleClass = css`
    color: ${ Framework.themeVar("textColor") };
    --local-borderColor: ${ Framework.themeVar("borderColor") };

    &.accent
    {
        color: ${ Framework.themeVar("buttonAccentColor") };
        --local-borderColor: ${ Framework.themeVar("buttonAccentColor") };
    }

    &.danger
    {
        color: ${ Framework.themeVar("buttonDangerColor") };
        --local-borderColor: ${ Framework.themeVar("buttonDangerColor") };
    }

    appearance: button;
    display: inline-block;
    border: 1px solid transparent;
    background-color: transparent;
    box-shadow: inset 0px 0px 0px 1px var(--local-borderColor);
    transition: box-shadow 0.05s, background-color 0.05s;
    cursor: pointer;
    text-decoration: none;
    box-sizing: border-box;

    margin: 0.125em;
    padding: 0.3em;
    border-radius: 0.25rem;
    font-family: inherit;
    font-weight: inherit;
    font-size: 0.9em;

    @media (pointer: coarse)
    {
        padding: 0.5em 0.5em;
    }

    &:hover
    {
        box-shadow: inset 0px 0px 0px 1.5px var(--local-borderColor);
        background-color: ${ Framework.themeVar("buttonHoverBkgColor") };
    }

    &:active
    {
        box-shadow: inset 0px 0px 0px 1.5px var(--local-borderColor);
        background-color: ${ Framework.themeVar("buttonPressBkgColor") };
    }

    &:disabled
    {
        cursor: default;
        color: ${ Framework.themeVar("textDisabledColor") };
        border: 1px dashed var(--local-borderColor);
        box-shadow: none;
    }
`


export function Button(props: Framework.ButtonBehaviorProps & {
    children?: Solid.JSX.Element,
    label?: Solid.JSX.Element,
    icon?: Solid.JSX.Element,
    style?: Solid.JSX.CSSProperties,
    disabled?: boolean,
    accent?: boolean,
    danger?: boolean,
    ref?: Solid.Setter<HTMLButtonElement>,
})
{
    const className = 
        `${ props.accent ? "accent " : ""}` +
        `${ props.danger ? "danger " : ""}`

    if (props.href && !props.disabled)
    {
        return <a
            class={ styleClass }
            class-name={ className }
            href={ props.href }
            title={ props.title }
            onClick={ ev => Framework.onButtonClick(ev, props) }
            style={ props.style }>
                { props.icon }
                { props.icon ? " " : null }
                { props.children || props.label }
        </a>
    }
    else
    {
        return <button
            class={ styleClass }
            class-name={ className }
            ref={ props.ref }
            title={ props.title }
            disabled={ !!props.disabled }
            onClick={ ev => Framework.onButtonClick(ev, props) }
            style={ props.style }>
                { props.icon }
                { props.icon ? " " : null }
                { props.children || props.label }
        </button>
    }
}