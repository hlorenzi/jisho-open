import * as fs from "fs"
import * as Db from "../db/index.ts"
import * as Logging from "./logging.ts"
import * as Furigana from "common/furigana.ts"


export async function outputFurigana(
    logger: Logging.Logger,
    db: Db.Interface)
{
    logger.writeLn("outputting furigana...")

    const furiganaSet = new Set<string>()
    for await (const entry of db.streamAllWords())
    {
        for (const heading of entry.headings)
        {
            if (heading.searchOnlyKana ||
                heading.searchOnlyKanji)
                continue
            
            const furigana = Furigana.decode(heading.furigana)
            if (furigana.length <= 1)
                continue

            furiganaSet.add(
                entry.id.substring(1) + ";" +
                Furigana.encodeFull(furigana))
        }
    }

    furiganaSet.add("9990000;露.恋.対;ロ.レン.ズィ")

    const furiganaList = [...furiganaSet]
        .sort((a, b) => a.localeCompare(b))

    const result =
        "# Lorenzi's Jisho - Furigana Segmentation Data\n" +
        "# Generated: " + (new Date().toISOString()) + "\n" +
        furiganaList.join("\n")
    
    const filename = "furigana.txt"
    fs.writeFileSync(filename, result)
    logger.writeLn(`wrote ${filename}`)
}