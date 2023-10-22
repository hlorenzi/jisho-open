import * as Solid from "solid-js"
import * as Styled from "solid-styled-components"
import * as Framework from "../index.ts"


const debugFetchDelayMs = 0


const DivPage = Styled.styled("div")`
    position: absolute;
    top: 0px;
    width: 100%;
`

export function Router(props: {
    routes: Framework.Route[],
})
{
    const [pending, transitionStart] = Solid.useTransition()

    const [routeMatch, setRouteMatch] =
        Solid.createSignal<Framework.RouteMatch | null>(null)


    Solid.onMount(() => {
        console.log("Router.onMount")

        async function onNavigation()
        {
            console.log("Router.onNavigation", window.location.pathname)

            const match = Framework.getMatchForPath(
                props.routes,
                window.location.pathname,
                window.location.search)

            await transitionStart(() => {
                setRouteMatch(match)
            })

            console.log("Router.onNavigation end")
        }

        window.addEventListener("popstate", onNavigation)
        window.addEventListener("lorenzi_pushstate", onNavigation)
        window.addEventListener("lorenzi_reloadstate", onNavigation)
        
        Solid.onCleanup(() => {
            window.removeEventListener("popstate", onNavigation)
            window.removeEventListener("lorenzi_pushstate", onNavigation)
            window.removeEventListener("lorenzi_reloadstate", onNavigation)
        })
        
        onNavigation()
    })


    const [page] = Solid.createResource(
        routeMatch,
        async (routeMatch: Framework.RouteMatch) => {
            console.log("Router.fetchPage", routeMatch.route)

            const pageLoad = 
                routeMatch?.route.load ??
                (async () => () => null)

            await Framework.waitMs(debugFetchDelayMs)

            return await pageLoad()
        })

    
    Solid.createEffect(() => {
        page()
        console.log("Router.pending", pending())
        console.log("Router.pageState", page.state)
    })


    return <>
        <Solid.Show when={ pending() }>
            <Framework.RouterTransition/>
        </Solid.Show>
        
        <DivPage inert={ pending() ? true : undefined }>
            <Solid.Suspense fallback={ null }>
                { page()?.() }
            </Solid.Suspense>
        </DivPage>
    </>
}