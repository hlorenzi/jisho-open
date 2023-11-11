import * as Solid from "solid-js"


export function createAsyncSignal<T, U>(
    accessor: Solid.Accessor<T>,
    fetcher: (data: T) => Promise<U>)
{
    type Result<U> = {
        latest: U | undefined,
        loading: boolean,
    }

    const [result, setResult] = Solid.createSignal<Result<U>>({
        latest: undefined,
        loading: false,
    })

    let token = 0

    Solid.createComputed(() => {
        const source = accessor()

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

    return [result]
}