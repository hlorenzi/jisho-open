import * as Solid from "solid-js"
import { styled } from "solid-styled-components"
import * as Framework from "../index.ts"


export function NavigationButtons()
{
    return <Layout>
        <Framework.ButtonFloating
            label={ <Framework.IconPrev/> }
            onClick={ () => window.history.back() }
        />
        <div/>
        <Framework.ButtonFloating
            label={ <Framework.IconScrollTop/> }
            onClick={ () => window.scrollTo(0, 0) }
        />
        <Framework.ButtonFloating
            label={ <Framework.IconNext/> }
            onClick={ () => window.history.forward() }
        />
    </Layout>
}


const Layout = styled.div`
    display: grid;
    grid-template: auto / auto 1fr auto auto;
    pointer-events: none;

    @media (display-mode: browser)
    {
        display: none;
    }
`