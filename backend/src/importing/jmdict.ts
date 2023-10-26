import * as Db from "../db/index.ts"
import * as File from "./file.ts"
import * as Xml from "./xml.ts"
import * as JmdictRaw from "./jmdict_raw.ts"
import * as Api from "common/api/index.ts"
import * as Gatherer from "./gatherer.ts"

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

    const gatherer = new Gatherer.Gatherer(
        25,
        (items: Api.Word.Entry[]) => db.importWords(items))
    
    for await (const raw of entryIterator)
    {
        //if ((raw as any).k_ele)
        //    console.dir(raw, { depth: null })

        try
        {
            const entry = normalizeEntry(raw)
            
            //if ((raw as any).k_ele)
            //    console.dir(entry, { depth: null })

            await gatherer.push(entry)
        }
        catch (e: any)
        {
            throw `error normalizing word entry ${ raw.ent_seq[0] }: ${ e }`
        }
    }

    await gatherer.finish()
}


function normalizeEntry(
    raw: JmdictRaw.Entry)
    : Api.Word.Entry
{
    const entry: Api.Word.Entry = {
        id: `w${ raw.ent_seq[0] }`,
        headings: [],
        defs: [],
    }

    // Import headings
    entry.headings = normalizeHeadings(raw)

    // Import senses/definitions
    entry.defs = normalizeDefinitions(raw)

    return entry
}


function normalizeHeadings(
    raw: JmdictRaw.Entry)
    : Api.Word.Heading[]
{
    const usuallyOnlyKana =
        raw.sense[0].misc !== undefined &&
        raw.sense[0].misc.some(miscTag => miscTag == "uk")

    const headings: Api.Word.Heading[] = []

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
            
            const k_eleTags: Api.Word.HeadingTag[] = []
            if (k_ele.ke_pri !== undefined)
                k_eleTags.push(...k_ele.ke_pri)
                
            if (k_ele.ke_inf !== undefined)
                k_eleTags.push(...k_ele.ke_inf)

            const r_eleTags: Api.Word.HeadingTag[] = []
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
        
        const tags: Api.Word.HeadingTag[] = []
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
    : Api.Word.Definition[]
{
    const defs: Api.Word.Definition[] = []

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