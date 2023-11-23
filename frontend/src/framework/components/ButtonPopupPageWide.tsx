import * as Solid from "solid-js"
import { css } from "solid-styled-components"
import * as Framework from "../index.ts"


export function ButtonPopupPageWide(props: Framework.ButtonBehaviorProps & {
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


const styleClass = css`
    color: ${ Framework.themeVar("textColor") };
    --local-borderColor: ${ Framework.themeVar("borderColor") };

    appearance: none;
    display: block;
    width: calc(100% + var(--local-pagePadding) * 2);
    background-color: transparent;
    transition: background-color 0.05s;
    cursor: pointer;
    text-align: left;
    text-decoration: none;
    box-sizing: border-box;

    margin: 0;
    margin-left: calc(0px - var(--local-pagePadding));
    margin-right: calc(0px - var(--local-pagePadding));
    padding-top: 0.4em;
    padding-bottom: 0.4em;
    padding-left: var(--local-pagePadding);
    padding-right: var(--local-pagePadding);
    border: 0;
    border-radius: 0;
    font-family: inherit;
    font-weight: inherit;
    font-size: 1em;

    @media (pointer: coarse)
    {
        padding: 0.8em 1em;
    }

    &:hover
    {
        background-color: ${ Framework.themeVar("buttonHoverBkgColor") };
    }

    &:active
    {
        background-color: ${ Framework.themeVar("buttonPressBkgColor") };
    }

    &:disabled
    {
        cursor: default;
        color: ${ Framework.themeVar("textDisabledColor") };
    }
`