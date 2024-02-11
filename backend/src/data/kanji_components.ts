import * as fs from "fs"


let cache: Map<string, string[]> | null = null
let cacheUsed: Set<string> = new Set()


export function get(
    kanji: string)
    : string[]
{
    if (!cache)
    {
        const raw = fs.readFileSync(
            "./src/data/kanji_components.txt",
            { encoding: "utf-8" })

        cache = new Map()
        cacheUsed.clear()

        for (const line of raw.split("\n"))
        {
            if (line.startsWith("#"))
                continue

            const entry = line.trim().split(";")
            if (entry.length !== 2)
                throw `invalid kanji_components entry: ${line}`

            const kanji = entry[0]
            const components = [...entry[1]]
            cache.set(kanji, components)
        }
    }

    cacheUsed.add(kanji)

    return cache.get(kanji) ?? []
}


export function clearCache()
{
    for (const e of cache?.keys() ?? [])
    {
        if (!cacheUsed.has(e))
            console.error("kanji_components unused: " + e)
    }

    cache = null
    cacheUsed.clear()
}