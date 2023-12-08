import * as Db from "../db/index.ts"
import * as Logging from "./logging.ts"
import * as File from "./file.ts"
import * as Xml from "./xml.ts"
import * as JmnedictRaw from "./jmnedict_raw.ts"
import * as Jmdict from "./jmdict.ts"
import * as BatchDispatcher from "./batch_dispatcher.ts"
import * as Api from "common/api/index.ts"
import * as Kana from "common/kana.ts"
import * as Furigana from "common/furigana.ts"
import * as Mazegaki from "common/mazegaki.ts"
import * as JmdictTags from "common/jmdict_tags.ts"


export const url = "http://ftp.edrdg.org/pub/Nihongo/JMnedict.xml.gz"
export const gzipFilename = File.downloadFolder + "JMnedict.gz"
export const xmlFilename = File.downloadFolder + "JMnedict.xml"


export async function downloadAndImport(
    logger: Logging.Logger,
    db: Db.Interface,
    useCachedFiles: boolean,
    startDate: Date)
{
    await File.download(
        logger,
        url,
        gzipFilename,
        useCachedFiles)
    
    await File.extractGzip(
        logger,
        gzipFilename,
        xmlFilename,
        useCachedFiles)

    const entryIterator = Xml.iterateEntriesStreamed<JmnedictRaw.Entry>(
        logger,
        xmlFilename,
        "JMnedict",
        "entry")

    await logger.writeLn("importing name entries...")

    const dispatcher = new BatchDispatcher.BatchDispatcher(
        25,
        async (items: Api.Word.Entry[]) => {
            await db.importWordEntries(startDate, items)

            if (!useCachedFiles)
                await new Promise((resolve) => setTimeout(resolve, 500))
        })
    
    for await (const rawEntry of entryIterator)
    {
        try
        {
            const apiEntry = normalizeEntry(rawEntry)
            await dispatcher.push(apiEntry)
        }
        catch (e: any)
        {
            throw `error normalizing name entry ${ rawEntry.ent_seq[0] }: ${ e }`
        }
    }

    await dispatcher.finish()
}


export function normalizeEntry(
    raw: JmnedictRaw.Entry)
    : Api.Word.Entry
{
    const entry: Api.Word.Entry = {
        id: `n${ raw.ent_seq[0] }`,
        headings: [],
        senses: [],
        score: 0,
    }

    // Import headings.
    entry.headings = Jmdict.normalizeHeadings(
        entry.id,
        raw.k_ele,
        raw.r_ele,
        false,
        true)

    // Import senses/definitions.
    entry.senses = normalizeSenses(raw.trans)

    // Calculate the whole entry's commonness score.
    entry.score = entry.headings.reduce(
        (score, heading) => Math.max(score, heading.score ?? 0),
        -Infinity)

    return entry
}


function normalizeSenses(
    rawSenses: JmnedictRaw.Trans[])
    : Api.Word.Sense[]
{
    const senses: Api.Word.Sense[] = []

    for (const rawSense of rawSenses)
    {
        const pos = rawSense.name_type
        //if (pos.some(p => !Api.Word.partOfSpeechNameTags.includes(p as any)))
        //    throw "invalid name_type"
        
        const gloss: Api.Word.Gloss[] = []
        for (const rawTransDet of rawSense.trans_det)
        {
            if (typeof rawTransDet !== "string")
                throw "invalid trans_det"

            gloss.push(rawTransDet)
        }

        const sense: Api.Word.Sense = {
            pos,
            gloss,
        }

        if (rawSense.xref)
        {
            sense.xref = []
            for (const rawXref of rawSense.xref)
                sense.xref.push(Jmdict.normalizeXref(rawXref))
        }

        senses.push(sense)
    }

    return senses
}