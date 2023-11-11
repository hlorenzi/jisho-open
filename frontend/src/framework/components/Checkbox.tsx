import * as Solid from "solid-js"
import { styled } from "solid-styled-components"
import * as Framework from "../index.ts"


const DivCheckbox = styled.input`
    appearance: none;
    display: inline-block;
    position: absolute;
    top: -1em;
    cursor: pointer;

    font-size: 1em;
    font-family: inherit;
    color: inherit;
    background-color: transparent;

    width: 1.25rem;
    height: 1.25rem;

    box-shadow:inset 0px 0px 0px 1px ${ Framework.themeVar("borderColor") };

    border-radius: 0.25rem;
    margin: 0em 0.25em 0.25em 0.25em;

    transition: box-shadow 0.1s, background-color 0.1s;

    &:hover
    {
        box-shadow: inset 0px 0px 0px 2px ${ Framework.themeVar("borderColor") };
    }

    &:active
    {
        box-shadow: inset 0px 0px 0px 2px ${ Framework.themeVar("borderColor") };
        background-color: ${ Framework.themeVar("buttonPressBkgColor") };
    }

    &:checked
    {
        background-color: ${ Framework.themeVar("focusOutlineColor") };
        box-shadow: inset 0px 0px 0px 2px ${ Framework.themeVar("focusOutlineColor") };
    }

    &:disabled
    {
        cursor: default;
        color: ${ Framework.themeVar("textDisabledColor") };
        border: 1px dashed ${ Framework.themeVar("borderColor") };
        box-shadow: none;
    }

    &:checked:disabled
    {
        background-color: ${ Framework.themeVar("textDisabledColor") };
        box-shadow: inset 0px 0px 0px 2px ${ Framework.themeVar("textDisabledColor") };
    }

    &:focus
    {
        outline: 2px solid ${ Framework.themeVar("focusOutlineColor") };
    }

    &:not(checked) + svg
    {
        color: transparent;
    }

    &:checked + svg
    {
        color: ${ Framework.themeVar("pageBkgColor") };
    }
`


const LabelCheckbox = styled.label<{
    disabled: boolean,
}>`
    user-select: none;
    padding-left: 0.25em;
    padding-right: 0.25em;
    cursor: ${ props => props.disabled ? "default" : "pointer" };
    color: ${ props => props.disabled ? Framework.themeVar("textDisabledColor") : "inherit" };
`


export function Checkbox(props: {
    value?: boolean,
    valueAccessor?: Solid.Accessor<boolean>,
    onChange?: (value: boolean) => void,
    label?: Solid.JSX.Element,
    children?: Solid.JSX.Element,
    labelBefore?: boolean,
    disabled?: boolean,
})
{
    const labelId = Solid.createUniqueId()
    const label = props.children ?? props.label


    const onChange = (ev: { target: HTMLInputElement }) => {
        const newValue = ev.target.checked
        props.onChange?.(newValue)
    }


	return <>
        <Solid.Show when={ !!props.labelBefore }>
            <LabelCheckbox
                html-for={ labelId }
                disabled={ !!props.disabled }
            >
                { label }
            </LabelCheckbox>
        </Solid.Show>
        
        <div style={{
            display: "inline-block",
            position: "relative",
            width: "1.75rem",
        }}>
            <DivCheckbox
                id={ labelId }
                type="checkbox"
                checked={ props.valueAccessor?.() ?? props.value }
                onChange={ onChange }
                disabled={ props.disabled }
            />
            
            <svg viewBox="0 0 100 100" style={{
                position: "absolute",
                top: "-1.5em",
                width: "1.25rem",
                height: "1.25rem",
                margin: "0.5em 0.25em 0 0.25em",
                "pointer-events": "none",
            }}>
                <path fill="currentColor" stroke="none" d="
                    M 25,40
                    L 40,55
                    L 75,15
                    L 90,30
                    L 40,85
                    L 10,55
                    Z
                "/>
            </svg>
        </div>

        <Solid.Show when={ !props.labelBefore }>
            <LabelCheckbox
                html-for={ labelId }
                disabled={ !!props.disabled }
            >
                { label }
            </LabelCheckbox>
        </Solid.Show>
	</>
}