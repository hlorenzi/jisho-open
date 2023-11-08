import * as Solid from "solid-js"
import { styled } from "solid-styled-components"
import * as Framework from "../index.ts"


const StyledInput = styled.input`
    min-width: 0;

    font-size: 1em;
    font-family: inherit;
    color: inherit;
    background-color: transparent;

    box-sizing: border-box;
    border: 1px solid ${ Framework.themeVar("borderColor") };
    border-radius: 0.25rem;

    margin: 0.125em;
    padding: 0.4em 0.5em;

    transition: box-shadow 0.05s, border-bottom-color 0.05s;

    &:hover
    {
        box-shadow: inset 0px 0px 0px 0.5px ${ Framework.themeVar("borderColor") };
        background-color: transparent;
    }

    &:disabled
    {
        color: ${ Framework.themeVar("textDisabledColor") };
        border: 1px dashed ${ Framework.themeVar("borderColor") };
    }

    &::placeholder
    {
        color: ${ Framework.themeVar("text4thColor") };
    }
`


export function InputText(props: {
    initialValue?: string,
    value?: Solid.Accessor<string>,
    onChange?: (value: string) => void,
    onInput?: (value: string) => void,
    onEnter?: () => void,
    placeholder?: string,
    autofocus?: boolean,
    style?: Solid.JSX.CSSProperties,
})
{
    return <StyledInput
        type="text"
        value={ props.value?.() ?? props.initialValue ?? "" }
        placeholder={ props.placeholder }
        onChange={ ev => props.onChange?.(ev.target.value) }
        onInput={ ev => props.onInput?.(ev.target.value) }
        onKeyDown={ ev => { if (ev.key === "Enter") props.onEnter?.() }}
        autofocus={ props.autofocus }
        style={ props.style }
    />
}