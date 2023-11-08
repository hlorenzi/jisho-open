import * as Solid from "solid-js"
import { styled } from "solid-styled-components"
import * as Framework from "../framework/index.ts"
import * as Pages from "../pages.ts"


export function Searchbox(props: {
    initialText?: string,
})
{
    const [searchbox, setSearchbox] = Solid.createSignal(props.initialText ?? "")

    const onSearch = () => {
        const text = searchbox()
        if (text.length === 0)
            return
        
        Framework.historyPushNoReload(Pages.Search.urlForQuery(text))
    }

    return <Layout>
        <Framework.InputText
            autofocus
            placeholder="Search in English, Japanese, rōmaji..."
            value={ searchbox }
            onInput={ setSearchbox }
            onEnter={ onSearch }
        />
        <Framework.Button
            title="Clear"
            label={ <Framework.IconX/> }
            onClick={ onSearch }
            style={{ width: "3em" }}
        />
        <Framework.Button
            title="Search"
            label={ <Framework.IconMagnifyingGlass/> }
            onClick={ onSearch }
            style={{ width: "3em" }}
        />
    </Layout>
}


const Layout = styled.div`
    display: grid;
    grid-template: auto / 1fr auto auto;
    margin-bottom: 0.5em;
`