import * as fs from "fs"
import * as Furigana from "common/furigana.ts"
import * as Kana from "common/kana.ts"


let cacheReadings: Map<string, string[]> | null = null
let cacheReadingsUsed: Set<string> = new Set()
let cachePatches: Map<string, Furigana.Furigana> | null = null
let cachePatchesUsed: Set<string> = new Set()


export function getReadings(
    kanjiOrTerm: string)
    : string[]
{
    if (!cacheReadings)
    {
        const raw = fs.readFileSync(
            "./src/data/furigana_readings.txt",
            { encoding: "utf-8" })

        cacheReadings = new Map()
        cacheReadingsUsed.clear()

        for (const line of raw.split("\n"))
        {
            if (line.startsWith("#"))
                continue

            const entry = line.trim().split(";")
            if (entry.length < 3)
                throw `invalid furigana_readings entry: ${line}`

            const term = entry[0]
            const kind = entry[1]
            const readings = [
                ...entry.slice(2),
                ...cacheReadings.get(term) ?? []
            ]
            cacheReadings.set(term, readings.map(r => Kana.toHiragana(r)))
        }
    }

    cacheReadingsUsed.add(kanjiOrTerm)

    return cacheReadings.get(kanjiOrTerm) ?? []
}


export function getPatch(
    base: string,
    reading: string)
    : Furigana.Furigana | undefined
{
    if (!cachePatches)
    {
        const raw = fs.readFileSync(
            "./src/data/furigana_patches.txt",
            { encoding: "utf-8" })

        cachePatches = new Map()
        cachePatchesUsed.clear()

        for (const line of raw.split("\n"))
        {
            if (line.startsWith("#"))
                continue

            const entry = line.trim().split(";")
            if (entry.length !== 2)
                throw `invalid furigana_patches entry: ${line}`

            const furiBase = entry[0]
            const furiReading = entry[1]
            const furi = Furigana.decodeFromPartsPure(furiBase, furiReading)

            const termBase = Furigana.extractBase(furi)
            const termReading = Furigana.extractReadingPure(furi)

            const key = makeCacheKey(termBase, termReading)
            cachePatches.set(key, furi)
        }
    }

    const key = makeCacheKey(base, reading)
    cachePatchesUsed.add(key)

    return cachePatches.get(key)
}


export function clearCache()
{
    /*for (const term of cacheReadings?.keys() ?? [])
    {
        if (!cacheReadingsUsed.has(term))
            console.error("furigana_readings unused: " + term)
    }*/

    for (const term of cachePatches?.keys() ?? [])
    {
        if (!cachePatchesUsed.has(term))
            console.error("furigana_patches unused: " + term)
    }

    cacheReadings = null
    cacheReadingsUsed.clear()
    cachePatches = null
    cachePatchesUsed.clear()
}


function makeCacheKey(
    base: string,
    reading: string)
    : string
{
    if (reading === undefined ||
        reading.length === 0)
        return base

    return `${base};${reading}`
}