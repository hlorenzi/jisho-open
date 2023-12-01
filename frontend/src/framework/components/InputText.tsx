import * as Solid from "solid-js"
import { styled } from "solid-styled-components"
import * as Framework from "../index.ts"


export function InputText(props: {
    ref?: Solid.Ref<HTMLInputElement>,
    initialValue?: string,
    value?: Solid.Accessor<string>,
    onChange?: (value: string) => void,
    onInput?: (value: string) => void,
    onEnter?: (ev: KeyboardEvent) => void,
    search?: boolean,
    disabled?: boolean,
    id?: string,
    placeholder?: string,
    autofocus?: boolean,
    style?: Solid.JSX.CSSProperties,
})
{
    return <StyledInput
        ref={ props.ref }
        id={ props.id }
        //type={ props.search ? "search" : "text" }
        value={ props.value?.() ?? props.initialValue ?? "" }
        placeholder={ props.placeholder }
        onChange={ ev => props.onChange?.(ev.target.value) }
        onInput={ ev => props.onInput?.(ev.target.value) }
        onKeyDown={ ev => { if (ev.key === "Enter") props.onEnter?.(ev) }}
        disabled={ props.disabled }
        autofocus={ props.autofocus }
        spellcheck={ false }
        autocorrect="off"
        autocomplete="off"
        autocapitalize="off"
        style={ props.style }
    />
}


const StyledInput = styled.input`
    min-width: 0;

    font-size: 1em;
    font-family: inherit;
    color: inherit;
    background-color: transparent;

    box-sizing: border-box;
    border: 1px solid ${ Framework.themeVar("borderColor") };
    border-radius: ${ Framework.themeVar("borderRadius") };

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