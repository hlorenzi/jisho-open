import * as Solid from "solid-js"
import { styled } from "solid-styled-components"
import * as Framework from "../index.ts"


export function ButtonFloating(props: Framework.ButtonBehaviorProps & {
    children?: Solid.JSX.Element,
    label?: Solid.JSX.Element,
    icon?: Solid.JSX.Element,
    style?: Solid.JSX.CSSProperties,
    disabled?: boolean,
    ref?: Solid.Setter<HTMLButtonElement>,
})
{
    return <StyledButton
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


const StyledButton = styled.button`
    display: inline-block;
    background-color: ${ Framework.themeVar("focusOutlineColor") };
    cursor: pointer;
    opacity: 1;
    box-shadow: 0 0.2rem 0.4rem 0.1rem ${ Framework.themeVar("popupShadowColor") };
    transition: background-color 0.05s, opacity 0.05s;
    pointer-events: auto;

    width: 3rem;
    height: 3rem;

    margin: 0.5rem;
    margin-bottom: 1rem;
    padding: 0;
    border: 0;
    border-radius: 50%;

    font-family: inherit;
    font-size: 1em;
    color: ${ Framework.themeVar("textColor") };

    @media (pointer: coarse)
    {
        padding: 1em;
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
        opacity: 0;
    }

    &:focus-visible
    {
        outline: 2px solid ${ Framework.themeVar("focusOutlineColor") };
    }
`