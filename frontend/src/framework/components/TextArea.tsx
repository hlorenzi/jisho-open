import * as Solid from "solid-js"
import { styled } from "solid-styled-components"
import * as Framework from "../index.ts"


export function TextArea(props: {
    initialValue?: string,
    value?: Solid.Accessor<string>,
    onChange?: (value: string) => void,
    onInput?: (value: string) => void,
    disabled?: boolean,
    readOnly?: boolean,
    id?: string,
    placeholder?: string,
    autofocus?: boolean,
    style?: Solid.JSX.CSSProperties,
})
{
    return <StyledTextArea
        id={ props.id }
        value={ props.value?.() ?? props.initialValue ?? "" }
        placeholder={ props.placeholder }
        onChange={ ev => props.onChange?.(ev.target.value) }
        onInput={ ev => props.onInput?.(ev.target.value) }
        disabled={ props.disabled }
        autofocus={ props.autofocus }
        readOnly={ props.readOnly }
        spellcheck={ false }
        autocomplete="off"
        autocapitalize="off"
        style={ props.style }
    />
}


const StyledTextArea = styled.textarea`
    min-width: 0;

    font-size: 0.8em;
    font-family: monospace;
    color: inherit;
    background-color: ${ Framework.themeVar("textStrongBkgColor") };

    box-sizing: border-box;
    border: 1px solid ${ Framework.themeVar("borderColor") };
    border-radius: ${ Framework.themeVar("borderRadius") };

    margin: 0.125em;
    padding: 0.4em 0.5em;

    transition: box-shadow 0.05s, border-bottom-color 0.05s;

    &:hover
    {
        box-shadow: inset 0px 0px 0px 0.5px ${ Framework.themeVar("borderColor") };
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