export class BatchDispatcher<T, FnReturn>
{
    items: T[]
    maxCount: number
    flushFn: (items: T[]) => FnReturn


    constructor(
        maxCount: number,
        flushFn: (items: T[]) => FnReturn)
    {
        this.items = []
        this.maxCount = maxCount
        this.flushFn = flushFn
    }


    push(item: T): FnReturn | undefined
    {
        this.items.push(item)

        if (this.items.length >= this.maxCount)
        {
            const flushItems = this.items
            this.items = []
            return this.flushFn(flushItems)
        }

        return undefined
    }


    finish(): FnReturn
    {
        const flushItems = this.items
        this.items = []
        return this.flushFn(flushItems)
    }
}