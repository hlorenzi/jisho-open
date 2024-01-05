import * as fs from "fs"
import * as Kana from "common/kana.ts"


type CacheValue = {
    wordId?: string
    ranking: number
}

let cacheAnimeDrama: Map<string, CacheValue> | null = null
let cacheAnimeDramaUsed: Set<string> = new Set()

let cacheWikipedia: Map<string, CacheValue> | null = null
let cacheWikipediaUsed: Set<string> = new Set()


export function getAnimeDrama(
    wordId: string,
    base: string)
    : number | undefined
{
    return get(
        "./src/data/word_rankings_animedrama.txt",
        cacheAnimeDrama,
        cacheAnimeDramaUsed,
        (cache) => cacheAnimeDrama = cache,
        wordId,
        base)
}


export function getWikipedia(
    wordId: string,
    base: string)
    : number | undefined
{
    return get(
        "./src/data/word_rankings_wikipedia.txt",
        cacheWikipedia,
        cacheWikipediaUsed,
        (cache) => cacheWikipedia = cache,
        wordId,
        base)
}


export function get(
    filename: string,
    cache: Map<string, CacheValue> | null,
    cacheUsed: Set<string>,
    setCache: (cache: Map<string, CacheValue>) => void,
    wordId: string,
    base: string)
    : number | undefined
{
    if (!cache)
    {
        const raw = fs.readFileSync(
            filename,
            { encoding: "utf-8" })

        cache = new Map()

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

        setCache(cache)
        cacheUsed.clear()
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
    for (const e of cacheAnimeDrama?.keys() ?? [])
    {
        if (!cacheAnimeDramaUsed.has(e))
            console.error("word_rankings_animedrama unused: " + e)
    }

    for (const e of cacheWikipedia?.keys() ?? [])
    {
        if (!cacheWikipediaUsed.has(e))
            console.error("word_rankings_wikipedia unused: " + e)
    }

    cacheAnimeDrama = null
    cacheAnimeDramaUsed.clear()
    
    cacheWikipedia = null
    cacheWikipediaUsed.clear()
}