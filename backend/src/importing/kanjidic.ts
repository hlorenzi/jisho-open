import * as Db from "../db/index.ts"
import * as File from "./file.ts"
import * as Xml from "./xml.ts"
import * as KanjidicRaw from "./kanjidic_raw.ts"
import * as Gatherer from "./gatherer.ts"
import * as Api from "common/api/index.ts"
import * as KanjiStructCat from "../data/kanji_structural_category.ts"


export const url = "http://www.edrdg.org/kanjidic/kanjidic2.xml.gz"
export const gzipFilename = File.downloadFolder + "kanjidic2.gz"
export const xmlFilename = File.downloadFolder + "kanjidic2.xml"


export async function downloadAndImport(
    db: Db.Db,
    useCachedFiles: boolean)
{
    await File.download(
        url,
        gzipFilename,
        useCachedFiles)
    
    await File.extractGzip(
        gzipFilename,
        xmlFilename,
        useCachedFiles)

    const entryIterator = Xml.iterateEntriesStreamed<KanjidicRaw.Entry>(
        xmlFilename,
        "kanjidic2",
        "character")

    const gatherer = new Gatherer.Gatherer(
        25,
        (items: Api.Kanji.Entry[]) => db.importKanjiEntries(items))
    
    for await (const rawEntry of entryIterator)
    {
        try
        {
            const apiEntry = normalizeEntry(rawEntry)
            await gatherer.push(apiEntry)
        }
        catch (e: any)
        {
            throw `error normalizing kanji entry ${ rawEntry.literal[0] }: ${ e }`
        }
    }

    await gatherer.finish()
    
    for await (const rawEntry of entryIterator)
    {
        try
        {
            const apiEntry = normalizeEntry(rawEntry)
            //console.dir(rawEntry, { depth: null })
            //console.dir(apiEntry, { depth: null })
        }
        catch (e: any)
        {
            throw `error normalizing kanji entry ${ rawEntry.literal[0] }: ${ e }`
        }
    }
}


function normalizeEntry(
    raw: KanjidicRaw.Entry)
    : Api.Kanji.Entry
{
    const entry: Api.Kanji.Entry = {
        id: raw.literal[0],
        tags: [],

        strokeCount: parseInt(raw.misc[0].stroke_count[0]),

        meanings: [],
        kunyomi: [],
        onyomi: [],
    }


    // Import alternative stroke-counts
    if (raw.misc[0].stroke_count.length > 1)
        entry.strokeCounts = raw.misc[0].stroke_count.slice(1).map(s => parseInt(s))


    // Import jouyou level
    const jouyou = raw.misc[0].grade?.[0]
    if (jouyou)
        entry.jouyou = parseInt(jouyou)


    // Import JLPT level
    const jlpt = raw.misc[0].jlpt?.[0]
    if (jlpt)
        entry.jlpt = parseInt(jlpt)


    // Import frequency in news
    const freqNews = raw.misc[0].freq?.[0]
    if (freqNews)
        entry.freqNews = parseInt(freqNews)


    // Import readings, meanings
    const readingMeaning = raw.reading_meaning?.[0]
    if (readingMeaning)
    {
        if (readingMeaning.rmgroup.length !== 1)
            throw "multiple rmgroup"


        // Import kun'yomi, on'yomi
        const normalizeReading = (r: string) => r.replace(/-/g, "～")

        const readingEntries = readingMeaning.rmgroup[0].reading
        if (readingEntries)
        {
            for (const reading of readingEntries)
            {
                switch (reading.attr.r_type)
                {
                    case "ja_on":
                        entry.onyomi.push({
                            text: normalizeReading(reading.text),
                        })
                        break

                    case "ja_kun":
                        entry.kunyomi.push({
                            text: normalizeReading(reading.text),
                        })
                        break
                }
            }
        }


        // Import nanori
        if (readingMeaning.nanori)
        {
            entry.nanori = []

            for (const nanori of readingMeaning.nanori)
            {
                entry.nanori.push(nanori)
            }
        }


        // Import meanings
        const meaningEntries = readingMeaning.rmgroup[0].meaning
        if (meaningEntries)
        {
            for (const meaning of meaningEntries)
            {
                if (typeof meaning !== "string")
                    continue

                entry.meanings.push(meaning)
            }
        }
    }


    // Import structural category
    const structCat = KanjiStructCat.get(entry.id)
    if (structCat !== null)
        entry.structuralCategory = structCat


    // Annotate with tags
    if (entry.jouyou !== undefined)
        entry.tags.push("veryCommon")
    else if (entry.jlpt !== undefined || entry.freqNews !== undefined)
        entry.tags.push("common")


    return entry
}