import * as fs from "fs"


let cache: Map<string, number> | null = null
let cacheUsed: Set<string> = new Set()


export function get(
    base: string,
    reading?: string)
    : number | undefined
{
    if (!cache)
    {
        const raw = fs.readFileSync("./src/data/jlpt_words.txt", { encoding: "utf-8" })

        cache = new Map()
        cacheUsed.clear()

        for (const line of raw.split("\n"))
        {
            if (line.startsWith("#"))
                continue

            const entry = line.split(";")
            const level = parseInt(entry[0])
            const base = entry[1]
            const reading = entry[2]

            cache.set(makeCacheKey(base, reading), level)
        }
    }

    const key = makeCacheKey(base, reading)
    cacheUsed.add(key)

    return cache.get(key)
}


export function clearCache()
{
    for (const e of cache?.keys() ?? [])
    {
        if (!cacheUsed.has(e))
            console.error("jlpt_words unused: " + e)
    }

    cache?.clear()
    cacheUsed.clear()
}


function makeCacheKey(
    base: string,
    reading?: string)
    : string
{
    if (reading === undefined ||
        reading.length === 0)
        return base

    return `${base};${reading}`
}