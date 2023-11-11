import * as Solid from "solid-js"
import { styled } from "solid-styled-components"
import * as Framework from "../framework/index.ts"
import * as Pages from "../pages.ts"
import { InputKanjiComponents } from "./InputKanjiComponents.tsx"


export function Searchbox(props: {
    initialText?: string,
})
{
    const [searchbox, setSearchbox] =
        Solid.createSignal(props.initialText ?? "")

    let [inputRef, setInputRef] =
        Solid.createSignal<HTMLInputElement | undefined>(undefined)
    
    const onClear = () => {
        setSearchbox("")
        inputRef()?.select()
        inputRef()?.focus()
    }

    const onSearch = () => {
        const text = searchbox()
        if (text.length === 0)
            return
        
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

    const inputPopup = makeInputPopup({})

    return <Layout>
        <Framework.InputText
            ref={ setInputRef }
            autofocus
            placeholder="Search in English, Japanese, rōmaji..."
            value={ searchbox }
            onInput={ setSearchbox }
            onEnter={ onSearch }
        />
        <Framework.Button
            title="Input kanji by components"
            label={
                <span style={{ "font-size": "1.25em", "font-weight": "bold" }}>
                    部
                </span>
            }
            onClick={ inputPopup.open }
            style={{ width: "3em" }}
        />
        <Framework.Button
            title="Clear"
            label={ <Framework.IconX/> }
            onClick={ onClear }
            style={{ width: "3em" }}
        />
        <Framework.Button
            title="Search"
            label={ <Framework.IconMagnifyingGlass/> }
            onClick={ onSearch }
            style={{ width: "3em" }}
        />
        { inputPopup.rendered }
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
    // if you start typing or if you paste with Ctrl+V
    // anywhere in the page.
    if (key == "backspace" ||
        (keyCode >= "a".codePointAt(0)! && keyCode <= "z".codePointAt(0)!) ||
        keyCode == " ".codePointAt(0))
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
    margin-bottom: 0.5em;
`


function makeInputPopup(props: {

})
{
    let dialog: HTMLDialogElement | undefined = undefined

    const open = () => {
        dialog?.showModal()
    }

    const close = () => {
        dialog?.close()
    }

    const rendered = <PopupLayout
            ref={ dialog }
        >
            <InputKanjiComponents/>
        </PopupLayout>

    return {
        rendered,
        open,
        close,
    }
}


const PopupLayout = styled.dialog`
    max-width: min(calc(100% - 1em), ${ Framework.pageWidth });
    max-height: calc(100vh - 4em);
    padding: 0.5em;
    border: 1px solid ${ Framework.themeVar("borderColor") };
    background-color: ${ Framework.themeVar("pageBkgColor") };
    border-radius: 0.25rem;
    box-shadow: 0 0.15em 0.15em ${ Framework.themeVar("popupShadowColor") };
`