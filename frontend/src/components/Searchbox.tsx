import * as Solid from "solid-js"
import * as Framework from "../framework/index.ts"


export function Searchbox(props: {
    initialText?: string,
})
{
    const [searchbox, setSearchbox] = Solid.createSignal(props.initialText ?? "はし")

    const onSearch = async () => {
        Framework.historyPush(`/search/${ searchbox() }`)
    }

    return <div>
        <input
            type="text"
            value={ searchbox() }
            onInput={ ev => setSearchbox(ev.target.value) }
            onKeyDown={ ev => { if (ev.key === "Enter") onSearch() }}/>
        <button onClick={ onSearch }>
            Search
        </button>
    </div>
}