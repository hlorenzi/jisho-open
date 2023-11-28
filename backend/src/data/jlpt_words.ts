import * as fs from "fs"
import * as Api from "common/api/index.ts"
import * as Kana from "common/kana.ts"


type CacheValue = {
    tags: string[]
    level: Api.JlptLevel
}

let cache: Map<string, CacheValue> | null = null
let cacheUsed: Set<string> = new Set()


export function get(
    wordId: string,
    headings: Api.Word.Heading[],
    forHeadingIndex: number)
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
            const tags = entry.slice(3) ?? []

            const key = makeCacheKey(base, reading)
            
            const prevValue = cache.get(key)
            if (prevValue !== undefined &&
                prevValue.level > level)
                continue

            cache.set(key, {
                level,
                tags,
            })
        }
    }

    const forHeading = headings[forHeadingIndex]

    if (forHeading.reading !== undefined)
    {
        const key = makeCacheKey(
            forHeading.base,
            forHeading.reading)
        
        cacheUsed.add(key)
        const value = cache.get(key)
        if (!value)
            return undefined

        if (value.tags.length >= 1 &&
            value.tags[0] === "uk")
            return undefined

        if (value.tags.length >= 1 &&
            value.tags[0].startsWith("w") &&
            value.tags[0] !== wordId)
            return undefined            
        
        return value.level
    }

    for (const heading of headings)
    {
        const key = makeCacheKey(heading.base, heading.reading)
        cacheUsed.add(key)

        const value = cache.get(key)
        if (value)
        {
            if (value.tags.length >= 1 &&
                value.tags[0] === "uk" &&
                (forHeading.reading !== undefined ||
                    forHeading.base !== heading.reading))
                continue

            if (value.tags.length >= 1 &&
                value.tags[0].startsWith("w") &&
                value.tags[0] !== wordId)
                continue
            
            return value.level
        }
    }

    return undefined
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