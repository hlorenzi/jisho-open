import * as fs from "fs"
import * as Kana from "common/kana.ts"


let cache: Map<string, number> | null = null
let cacheUsed: Set<string> = new Set()


export function get(
    base: string)
    : number | undefined
{
    if (!cache)
    {
        const raw = fs.readFileSync(
            "./src/data/animedrama_ranking.txt",
            { encoding: "utf-8" })

        cache = new Map()
        cacheUsed.clear()

        let ranking = 1
        for (const line of raw.split("\n"))
        {
            if (line.startsWith("#"))
                continue

            // FIXME: Kana-only words cause lots of ambiguity
            const entry = line.trim()
            cache.set(entry, ranking)
            ranking++
        }
    }

    cacheUsed.add(base)
    return cache.get(base)
}


export function clearCache()
{
    for (const e of cache?.keys() ?? [])
    {
        if (!cacheUsed.has(e))
            console.error("animedrama_ranking unused: " + e)
    }

    cache = null
    cacheUsed.clear()
}