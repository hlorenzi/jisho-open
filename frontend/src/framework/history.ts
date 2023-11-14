import * as Solid from "solid-js"
import * as Framework from "./index.ts"


type HistoryState = {
    scrollY?: number
    [key: string]: any
}


export function historyUpdateScroll()
{
    const scrollY = window.scrollY

    const newHistoryState: HistoryState = {
        ...window.history.state,
        scrollY,
    }
    
    //console.log(window.location.href, "scrollY set", scrollY)

    window.history.replaceState(
        newHistoryState,
        "",
        window.location.href)
}


export function historyGetScroll()
{
    const state = window.history.state as HistoryState | undefined
    const scrollY = state?.scrollY ?? 0

    //console.log(window.location.href, "scrollY get", scrollY)

    return scrollY
}


export interface HistoryEvent extends Event
{
    data?: HistoryData
}


export interface HistoryData
{
    noReload?: boolean
}


function dispatchEventOrSetLocation(
    name: string,
    href: string, 
    data: HistoryData = {})
{
    try
    {
        const ev = new Event(name) as HistoryEvent
        ev.data = data
        window.dispatchEvent(ev)
    }
    catch
    {
        window.location.pathname = href
        window.location.reload()
    }
}


export const historyPushStateEvent = "lorenzi_pushstate"
export const historyPushStateNoReloadEvent = "lorenzi_pushstate_noreload"
export const historyReloadStateEvent = "lorenzi_reloadstate"


export function historyPush(href: string)
{
    //historyUpdateScroll()
    window.history.pushState(null, "", href)
    dispatchEventOrSetLocation(historyPushStateEvent, href)
}


export function historyPushNoReload(href: string)
{
    //historyUpdateScroll()
    window.history.pushState(null, "", href)
    dispatchEventOrSetLocation(historyPushStateNoReloadEvent, href, { noReload: true })
}


export function historyReplace(href: string)
{
    //historyUpdateScroll()
    window.history.replaceState(null, "", href)
    dispatchEventOrSetLocation(historyPushStateEvent, href)
}


export function historyReload()
{
    //historyUpdateScroll()
    dispatchEventOrSetLocation(historyReloadStateEvent, window.location.pathname)
}


export function createHistorySignal<N extends string, T>(
    name: N,
    defaultValue: Exclude<T, Function>)
    : [Solid.Accessor<T>, (newValue: Exclude<T, Function>) => void]
{
    type HistoryStateWithKey = HistoryState & {
        [key in N]: Exclude<T, Function>
    }

    const getFromHistory = () => {
        const historyState = (window.history.state as HistoryStateWithKey) ?? {}
        if (historyState[name] !== undefined)
            return historyState[name]

        return defaultValue
    }

    const [state, setState] = Solid.createSignal<T>(getFromHistory())

    const [pending, _] = Solid.useTransition()

    const refreshFromHistory = () => {
        if (!pending())
        {
            //console.log("refreshFromHistory")
            setState(getFromHistory())
        }
    }

    const getState = () => {
        state()
        return getFromHistory()
    }

    const setState2 = (newState: Exclude<T, Function>) => {
        const newHistoryState: HistoryStateWithKey = {
            ...window.history.state,
            [name]: newState,
        }

        window.history.replaceState(
            newHistoryState,
            "",
            window.location.href)

        setState(newState)
    }

    window.addEventListener(Framework.historyPushStateNoReloadEvent, refreshFromHistory)
    
    Solid.onCleanup(() => {
        window.removeEventListener(Framework.historyPushStateNoReloadEvent, refreshFromHistory)
    })

    return [getState, setState2]
}