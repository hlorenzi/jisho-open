import * as Solid from "solid-js"
import * as Framework from "../framework/index.ts"
import * as Pages from "../pages.ts"


export function Searchbox(props: {
    initialText?: string,
})
{
    const [searchbox, setSearchbox] = Solid.createSignal(props.initialText ?? "")

    const onSearch = async () => {
        const text = searchbox()
        if (text.length === 0)
            return
        
        Framework.historyPushNoReload(Pages.Search.urlForQuery(text))
    }

    return <div>
        <input
            type="text"
            autofocus
            value={ searchbox() }
            onInput={ ev => setSearchbox(ev.target.value) }
            onKeyDown={ ev => { if (ev.key === "Enter") onSearch() }}/>
        <button onClick={ onSearch }>
            Search
        </button>
    </div>
}