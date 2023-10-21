import * as Db from "../db/index.js"
import * as File from "./file.js"
import * as Xml from "./xml.js"
import * as JmdictRaw from "./jmdict_raw.js"
import * as DbWord from "../../common/db_word.js"


export const url = "http://ftp.edrdg.org/pub/Nihongo/JMdict_e.gz"
export const gzipFilename = File.downloadFolder + "JMdict_e.gz"
export const xmlFilename = File.downloadFolder + "JMdict_e.xml"


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

    const entryIterator = Xml.iterateEntriesStreamed<JmdictRaw.Entry>(
        xmlFilename,
        "JMdict",
        "entry")
    
    for await (const raw of entryIterator)
    {
        if ((raw as any).k_ele)
            console.dir(raw, { depth: null })

        try
        {
            const entry = normalizeEntry(raw)
            
            if ((raw as any).k_ele)
                console.dir(entry, { depth: null })

            await db.importWords([entry])
        }
        catch (e: any)
        {
            throw `error normalizing word entry ${ raw.ent_seq[0] }: ${ e }`
        }

        console.log()
        console.log()
        console.log()
    }
}


function normalizeEntry(
    raw: JmdictRaw.Entry)
    : DbWord.Entry
{
    const entry: DbWord.Entry = {
        _id: `w${ raw.ent_seq[0] }`,
        headings: [],
        defs: [],
        pos: [],
    }

    // Import headings
    entry.headings = normalizeHeadings(raw)

    // Import senses/definitions
    entry.defs = normalizeDefinitions(raw)

    // Gather part-of-speech tags at word-level
    entry.pos = [...new Set(entry.defs.map(d => d.pos).flat())]

    return entry
}


function normalizeHeadings(
    raw: JmdictRaw.Entry)
    : DbWord.Heading[]
{
    const usuallyOnlyKana =
        raw.sense[0].misc !== undefined &&
        raw.sense[0].misc.some(miscTag => miscTag == "uk")

    const headings: DbWord.Heading[] = []

    const seenReadings = new Set<string>()

    // Extract all possible pairs of
    // (kanji elements * reading elements),
    // respecting the restrictive or search-only tags.
    for (const k_ele of raw.k_ele ?? [])
    {
        const keb = k_ele.keb[0]

        for (const r_ele of raw.r_ele)
        {
            if (r_ele.re_nokanji !== undefined)
                continue

            if (r_ele.re_restr !== undefined &&
                !r_ele.re_restr.find(restr => restr == keb))
                continue

            if (k_ele.ke_inf !== undefined &&
                k_ele.ke_inf.some(t => t === "sK"))
                continue

            const reb = r_ele.reb[0]
            
            const k_eleTags: DbWord.HeadingTag[] = []
            if (k_ele.ke_pri !== undefined)
                k_eleTags.push(...k_ele.ke_pri)
                
            if (k_ele.ke_inf !== undefined)
                k_eleTags.push(...k_ele.ke_inf)

            const r_eleTags: DbWord.HeadingTag[] = []
            if (r_ele.re_pri !== undefined)
                r_eleTags.push(...r_ele.re_pri)
                
            if (r_ele.re_inf !== undefined)
                r_eleTags.push(...r_ele.re_inf)

            // TODO: Perhaps only keep the tags
            // contained in the union of `k_eleTags` and `r_eleTags`

            seenReadings.add(reb)
            headings.push({
                base: keb,
                reading: reb,
                tags: [...new Set([...k_eleTags, ...r_eleTags])],
            })
        }
    }

    // Extract remaining reading elements that
    // have no associated kanji element, or if the word
    // is usually written in plain kana.
    for (const r_ele of raw.r_ele)
    {
        const reb = r_ele.reb[0]

        if (seenReadings.has(reb) && !usuallyOnlyKana)
            continue
        
        const tags: DbWord.HeadingTag[] = []
        if (usuallyOnlyKana)
            tags.push("uk")

        if (r_ele.re_pri !== undefined)
            tags.push(...r_ele.re_pri)
            
        if (r_ele.re_inf !== undefined)
            tags.push(...r_ele.re_inf)

        headings.push({
            base: reb,
            reading: undefined,
            tags: [...new Set(tags)],
        })
    }

    return headings
}


function normalizeDefinitions(
    raw: JmdictRaw.Entry)
    : DbWord.Definition[]
{
    const defs: DbWord.Definition[] = []

    for (const rawSense of raw.sense)
    {
        const pos = rawSense.pos
        
        const gloss = rawSense.gloss
            .map(g => typeof g === "string" ? g : g.text)

        defs.push({
            pos,
            gloss,
        })
    }

    return defs
}