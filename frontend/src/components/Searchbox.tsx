import * as Solid from "solid-js"
import { styled, keyframes } from "solid-styled-components"
import * as Framework from "../framework/index.ts"
import * as Pages from "../pages.ts"
import { InputKanjiComponents } from "./InputKanjiComponents.tsx"


export function Searchbox(props: {
    initialText?: string,
    textSignal?: Solid.Signal<string>,
    noInputButton?: boolean,
    onSearch?: () => void,
})
{
    const [searchbox, setSearchbox] =
        props.textSignal ??
        Solid.createSignal(props.initialText ?? "")

    let [inputRef, setInputRef] =
        Solid.createSignal<HTMLInputElement | undefined>(undefined)
    
    const onClear = () => {
        setSearchbox("")
        inputRef()?.select()
        inputRef()?.focus()
    }

    const onSearch = (ev: Event) => {
        const text = searchbox()
        if (text.length === 0)
            return
        
        ev.preventDefault()
        ev.stopPropagation()
        props.onSearch?.()
        Framework.historyPushNoReload(Pages.Search.urlForQuery(text))
    }

    Solid.onMount(() => {
        const onKeyDown = (ev: KeyboardEvent) => {
            windowOnKeyDown(ev, inputRef())
        }

        window.addEventListener("keydown", onKeyDown)

        Solid.onCleanup(() => {
            window.removeEventListener("keydown", onKeyDown)
        })
    })

    const inputPopup =
        props.noInputButton ?
            undefined :
            Framework.makePopupFull({
                childrenFn: () => 
                    <InputKanjiComponents
                        textSignal={ [searchbox, setSearchbox] }
                        close={ inputPopup!.close }
                    />
            })

    return <Layout>
        <Framework.InputText
            ref={ setInputRef }
            autofocus
            placeholder={
                document.body.getBoundingClientRect().width < 800 ?
                    "Eng., Jap., rōmaji..." :
                    "Search in English, Japanese, rōmaji..."
            }
            value={ searchbox }
            onInput={ setSearchbox }
            onEnter={ onSearch }
        />
        <Solid.Show when={ !props.noInputButton }>
            <Framework.Button
                title="Input kanji by components"
                label={
                    <span style={{ "font-size": "1.25em", "font-weight": "bold" }}>
                        部
                    </span>
                }
                onClick={ inputPopup!.open }
                noPadding
                style={{ width: "3em" }}
            />
        </Solid.Show>
        <Framework.Button
            title="Clear"
            label={ <Framework.IconX/> }
            onClick={ onClear }
            noPadding
            style={{ width: "3em" }}
        />
        <Framework.Button
            title="Search"
            label={ <Framework.IconMagnifyingGlass/> }
            onClick={ onSearch }
            noPadding
            style={{ width: "3em" }}
        />
        { inputPopup?.rendered }
    </Layout>
}


function windowOnKeyDown(
    ev: KeyboardEvent,
    inputElem?: HTMLInputElement)
{
    const key = (ev.key || "").toLowerCase()
    const keyCode = key.length !== 1 ? 0 : key.codePointAt(0) ?? 0

    if (!inputElem)
        return

    // Focus on searchbox with Esc, highlighting everything
    if (key == "escape")
    {
        window.scrollTo(0, 0)
        inputElem.select()
        inputElem.focus()
        return
    }
    
    // Focus on searchbox with the cursor at the end,
    // if you start typing letters or if you paste with Ctrl+V
    // anywhere in the page.
    if (key == "backspace" ||
        (keyCode >= "a".codePointAt(0)! && keyCode <= "z".codePointAt(0)!))
    {
        if (document.activeElement === inputElem)
            return

        if (ev.ctrlKey && key === "c")
            return
        
        window.scrollTo(0, 0)
        inputElem.select()
        inputElem.focus()
        inputElem.selectionEnd = inputElem.value.length
        inputElem.selectionStart = inputElem.value.length
        return
    }
}


const Layout = styled.div`
    display: grid;
    grid-template: auto / 1fr auto auto auto;
`