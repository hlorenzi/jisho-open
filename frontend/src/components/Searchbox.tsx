import * as Solid from "solid-js"
import { styled } from "solid-styled-components"
import * as Framework from "../framework/index.ts"
import * as App from "../app.tsx"
import { InputKanjiComponents } from "./InputKanjiComponents.tsx"


export function Searchbox(props: {
    initialText?: string,
    textSignal?: Solid.Signal<string>,
    noInputButton?: boolean,
    onSearch?: () => void,
    position?: App.Prefs["searchboxPosition"],
})
{
    const [searchbox, setSearchbox] =
        props.textSignal ??
        Solid.createSignal(props.initialText ?? "")

    let [inputRef, setInputRef] =
        Solid.createSignal<HTMLInputElement | undefined>(undefined)
    
    const onClear = () => {
        App.analyticsEvent("searchClear")
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

        if (Framework.isMobile())
            inputRef()?.blur()

        props.onSearch?.()
        Framework.historyPushNoReload(App.Pages.Search.urlForQuery(text))
        window.scrollTo(0, 0)
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

    return <Solid.Show when={
        props.position === undefined ||
        App.usePrefs().searchboxPosition === props.position
    }>
        <Layout>
            <Solid.Show
                when={ props.position === "bottom" && !props.noInputButton }
                fallback={ <div/> }
            >
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
            <Framework.InputText
                ref={ setInputRef }
                id="searchbox"
                autofocus={ !props.noInputButton }
                search
                placeholder={
                    document.body.getBoundingClientRect().width < 800 ?
                        "Eng., Jap., rōmaji..." :
                        "Search in English, Japanese, rōmaji..."
                }
                value={ searchbox }
                onInput={ setSearchbox }
                onEnter={ (ev) => {
                    App.analyticsEvent("searchByEnter")
                    onSearch(ev)
                }}
            />
            <Solid.Show
                when={ props.position !== "bottom" && !props.noInputButton }
                fallback={ <div/> }
            >
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
            <Solid.Show
                when={ props.position !== "bottom" }
                fallback={ <div/> }
            >
                <Framework.Button
                    title="Search"
                    label={ <Framework.IconMagnifyingGlass/> }
                    onClick={ (ev) => {
                        App.analyticsEvent("searchByButton")
                        onSearch(ev)
                    }}
                    noPadding
                    style={{ width: "3em" }}
                />
            </Solid.Show>
            { inputPopup?.rendered }
        </Layout>
    </Solid.Show>
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
        App.analyticsEvent("searchFocusByEsc")
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
        
        App.analyticsEvent("searchFocusByTyping")
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
    grid-template: auto / auto 1fr auto auto auto;
`


export function SearchboxBottomOverlay(props: {
    searchQuery?: string,
})
{
    return <Solid.Show when={ App.usePrefs().searchboxPosition === "bottom" }>
        <LayoutBottomOverlay>
            <Searchbox
                position="bottom"
                initialText={ props.searchQuery ?? "" }
            />
        </LayoutBottomOverlay>
    </Solid.Show>
}


const LayoutBottomOverlay = styled.div`
    background-color: ${ Framework.themeVar("pageBkgColor") };
    border-top: 1px solid ${ Framework.themeVar("borderColor") };
    border-left: 1px solid ${ Framework.themeVar("borderColor") };
    border-right: 1px solid ${ Framework.themeVar("borderColor") };
    pointer-events: auto;

    width: calc(100% + var(--local-pagePadding) * 2);
    margin: 0;
    margin-left: calc(0px - var(--local-pagePadding));
    margin-right: calc(0px - var(--local-pagePadding));
    padding-top: 0.4em;
    padding-bottom: 0.4em;
    padding-left: var(--local-pagePadding);
    padding-right: var(--local-pagePadding);

    box-shadow: 0 -0.15em 0.15em ${ Framework.themeVar("popupShadowColor") };
`