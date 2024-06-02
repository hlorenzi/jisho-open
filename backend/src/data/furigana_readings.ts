import * as fs from "fs"
import * as Kana from "common/kana.ts"


export function normalizeDataFile()
{
    console.log("normalizing furigana_readings.txt...")

    const filename = "./src/data/furigana_readings.txt"
    const file = fs.readFileSync(filename, "utf-8")

    interface Data
    {
        term: string
        kind: string
        readings: string[]
    }

    const validKinds = [
        "kun",
        "on",
        "nanori",
        "spec",
        "chinese",
        "korean",
        "vietnamese",
        "auto",
        "alpha",
        "num",
        "ateji",
        "gikun",
        "fused",
        "conjug",
        "patch",
        "mistaken",
    ]

    const entries = new Map<string, Data>()
    for (const line of file.split("\n"))
    {
        if (line.startsWith("#"))
            continue

        const entry = line.trim().split(";")
        if (entry.length < 3)
            throw `invalid furigana_readings entry: ${line}`

        const term = entry[0]

        const kind = entry[1]
        if (!validKinds.some(k => k === kind))
            throw `invalid furigana_readings entry kind: ${line}`

        let readings = entry.slice(2)
        if (kind === "on" ||
            kind === "chinese" ||
            kind === "korean" ||
            kind === "vietnamese" ||
            kind === "alpha" ||
            kind === "ateji")
            readings = readings.map(r => Kana.toKatakana(r))

        const key = term + ";" + kind
        const data = entries.get(key) ?? {
            term,
            kind,
            readings: [],
        }
        data.readings.push(...readings)
        entries.set(key, data)
    }

    const entriesArray = [...entries.values()]
    entriesArray.sort((a, b) => {
        if (a.kind !== b.kind)
            return a.kind.localeCompare(b.kind)

        return a.term.localeCompare(b.term)
    })

    let result = "# kanji or term; reading type; readings..."

    for (const entry of entriesArray)
    {
        if (result.length !== 0)
            result += "\n"

        entry.readings.sort((a, b) => a.localeCompare(b))

        result += entry.term + ";" +
            entry.kind + ";" +
            [...new Set<string>(entry.readings)].join(";")
    }

    fs.writeFileSync(filename, result)
    console.log("done")
}