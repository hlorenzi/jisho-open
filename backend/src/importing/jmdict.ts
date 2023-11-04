import * as Db from "../db/index.ts"
import * as File from "./file.ts"
import * as Xml from "./xml.ts"
import * as JmdictRaw from "./jmdict_raw.ts"
import * as Gatherer from "./gatherer.ts"
import * as Api from "common/api/index.ts"
import * as Kana from "common/kana.ts"
import * as Furigana from "common/furigana.ts"
import * as Mazegaki from "common/mazegaki.ts"
import * as JmdictTags from "common/jmdict_tags.ts"
import * as JlptWords from "../data/jlpt_words.ts"
import * as FuriganaHelpers from "../data/furigana_helpers.ts"

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
    
    for await (const rawEntry of entryIterator)
    {
        //if ((raw as any).k_ele)
        //    console.dir(raw, { depth: null })

        try
        {
            const apiEntry = normalizeEntry(rawEntry)

            //if ((raw as any).k_ele)
            //    console.dir(entry, { depth: null })

            await gatherer.push(apiEntry)
        }
        catch (e: any)
        {
            throw `error normalizing word entry ${ rawEntry.ent_seq[0] }: ${ e }`
        }
    }

    await gatherer.finish()

    JlptWords.clearCache()
    FuriganaHelpers.clearCache()
}


function normalizeEntry(
    raw: JmdictRaw.Entry)
    : Api.Word.Entry
{
    const entry: Api.Word.Entry = {
        id: `w${ raw.ent_seq[0] }`,
        headings: [],
        defs: [],
        score: 0,
    }

    // Import headings.
    entry.headings = normalizeHeadings(raw)

    // Import senses/definitions.
    entry.defs = normalizeDefinitions(raw)

    // Calculate the whole entry commonness score.
    entry.score = entry.headings.reduce(
        (score, heading) => Math.max(score, heading.score ?? 0),
        -Infinity)

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
        for (const r_ele of raw.r_ele)
        {
            const keb = k_ele.keb[0]
            const reb = r_ele.reb[0]
                
            if (r_ele.re_nokanji !== undefined)
                continue
        
            if (r_ele.re_restr &&
                !r_ele.re_restr.some(restr => restr === keb))
                continue

            if (r_ele.re_inf &&
                r_ele.re_inf.some(tag => tag === "sk"))
                continue
            
            seenReadings.add(reb)
            headings.push(normalizeHeading(r_ele, k_ele))
        }
    }

    // Extract remaining reading elements that
    // have no associated kanji element.
    // If the word is usually written in plain kana,
    // extract the first reading element unconditionally.
    const kanaOnlyHeadings: Api.Word.Heading[] = []
    let gotFirstOnlyKana = false

    for (const r_ele of raw.r_ele)
    {
        const reb = r_ele.reb[0]

        if (seenReadings.has(reb))
        {
            if (!usuallyOnlyKana)
                continue

            if (gotFirstOnlyKana)
                continue

            if (raw.r_ele.some(r => r.reb[0] === Kana.toKatakana(reb)))
            {
                gotFirstOnlyKana = true
                continue
            }
        }

        if (r_ele.re_inf &&
            r_ele.re_inf.some(tag => tag === "sk"))
        {
            seenReadings.add(reb)
            headings.push({
                base: reb,
                furigana: reb + Furigana.READING_SEPARATOR,
                searchOnlyKana: true,
            })
            continue
        }
        
        const heading = normalizeHeading(r_ele, undefined)

        if (usuallyOnlyKana)
        {
            kanaOnlyHeadings.push(heading)
            gotFirstOnlyKana = true
        }
        else
            headings.push(heading)
        
        seenReadings.add(reb)
    }

    return [...kanaOnlyHeadings, ...headings]
}


function normalizeHeading(
    r_ele: JmdictRaw.EntryREle,
    k_ele?: JmdictRaw.EntryKEle)
    : Api.Word.Heading
{
    const keb = k_ele?.keb[0]
    const reb = r_ele.reb[0]

    const heading: Api.Word.Heading = {
        base: keb ?? reb,
        furigana: "",
    }

    if (keb !== undefined)
        heading.reading = reb

    
    // Check for a whole-word manually-crafted furigana segmentation.
    const perfectPatch = FuriganaHelpers.getPatch(
        heading.base,
        heading.reading ?? "")

    if (perfectPatch !== undefined)
        heading.furigana = Furigana.encode(perfectPatch)
    else
    {
        // Attempt automatic furigana segmentation.
        const furiganaMatches = Furigana.match(
            heading.base,
            heading.reading ?? "")

        const furiganaRevised = Furigana.revise(
            furiganaMatches,
            FuriganaHelpers.getReadings)

        const furiganaPatched =
            Furigana.patch(
                furiganaRevised,
                FuriganaHelpers.getPatch)

        heading.furigana = Furigana.encode(furiganaPatched)
    }


    if (k_ele?.ke_inf?.some(tag => tag === "ateji"))
        heading.ateji = true

    if (k_ele?.ke_inf?.some(tag => tag === "iK"))
        heading.irregularKanji = true

    if (k_ele?.ke_inf?.some(tag => tag === "ik"))
        heading.irregularKana = true

    if (k_ele?.ke_inf?.some(tag => tag === "rK"))
        heading.rareKanji = true

    if (k_ele?.ke_inf?.some(tag => tag === "oK"))
        heading.outdatedKanji = true

    if (k_ele?.ke_inf?.some(tag => tag === "sK"))
        heading.searchOnlyKanji = true


    if (r_ele.re_inf?.some(tag => tag === "gikun"))
        heading.gikunOrJukujikun = true

    if (r_ele.re_inf?.some(tag => tag === "ik"))
        heading.irregularKana = true

    if (r_ele.re_inf?.some(tag => tag === "ok"))
        heading.outdatedKana = true

    if (r_ele.re_inf?.some(tag => tag === "sk"))
        heading.searchOnlyKana = true


    type RankField = {
        tagPrefix: string
        field: Api.Word.HeadingRankField
    }

    const rankFields: RankField[] = [
        { tagPrefix: "ichi", field: "rankIchi" },
        { tagPrefix: "news", field: "rankNews" },
        { tagPrefix: "nf", field: "rankNf" },
        { tagPrefix: "spec", field: "rankSpec" },
        { tagPrefix: "gai", field: "rankGai" },
    ]

    const kRanks: Pick<Api.Word.Heading, Api.Word.HeadingRankField> = {}
    
    for (const rankTag of k_ele?.ke_pri ?? [])
    {
        for (const rankField of rankFields)
        {
            if (rankTag.startsWith(rankField.tagPrefix))
            {
                const rank = parseInt(rankTag.substring(rankField.tagPrefix.length))
                kRanks[rankField.field] = rank
            }
        }
    }

    const rRanks: Pick<Api.Word.Heading, Api.Word.HeadingRankField> = {}
    
    for (const rankTag of r_ele?.re_pri ?? [])
    {
        for (const rankField of rankFields)
        {
            if (rankTag.startsWith(rankField.tagPrefix))
            {
                const rank = parseInt(rankTag.substring(rankField.tagPrefix.length))
                rRanks[rankField.field] = rank
            }
        }
    }

    for (const rankField of rankFields)
    {
        const kRank = kRanks[rankField.field]
        const rRank = rRanks[rankField.field]
        
        if (kRank !== undefined &&
            rRank !== undefined)
        {
            heading[rankField.field] = Math.max(kRank, rRank)
        }
        else if (kRank === undefined &&
            k_ele === undefined &&
            rRank !== undefined)
        {
            heading[rankField.field] = rRank
        }
    }

    const jlpt = JlptWords.get(heading.base, heading.reading)
    if (jlpt !== undefined)
        heading.jlpt = jlpt

    const score = scoreHeading(heading)
    if (score !== 0)
        heading.score = score

    return heading
}


function scoreHeading(
    heading: Api.Word.Heading)
    : number
{
    let score = 0

    if (heading.jlpt !== undefined)
        score += Math.max(0, 6000 + ((heading.jlpt - 1) * 1000))

    if (heading.rankIchi !== undefined)
        score += Math.max(0, 500 - ((heading.rankIchi - 1) * 250))

    if (heading.rankNews !== undefined)
        score += Math.max(0, 500 - ((heading.rankNews - 1) * 250))

    if (heading.rankNf !== undefined)
        score += Math.max(0, 100 - ((heading.rankNf - 1) * 10))

    if (heading.rankSpec !== undefined)
        score += Math.max(0, 500 - ((heading.rankSpec - 1) * 250))

    if (heading.rankGai !== undefined)
        score += Math.max(0, 10 - ((heading.rankGai - 1) * 5))

    if (heading.irregularKanji)
        score -= 20000

    if (heading.irregularKana)
        score -= 20000

    if (heading.irregularOkurigana)
        score -= 20000

    if (heading.outdatedKanji)
        score -= 30000

    if (heading.outdatedKana)
        score -= 30000

    return score
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


export function gatherLookUpHeadings(
    apiWord: Api.Word.Entry)
    : Api.Word.LookUpHeading[]
{
    const lookUpHeadings = new Map<string, Api.Word.LookUpHeading>()

    const add = (text: string, score: number) => {
        const prev = lookUpHeadings.get(text)
        if (prev &&
            prev.score > score)
            return
        
        lookUpHeadings.set(text, { text, score })
    }
    
    for (const heading of apiWord.headings)
    {
        const score = heading.score ?? 0
        const base = Kana.normalizeWidthForms(heading.base).toLowerCase()
        add(base, score)
        add(Kana.toHiragana(base), score)

        if (heading.reading)
        {
            const reading = Kana.normalizeWidthForms(heading.reading).toLowerCase()
            add(reading, score)
            add(Kana.toHiragana(reading), score)

            const furi = Furigana.decode(heading.furigana)
            for (const mazegaki of Mazegaki.generateMazegaki(furi))
                add(mazegaki, score)
        }
    }
    
    return [...lookUpHeadings.values()]
}


export function gatherLookUpTags(
    apiWord: Api.Word.Entry)
    : Api.Word.FilterTag[]
{
    const partsOfSpeech = apiWord.defs
        .flatMap(d => d.pos)

    const commonness = apiWord.headings
        .map(h => JmdictTags.getCommonness(h))
        .filter(t => t !== null) as Api.Word.CommonnessTag[]

    return JmdictTags.expandFilterTags([...new Set(
        ...partsOfSpeech,
        ...commonness,
    )])
}