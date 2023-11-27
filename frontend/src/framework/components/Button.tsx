import * as Solid from "solid-js"
import { css } from "solid-styled-components"
import * as Framework from "../index.ts"


export function Button(props: Framework.ButtonBehaviorProps & {
    children?: Solid.JSX.Element,
    label?: Solid.JSX.Element,
    icon?: Solid.JSX.Element,
    style?: Solid.JSX.CSSProperties,
    disabled?: boolean,
    noBorder?: boolean,
    noPadding?: boolean,
    iconPadding?: boolean,
    accent?: boolean,
    danger?: boolean,
    toggled?: boolean,
    unavailable?: boolean,
    ref?: Solid.Setter<HTMLButtonElement>,
})
{
    if (props.href && !props.disabled)
    {
        return <a
            class={ styleClass }
            classList={{
                noBorder: props.noBorder,
                noPadding: props.noPadding,
                iconPadding: props.iconPadding,
                accent: props.accent,
                danger: props.danger,
                toggled: props.toggled,
                unavailable: props.unavailable,
            }}
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
            classList={{
                noBorder: props.noBorder,
                noPadding: props.noPadding,
                iconPadding: props.iconPadding,
                accent: props.accent,
                danger: props.danger,
                toggled: props.toggled,
                unavailable: props.unavailable,
            }}
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

    &.toggled
    {
        color: ${ Framework.themeVar("text4thColor") };
        background-color: ${ Framework.themeVar("buttonToggledBkgColor") };
        --local-borderColor: ${ Framework.themeVar("buttonAccentColor") };
    }

    &.unavailable
    {
        color: ${ Framework.themeVar("text4thColor") };
        --local-borderColor: transparent;
    }

    &.noBorder
    {
        --local-borderColor: transparent;
    }

    padding: 0.35em 0.5em;

    &.noPadding
    {
        padding: 0;
    }

    &.iconPadding
    {
        padding: 0.25em;
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
    user-select: none;

    margin: 0.125em;
    border-radius: ${ Framework.themeVar("borderRadius") };
    font-family: inherit;
    font-weight: inherit;

    @media (pointer: coarse)
    {
        padding: 0.6em 0.8em;

        &.noPadding
        {
            padding: 0.4em 0.5em;
        }

        &.iconPadding
        {
            padding: 0.35em;
        }
    }

    &:hover
    {
        box-shadow: inset 0px 0px 0px 1.5px var(--local-borderColor);
        background-color: ${ Framework.themeVar("buttonHoverBkgColor") };
        
        &.toggled
        {
            background-color: ${ Framework.themeVar("buttonToggledBkgColor") };
        }
    }

    &:active
    {
        box-shadow: inset 0px 0px 0px 1.5px var(--local-borderColor);
        background-color: ${ Framework.themeVar("buttonPressBkgColor") };
        
        &.toggled
        {
            background-color: ${ Framework.themeVar("buttonAccentColor") };
        }
    }

    &:disabled
    {
        cursor: default;
        color: ${ Framework.themeVar("textDisabledColor") };
        border: 1px dashed var(--local-borderColor);
        box-shadow: none;
    }
`