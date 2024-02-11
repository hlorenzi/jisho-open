import * as fs from "fs"
import * as Api from "common/api/index.ts"
import * as Kana from "common/kana.ts"


let cache: Map<string, string> | null = null
let cacheUsed: Set<string> = new Set()


export function get(
    kanji: string)
    : Api.Kanji.DescriptionSequence | undefined
{
    if (!cache)
    {
        const raw = fs.readFileSync(
            "./src/data/kanji_description_sequences.txt",
            { encoding: "utf-8" })

        cache = new Map()
        cacheUsed.clear()

        for (const line of raw.split("\n"))
        {
            if (line.startsWith("#"))
                continue

            const entry = line.trim().split(";")
            if (entry.length !== 2)
                throw `invalid kanji_description_sequences entry: ${line}`

            const kanji = entry[0]
            const descrSeq = entry[1]
            cache.set(kanji, descrSeq)
        }
    }

    cacheUsed.add(kanji)

    return expandDescrSeq(kanji)
}


export function clearCache()
{
    /*for (const e of cache?.keys() ?? [])
    {
        if (!cacheUsed.has(e))
            console.error("kanji_description_sequences unused: " + e)
    }*/

    cache = null
    cacheUsed.clear()
}


function expandDescrSeq(
    kanji: string)
    : [string, Api.Kanji.DescriptionSequence[]] | undefined
{
    if (cache === null)
        return undefined

    const descrSeq = cache.get(kanji)
    if (descrSeq === undefined ||
        descrSeq === kanji)
        return undefined

    const result: [string, Api.Kanji.DescriptionSequence[]] = [kanji, []]
    for (const c of descrSeq)
    {
        result[1].push(expandDescrSeq(c) ?? c)
    }

    return result
}


export function extractComponents(
    descrSeq: Api.Kanji.DescriptionSequence)
    : string[]
{
    if (typeof descrSeq === "string")
    {
        if (Kana.isKanji(descrSeq))
            return [descrSeq]

        return []
    }

    const result: string[] = [descrSeq[0]]
    for (const inner of descrSeq[1])
        result.push(...extractComponents(inner))

    return result
}