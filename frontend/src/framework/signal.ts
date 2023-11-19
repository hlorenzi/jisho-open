import * as Solid from "solid-js"


export type AsyncSignalResult<U> = {
    latest: U | undefined,
    loading: boolean,
}


export function createAsyncSignal<T, U>(
    accessor: Solid.Accessor<T>,
    fetcher: (data: T) => Promise<U>)
    : Solid.Accessor<AsyncSignalResult<U>>;


export function createAsyncSignal<T, U>(
    accessor: null,
    fetcher: (data: null) => Promise<U>)
    : Solid.Accessor<AsyncSignalResult<U>>;


export function createAsyncSignal<T, U>(
    accessor: Solid.Accessor<T> | null,
    fetcher: (data: T | null) => Promise<U>)
    : Solid.Accessor<AsyncSignalResult<U>>
{

    const [result, setResult] = Solid.createSignal<AsyncSignalResult<U>>({
        latest: undefined,
        loading: false,
    })

    let accessorInternal = accessor || Solid.createSignal(null)[0]

    let token = 0

    Solid.createComputed(() => {
        const source = accessorInternal()

        token++
        const myToken = token
            
        setResult(r => ({
            ...r,
            loading: true,
        }))

        const runFetcher = async () => {
            const fetched = await fetcher(source)
            if (myToken !== token)
                return
            
            setResult({
                latest: fetched,
                loading: false,
            })
        }
        
        runFetcher()
        return source
    })

    return result
}