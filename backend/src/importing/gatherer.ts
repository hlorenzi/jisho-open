export class Gatherer<T, FnReturn>
{
    items: T[]
    maxCount: number
    flushFn: (items: T[]) => FnReturn | undefined


    constructor(
        maxCount: number,
        flushFn: (items: T[]) => FnReturn | undefined)
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
    }


    finish(): FnReturn | undefined
    {
        const flushItems = this.items
        this.items = []
        return this.flushFn(flushItems)
    }
}