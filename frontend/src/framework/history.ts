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


function dispatchEventOrSetLocation(name: string, href: string, options: any = {})
{
    try
    {
        const ev: any = new Event(name)
        ev.lorenziOptions = options
        window.dispatchEvent(ev)
    }
    catch
    {
        window.location.pathname = href
        window.location.reload()
    }
}


export function historyPush(href: string)
{
    //historyUpdateScroll()
    window.history.pushState(null, "", href)
    dispatchEventOrSetLocation("lorenzi_pushstate", href)
}


export function historyPushNoReload(href: string)
{
    //historyUpdateScroll()
    window.history.pushState(null, "", href)
    dispatchEventOrSetLocation("lorenzi_pushstate", href, { noReload: true })
}


export function historyReplace(href: string)
{
    //historyUpdateScroll()
    window.history.replaceState(null, "", href)
    dispatchEventOrSetLocation("lorenzi_pushstate", href)
}


export function historyReload()
{
    //historyUpdateScroll()
    dispatchEventOrSetLocation("lorenzi_reloadstate", window.location.pathname)
}