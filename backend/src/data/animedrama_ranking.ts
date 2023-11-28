import * as fs from "fs"
import * as Kana from "common/kana.ts"


type CacheValue = {
    wordId?: string
    ranking: number
}

let cache: Map<string, CacheValue> | null = null
let cacheUsed: Set<string> = new Set()


export function get(
    wordId: string,
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
            const entry = line.trim().split(";")
            const term = entry[0]
            const wordId = entry[1] ?? undefined
            cache.set(term, {
                wordId,
                ranking,
            })
            ranking++
        }
    }

    cacheUsed.add(base)
    const value = cache.get(base)
    if (value === undefined)
        return undefined

    if (value.wordId !== undefined &&
        value.wordId !== wordId)
        return undefined

    return value.ranking
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