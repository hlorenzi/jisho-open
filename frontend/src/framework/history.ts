/*export function historyUpdateScroll()
{
    const scrollY = window.scrollY

    const newHistoryState = {
        ...window.history.state,
        scrollY,
    }
    
    if (window.params.env === "development")
        console.log(window.location.href, "newState", newHistoryState)

    window.history.replaceState(newHistoryState, null, window.location.href)
}*/


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
    dispatchEventOrSetLocation(historyPushStateEvent, href, { noReload: true })
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