import * as Solid from "solid-js"
import * as Framework from "./index.ts"


export function PageTest()
{
    const [count, setCount] = Solid.createSignal(0)
    const [text, setText] = Solid.createSignal("world")

    const [res] = Solid.createResource(async () => {
        console.log(`load start`)
        await new Promise((r) => window.setTimeout(r, 1000))
        console.log(`load end`)
        return "loaded"
    })

    return <div>

        <h1>Test Page</h1>
        <Framework.Link href="/">
            Go to Home
        </Framework.Link>
        { " " }
        <Framework.Link href="/test">
            Go to Test
        </Framework.Link>
        <br/>
        <br/>
        Count: {count()}
        <button onClick={() => setCount(count() + 1)}>
            Increase
        </button>
        <br/>
        Hello, {text()}!<br/>
        <input
            value={text()}
            onChange={ev => setText(ev.target.value)}/>
        <input
            value={text()}
            onInput={ev => setText(ev.target.value)}/>
        <br/>
        Resource: { res() }
    </div>
}