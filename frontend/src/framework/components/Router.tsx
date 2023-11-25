import * as Solid from "solid-js"
import { styled } from "solid-styled-components"
import * as Framework from "../index.ts"


const debugFetchDelayMs = 0


export function Router(props: {
    routes: Framework.Route[],
})
{
    window.history.scrollRestoration = "manual"

    const [pending, transitionStart] = Solid.useTransition()

    const [routeMatch, setRouteMatch] =
        Solid.createSignal<Framework.RouteMatch | null>(null)

    const [routeProps, setRouteProps] =
        Solid.createSignal<Framework.RouteMatch | null>(null)

    const [hasErrored, setHasErrored] =
        Solid.createSignal(false)


    Solid.onMount(() => {
        console.log("Router.onMount")

        async function onNavigation(ev: Framework.HistoryEvent)
        {
            console.log(
                "%cRouter.onNavigation",
                "color: white; background-color: orange;",
                window.location.pathname)

            if (hasErrored())
            {
                window.location.reload()
                return
            }

            Framework.Analytics.navigate(window.location.pathname)

            const match = Framework.getMatchForPath(
                props.routes,
                window.location.pathname,
                window.location.search)


            const matchPrev = routeMatch()

            // FIXME: Why is reference-equality for
            // `match.route === matchPrev.route` not working?
            const isSameRoute =
                match?.route.patterns[0] === matchPrev?.route.patterns[0]

            if (isSameRoute &&
                ev.data?.noReload &&
                match?.route.acceptsNoReload)
            {
                console.log("Router.onNavigation without transition")
                setRouteProps(match)
            }
            else
            {
                console.log("Router.onNavigation transition start")
                
                await transitionStart(() => {
                    setRouteProps(match)
                    setRouteMatch(match)
                })

                console.log("Router.onNavigation transition ended")

                window.requestAnimationFrame(() => {
                    const scrollY = Framework.historyGetScroll()
                    window.scrollTo({ top: scrollY, behavior: "instant" })
                })
            }
        }

        window.addEventListener("popstate", onNavigation)
        window.addEventListener(Framework.historyPushStateEvent, onNavigation)
        window.addEventListener(Framework.historyPushStateNoReloadEvent, onNavigation)
        window.addEventListener(Framework.historyReloadStateEvent, onNavigation)
        
        Solid.onCleanup(() => {
            window.removeEventListener("popstate", onNavigation)
            window.removeEventListener(Framework.historyPushStateEvent, onNavigation)
            window.removeEventListener(Framework.historyPushStateNoReloadEvent, onNavigation)
            window.removeEventListener(Framework.historyReloadStateEvent, onNavigation)
        })
        
        onNavigation(new Event(Framework.historyPushStateEvent) as Framework.HistoryEvent)
    })


    Solid.onMount(() => {
        const onScroll = () => {
            if (pending())
                return

            if (window.requestIdleCallback)
                window.requestIdleCallback(Framework.historyUpdateScroll)
            else
                Framework.historyUpdateScroll()
        }

        window.addEventListener("scroll", onScroll)

        Solid.onCleanup(() => {
            window.removeEventListener("scroll", onScroll)
        })
    })

    return <>
        <Solid.Show when={ pending() }>
            <Framework.RouterTransition
                firstLoad={ routeProps() === null }
            />
        </Solid.Show>

        <Solid.Show when={ !pending() }>
            <Framework.RouterTransitionEnd/>
        </Solid.Show>

        <Solid.ErrorBoundary fallback={ (err: Error) => {
            setHasErrored(true)

            const cause = (err.cause as any) ?? {}
            const message =
                cause.statusCode && cause.statusMessage ?
                    `HTTP ${ cause.statusCode.toString() } — ${ cause.statusMessage }` :
                    `${ err }`

            Framework.Analytics.exception(message)
            
            return <Framework.Error message={ message }/>
        }}>

            <Solid.Suspense>
                <div inert={ pending() ? true : undefined }>
                    <RouterInner
                        routeProps={ routeProps }
                        routeMatch={ routeMatch }
                    />
                </div>
            </Solid.Suspense>
        </Solid.ErrorBoundary>
    </>
}


export function RouterInner(props: {
    routeProps: Solid.Accessor<Framework.RouteMatch | null>,
    routeMatch: Solid.Accessor<Framework.RouteMatch | null>,
})
{
    const [pageFn] = Solid.createResource(
        props.routeMatch,
        async (pageLoad) => {
            console.log("%cRouter.fetchPage start", "color:orange;", pageLoad)

            const load = 
                props.routeMatch()?.route.load ??
                (async () => () => null)

            await Framework.waitMs(debugFetchDelayMs)

            const pageFn = await load()
            console.log("%cRouter.fetchPage ended", "color:orange;")

            // Return it wrapped in a closure to ensure
            // reference-inequality.
            return () => pageFn
        })


    const [page, setPage] = Solid.createSignal<Solid.JSX.Element>(null)

    Solid.createComputed((prev) => {
        const current = pageFn()

        if (prev === current)
            return
        
        const PageFn = current?.()

        if (PageFn !== undefined)
        {
            console.log(
                `%c${ PageFn.name }`,
                "color: white; background-color: blue;",
                "rendered", props.routeMatch())
            setPage(<PageFn routeMatch={ props.routeProps }/>)
        }

        return current
    })

    
    return <>
        { page() }
    </>
}