import * as fs from "fs"
import * as MongoDb from "../db/mongodb/index.ts"
import * as Furigana from "common/furigana.ts"
import * as Kana from "common/kana.ts"


console.log("analyzing furigana...")

const client = (await MongoDb.connect()).client
const db = client.db("jisho2")
const collWords = db.collection("words")


const furiganaList: Furigana.Furigana[] = []
for await (const entry of collWords.find<MongoDb.DbWordEntry>({}).stream())
{
    if (entry.lookUp.tags.some(t => t === "name"))
        continue

    for (const heading of entry.headings)
    {
        if (heading.searchOnlyKana ||
            heading.searchOnlyKanji)
            continue
        
        const furigana = Furigana.decode(heading.furigana)
        furiganaList.push(furigana)
    }
}

const longestSegment = (furigana: Furigana.Furigana) =>
    furigana.reduce(
        (accum, seg) => Math.max(
            accum,
            [...seg[0]].filter(c => Kana.isKanjiOrIterationMark(c)).length),
        0)

furiganaList.sort((a, b) => longestSegment(b) - longestSegment(a))

const result =
    "Longest furigana segments:\n" +
    furiganaList
        .map(f => longestSegment(f) + ": " + Furigana.encodeFull(f))
        .join("\n")

const filename = "furigana_analysis.txt"
fs.writeFileSync(filename, result)
console.log(`wrote ${filename}`)
process.exit(0)