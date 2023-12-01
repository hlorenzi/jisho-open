import * as fs from "fs"
import * as Api from "common/api/index.ts"


type CacheValue = {
    wordId?: string
    extraTags: Api.Word.PartOfSpeechTag[]
}

let cache: Map<string, CacheValue> | null = null
let cacheUsed: Set<string> = new Set()


export function get(
    wordId: string,
    headings: string[])
    : Api.Word.PartOfSpeechTag[]
{
    if (!cache)
    {
        const raw = fs.readFileSync(
            "./src/data/jmdict_extra_tags.txt",
            { encoding: "utf-8" })

        cache = new Map()
        cacheUsed.clear()

        for (const line of raw.split("\n"))
        {
            if (line.startsWith("#"))
                continue

            const entry = line.trim().split(";")
            const wordId = entry[0] || undefined
            const term = entry[1]
            const extraTags = entry.slice(2)
            cache.set(term, {
                wordId,
                extraTags: extraTags as Api.Word.PartOfSpeechTag[],
            })
        }
    }

    for (const heading of headings)
    {
        cacheUsed.add(heading)
        const value = cache.get(heading)
        if (value === undefined)
            continue

        if (value.wordId !== undefined &&
            value.wordId !== wordId)
            continue

        return value.extraTags
    }
    
    return []
}


export function clearCache()
{
    for (const e of cache?.keys() ?? [])
    {
        if (!cacheUsed.has(e))
            console.error("jmdict_extra_tags unused: " + e)
    }

    cache = null
    cacheUsed.clear()
}