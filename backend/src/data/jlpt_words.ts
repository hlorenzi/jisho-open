import * as fs from "fs"
import * as Api from "common/api/index.ts"


let cache: Map<string, Api.JlptLevel> | null = null
let cacheUsed: Set<string> = new Set()


export function get(
    base: string,
    reading?: string)
    : Api.JlptLevel | undefined
{
    if (!cache)
    {
        const raw = fs.readFileSync(
            "./src/data/jlpt_words.txt",
            { encoding: "utf-8" })

        cache = new Map()
        cacheUsed.clear()

        for (const line of raw.split("\n"))
        {
            if (line.startsWith("#"))
                continue

            const entry = line.trim().split(";")
            const level = parseInt(entry[0]) as Api.JlptLevel
            const base = entry[1]
            const reading = entry[2]

            const key = makeCacheKey(base, reading)
            
            const prevLevel = cache.get(key)
            if (prevLevel !== undefined &&
                prevLevel > level)
                continue

            cache.set(key, level)
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

    cache = null
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