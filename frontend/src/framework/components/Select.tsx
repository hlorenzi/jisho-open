import * as Solid from "solid-js"
import { styled } from "solid-styled-components"
import * as Framework from "../index.ts"


export type Option<Key> = {
    value: Key
    label: Solid.JSX.Element
}


export function Select<Key extends string>(props: {
    initialValue?: Key,
    value?: Solid.Accessor<Key>,
    onChange?: (value: Key) => void,
    options?: Option<Key>[],
    label?: Solid.JSX.Element,
    style?: Solid.JSX.CSSProperties,
})
{
    const labelId = Solid.createUniqueId()

    return <Layout>

        <Label for={ labelId }>
            { props.label }
        </Label>

        <StyledSelect
            id={ labelId }
            value={ props.value?.() ?? props.initialValue ?? "" }
            onChange={ ev => props.onChange?.(ev.target.value as Key) }
            style={ props.style }
        >
            <Solid.For each={ props.options }>
            { (option) =>
                <option value={ option.value }>
                    { option.label }
                </option>
            }
            </Solid.For>
        </StyledSelect>

    </Layout>
}


const Layout = styled.span`
    display: inline-block;

    margin: 0.125em;
    padding: 0 0 0 0.5em;
    border: 1px solid ${ Framework.themeVar("borderColor") };
    border-radius: ${ Framework.themeVar("borderRadius") };
    transition: box-shadow 0.05s;
    cursor: pointer;
    user-select: none;
    background-color: ${ Framework.themeVar("pageBkgColor") };

    @media (pointer: coarse)
    {
        padding: 0.2em 0.6em;
    }

    &:hover
    {
        box-shadow: inset 0px 0px 0px 0.5px ${ Framework.themeVar("borderColor") };
    }

    &:disabled
    {
        color: ${ Framework.themeVar("textDisabledColor") };
        border: 1px dashed ${ Framework.themeVar("borderColor") };
    }
`


const Label = styled.label`
    display: inline-block;
    color: ${ Framework.themeVar("text3rdColor") };
    font-size: 0.8em;
    margin-right: 0.25em;
    cursor: pointer;
`


const StyledSelect = styled.select`
    min-width: 0;

    font-size: 1em;
    font-family: inherit;
    color: inherit;
    background-color: ${ Framework.themeVar("pageBkgColor") };
    transition: background-color 0.05s;
    cursor: pointer;

    border: 0;
    border-radius: ${ Framework.themeVar("borderRadius") };

    padding: 0.25em;

    &:hover
    {
        background-color: ${ Framework.themeVar("buttonHoverBkgColor") };
    }
`