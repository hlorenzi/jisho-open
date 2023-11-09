import * as fs from "fs"
import * as Kana from "common/kana.ts"


let cache: Map<string, string[]> | null = null
let cacheUsed: Set<string> = new Set()


export function get(
    base: string,
    reading?: string)
    : string[]
{
    if (!cache)
    {
        const raw = fs.readFileSync(
            "./src/data/pitch_accent.txt",
            { encoding: "utf-8" })

        cache = new Map()
        cacheUsed.clear()

        for (const line of raw.split("\n"))
        {
            if (line.startsWith("#"))
                continue

            const entry = line.trim().split(";")
            if (entry.length < 3)
                throw `invalid pitch_accent entry: ${line}`

            const source = entry[0]
            const base = entry[1]
            const pitch = entry[2]

            const key = makeCacheKey(
                base,
                Kana.hasKatakana(base) ?
                    undefined :
                    pitch.replace(/\ꜛ|\ꜜ|\*|\~/g, ""))
            
            const list = cache.get(key) ?? []
            list.push(
                Kana.isKatakana(base) ?
                    Kana.toKatakana(pitch) :                
                    pitch)
            cache.set(key, list)
        }
    }

    const key = makeCacheKey(base, reading)
    cacheUsed.add(key)

    return cache.get(key) ?? []
}


export function clearCache()
{
    for (const e of cache?.keys() ?? [])
    {
        if (!cacheUsed.has(e))
            console.error("pitch_accent unused: " + e)
    }

    cache = null
    cacheUsed.clear()
}


function makeCacheKey(
    base: string,
    pitch?: string)
    : string
{
    if (pitch === undefined ||
        pitch.length === 0 ||
        pitch === base)
        return base

    return `${base};${pitch}`
}