import * as Solid from "solid-js"
import { styled, css } from "solid-styled-components"
import * as Framework from "../index.ts"


const style = css`
    color: var(--theme-textColor);
    --local-borderColor: var(--theme-borderColor);

    &.accent
    {
        color: var(--theme-buttonAccentColor);
        --local-borderColor: var(--theme-buttonAccentColor);
    }

    &.danger
    {
        color: var(--theme-buttonDangerColor);
        --local-borderColor: var(--theme-buttonDangerColor);
    }

    appearance: button;
    display: inline-block;
    border: 1px solid transparent;
    background-color: transparent;
    box-shadow: inset 0px 0px 0px 1px var(--local-borderColor);
    transition: box-shadow 0.1s, background-color 0.1s;
    cursor: pointer;
    text-decoration: none;
    box-sizing: border-box;

    margin: 0 0.25em 0.25em 0;
    padding: 0.4em 1em;
    border-radius: 0.25rem;
    font-family: inherit;
    font-weight: inherit;
    font-size: 0.9em;

    @media (pointer: coarse)
    {
        padding: 0.8em 1em;
    }

    &:hover
    {
        box-shadow: inset 0px 0px 0px 2px var(--local-borderColor);
    }

    &:active
    {
        box-shadow: inset 0px 0px 0px 2px var(--local-borderColor);
        background-color: var(--theme-buttonPressBkgColor);
    }

    &:disabled
    {
        cursor: default;
        color: var(--theme-textDisabledColor);
        border: 1px dashed var(--local-borderColor);
        box-shadow: none;
    }

    &:focus
    {
        outline: 2px solid var(--theme-focusColor);
    }

    h1 &
    {
        margin-top: -0.5em;
        margin-bottom: -0.5em;
    }

    h2 &
    {
        margin-top: -0.5em;
        margin-bottom: -0.5em;
    }

    h3 &
    {
        margin-top: -0.5em;
        margin-bottom: -0.5em;
    }
`


const StyledAnchor = styled.a`
    ${ style }
`


const StyledButton = styled.button`
    ${ style }
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
    const className = `
        ${ props.accent ? "accent " : ""}
        ${ props.danger ? "danger " : ""}
    `

    if (props.href && !props.disabled)
    {
        return <StyledAnchor
            class-name={ className }
            href={ props.href }
            title={ props.title }
            onClick={ ev => Framework.onButtonClick(ev, props) }
            style={ props.style }>
                { props.icon }
                { props.icon ? " " : null }
                { props.children || props.label }
        </StyledAnchor>
    }
    else
    {
        return <StyledButton
            class-name={ className }
            ref={ props.ref }
            title={ props.title }
            disabled={ !!props.disabled }
            onClick={ ev => Framework.onButtonClick(ev, props) }
            style={ props.style }>
                { props.icon }
                { props.icon ? " " : null }
                { props.children || props.label }
        </StyledButton>
    }
}