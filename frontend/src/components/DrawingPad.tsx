import * as Solid from "solid-js"
import { styled } from "solid-styled-components"
import * as Framework from "../framework/index.ts"
import * as App from "../app.tsx"


export function DrawingPad(props: {
    style?: Solid.JSX.CSSProperties,
    insert?: (text: string) => void,
})
{
    let canvasRef: HTMLCanvasElement = undefined!

    const [working, setWorking] = Solid.createSignal(false)
    const [results, setResults] = Solid.createSignal<string[]>([])

    const state: DrawingState = {
        penDown: false,
        strokes: [],
    }

    let queryTimeout: number | undefined = undefined

    const onClear = () => {
        clearTimeout(queryTimeout)
        const ctx = canvasRef.getContext("2d")!
        canvasPenClear(state)
        canvasDraw(state, ctx)
        setResults([])
    }

    let queryResponseToken = 0
    const query = async () => {
        clearTimeout(queryTimeout)

        queryResponseToken += 1
        const myToken = queryResponseToken

        queryTimeout = window.setTimeout(async () => {
            if (state.strokes.length === 0)
            {
                setResults([])
                return
            }

            const queryStrokes: App.Api.HandwritingGet.Request["strokes"] = []
            for (const stroke of state.strokes)
            {
                const xArray: number[] = []
                const yArray: number[] = []
                const timeArray: number[] = []
                for (const p of stroke)
                {
                    xArray.push(p.x)
                    yArray.push(p.y)
                    timeArray.push(p.time)
                }
                queryStrokes.push([xArray, yArray, timeArray])
            }

            setWorking(true)
            try
            {
                const queryResult = await App.Api.handwritingGet({ strokes: queryStrokes })

                if (myToken === queryResponseToken)
                    setResults(queryResult.results)
            }
            finally
            {
                setWorking(false)
            }
        
        }, 600)
    }

    Solid.onMount(() => {
        const ctx = canvasRef.getContext("2d")!
        canvasDraw(state, ctx)

        const transformMouse = (xRaw: number, yRaw: number) => {
            const rect = canvasRef.getBoundingClientRect()
            const x = (xRaw - rect.x) / rect.width
            const y = (yRaw - rect.y) / rect.height
            return { x, y }
        }

        const onMouseDown = (ev: MouseEvent) => {
            ev.preventDefault()
            ev.stopPropagation()
            clearTimeout(queryTimeout)
            const pos = transformMouse(ev.clientX, ev.clientY)
            canvasPenDown(state, pos.x, pos.y)
            canvasDraw(state, ctx)
        }

        const onMouseMove = (ev: MouseEvent) => {
            if (!state.penDown)
                return

            ev.preventDefault()
            ev.stopPropagation()
            clearTimeout(queryTimeout)
            const pos = transformMouse(ev.clientX, ev.clientY)
            canvasPenMove(state, pos.x, pos.y)
            canvasDraw(state, ctx)
        }

        const onMouseUp = (ev: MouseEvent) => {
            if (!state.penDown)
                return

            ev.preventDefault()
            ev.stopPropagation()
            const pos = transformMouse(ev.clientX, ev.clientY)
            canvasPenMove(state, pos.x, pos.y)
            canvasPenUp(state)
            canvasDraw(state, ctx)
            query()
        }

        const onTouchStart = (ev: TouchEvent) => {
            ev.preventDefault()
            ev.stopPropagation()
            clearTimeout(queryTimeout)
            const pos = transformMouse(ev.touches[0].clientX, ev.touches[0].clientY)
            canvasPenDown(state, pos.x, pos.y)
            canvasDraw(state, ctx)
        }

        const onTouchMove = (ev: TouchEvent) => {
            if (!state.penDown)
                return

            ev.preventDefault()
            ev.stopPropagation()
            clearTimeout(queryTimeout)
            const pos = transformMouse(ev.touches[0].clientX, ev.touches[0].clientY)
            canvasPenMove(state, pos.x, pos.y)
            canvasDraw(state, ctx)
        }

        const onTouchEnd = (ev: TouchEvent) => {
            if (!state.penDown)
                return

            ev.preventDefault()
            ev.stopPropagation()
            canvasPenUp(state)
            canvasDraw(state, ctx)
            query()
        }

        canvasRef.addEventListener("mousedown", onMouseDown)
        document.addEventListener("mousemove", onMouseMove)
        document.addEventListener("mouseup", onMouseUp)
        canvasRef.addEventListener("touchstart", onTouchStart);
        document.addEventListener("touchmove", onTouchMove);
        document.addEventListener("touchend", onTouchEnd);
        document.addEventListener("touchcancel", onTouchEnd);

        Solid.onCleanup(() => {
            canvasRef.removeEventListener("mousedown", onMouseDown)
            document.removeEventListener("mousemove", onMouseMove)
            document.removeEventListener("mouseup", onMouseUp)
            canvasRef.removeEventListener("touchstart", onTouchStart);
            document.removeEventListener("touchmove", onTouchMove);
            document.removeEventListener("touchend", onTouchEnd);
            document.removeEventListener("touchcancel", onTouchEnd);
        })
    })

    return <Layout>
        <LayoutCanvas>
            <Solid.Show when={working()}>
                <Framework.LoadingBar ignoreLayout/>
            </Solid.Show>

            <Canvas
                ref={ canvasRef }
            />
        </LayoutCanvas>

        <LayoutButtons>
            <Framework.Button
                icon={ <Framework.IconTrash/> }
                noPadding
                onClick={ onClear }
                style={{
                    margin: "0",
                    width: "100%",
                    height: "100%",
                }}
            />
            <Solid.For each={ [0, 1, 2, 3, 4] }>
            { (resultIndex) =>
                <Framework.Button
                    label={ results()[resultIndex] ?? "" }
                    disabled={ !results()[resultIndex] }
                    noPadding
                    onClick={ () => {
                        props.insert?.(results()[resultIndex] ?? "")
                        onClear()
                        App.analyticsEvent("searchInsertHandwriting")
                    }}
                    style={{
                        margin: "0",
                        width: "100%",
                        height: "100%",
                    }}
                />
            }
            </Solid.For>
        </LayoutButtons>
    </Layout>
}


interface DrawingState
{
    penDown: boolean
    startTime?: number
    strokes: StrokePoint[][]
}


interface StrokePoint
{
    x: number
    y: number
    time: number
}


function currentTime(): number
{
    return Date.now()
}


function canvasSetSize(
    ctx: CanvasRenderingContext2D)
{
    const canvas = ctx.canvas
    const rect = canvas.getBoundingClientRect()
    const deviceRatio = window.devicePixelRatio ?? 1

    canvas.width = rect.width * deviceRatio
    canvas.height = rect.height * deviceRatio
}


function canvasDraw(
    state: DrawingState,
    ctx: CanvasRenderingContext2D)
{
    canvasSetSize(ctx)

    const w = ctx.canvas.width
    const h = ctx.canvas.height
    ctx.clearRect(0, 0, w, h)

    const style = getComputedStyle(ctx.canvas)
    const widthMult = w / 160

    ctx.strokeStyle = style.getPropertyValue("--theme-textColor")
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.lineWidth = widthMult * 4

    for (const stroke of state.strokes)
    {
        if (stroke.length === 0)
            continue

        ctx.beginPath()
        ctx.moveTo(stroke[0].x * w, stroke[0].y * h)
        for (let i = 1; i < stroke.length - 1; i++)
        {
            ctx.lineTo(stroke[i].x * w, stroke[i].y * h)
        }
        ctx.stroke()
    }
    
    /*
    // Draw with lines weighted by distance
    for (const stroke of state.strokes)
    {
        for (let i = 0; i < stroke.length - 1; i++)
        {
            const p0 = stroke[i + 0]
            const p1 = stroke[i + 1]
            const xx = p1.x - p0.x
            const yy = p1.y - p0.y
            const dist = Math.sqrt(xx * xx + yy * yy) * 400
            ctx.beginPath()
            ctx.lineWidth = widthMult * Math.max(2, Math.min(5, 40 / Math.pow(dist, 0.65)))
            ctx.moveTo(p0.x * w, p0.y * h)
            ctx.lineTo(p1.x * w, p1.y * h)
            ctx.stroke()
        }
    }
    */

    if (state.strokes.length === 0)
    {
        const size = (window.devicePixelRatio ?? 1) * 24
        ctx.font = `${size}px Lexend Deca`
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillStyle = style.getPropertyValue("--theme-text4thColor")
        ctx.fillText("Draw here", w / 2, h / 2)
    }
}


function canvasPenClear(
    state: DrawingState)
{
    state.startTime = undefined
    state.strokes = []
}


function canvasPenDown(
    state: DrawingState,
    x: number,
    y: number)
{
    state.penDown = true
    
    if (state.startTime === undefined)
        state.startTime = currentTime()

    const time = currentTime() - state.startTime
    state.strokes.push([{ x, y, time }])
}


function canvasPenMove(
    state: DrawingState,
    x: number,
    y: number)
{
    if (!state.penDown ||
        state.startTime === undefined ||
        state.strokes.length < 1)
        return

    const time = currentTime() - state.startTime
    state.strokes[state.strokes.length - 1].push({ x, y, time })
}


function canvasPenUp(
    state: DrawingState)
{
    state.penDown = false
}


const Layout = styled.div`
    margin-top: 0.5em;
    margin-bottom: 0.5em;
    display: grid;
    grid-template: auto / 10fr 3fr;
    width: min(100%, 25em);
    column-gap: 0.5em;
    justify-self: center;
    justify-content: center;
    justify-items: center;
    align-content: center;
    align-items: center;
`

const LayoutButtons = styled.div`
    display: grid;
    grid-template: repeat(6, 1fr) / 1fr;
    row-gap: 0.15em;
    justify-self: stretch;
    justify-content: stretch;
    justify-items: stretch;
    align-self: stretch;
    align-content: stretch;
    align-items: stretch;
`

const LayoutCanvas = styled.div`
    width: 100%;
    height: 100%;
    aspect-ratio: 1;
    overflow-x: hidden;
    overflow-y: hidden;
    contain: size;
    box-sizing: border-box;
    border: 1px solid ${ Framework.themeVar("borderColor") };
    border-radius: ${ Framework.themeVar("borderRadius") };
    touch-action: none;
`

const Canvas = styled.canvas`
    width: 100%;
    height: 100%;
    aspect-ratio: 1;
    touch-action: none;
    cursor: crosshair;
`