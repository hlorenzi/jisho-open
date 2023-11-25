import * as Db from "../db/index.ts"
import * as Logging from "./logging.ts"
import * as File from "./file.ts"
import * as Xml from "./xml.ts"
import * as JmdictRaw from "./jmdict_raw.ts"
import * as BatchDispatcher from "./batch_dispatcher.ts"
import * as Api from "common/api/index.ts"
import * as Kana from "common/kana.ts"
import * as Furigana from "common/furigana.ts"
import * as Mazegaki from "common/mazegaki.ts"
import * as JmdictTags from "common/jmdict_tags.ts"
import * as JlptWords from "../data/jlpt_words.ts"
import * as PitchAccent from "../data/pitch_accent.ts"
import * as FuriganaHelpers from "../data/furigana_helpers.ts"


export const url = "http://ftp.edrdg.org/pub/Nihongo/JMdict_e.gz"
export const gzipFilename = File.downloadFolder + "JMdict_e.gz"
export const xmlFilename = File.downloadFolder + "JMdict_e.xml"


export async function downloadAndImport(
    logger: Logging.Logger,
    db: Db.Interface,
    useCachedFiles: boolean)
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

    const entryIterator = Xml.iterateEntriesStreamed<JmdictRaw.Entry>(
        logger,
        xmlFilename,
        "JMdict",
        "entry")

    await logger.writeLn("importing word entries...")

    const startDate = new Date()

    const dispatcher = new BatchDispatcher.BatchDispatcher(
        25,
        (items: Api.Word.Entry[]) => db.importWordEntries(startDate, items))
    
    for await (const rawEntry of entryIterator)
    {
        try
        {
            const apiEntry = normalizeEntry(rawEntry)
            await dispatcher.push(apiEntry)
        }
        catch (e: any)
        {
            throw `error normalizing word entry ${ rawEntry.ent_seq[0] }: ${ e }`
        }
    }

    await dispatcher.finish()
    await db.importWordEntriesFinish(startDate)

    JlptWords.clearCache()
    FuriganaHelpers.clearCache()
    PitchAccent.clearCache()
}


function normalizeEntry(
    raw: JmdictRaw.Entry)
    : Api.Word.Entry
{
    const entry: Api.Word.Entry = {
        id: `w${ raw.ent_seq[0] }`,
        headings: [],
        senses: [],
        score: 0,
    }

    // Import headings.
    entry.headings = normalizeHeadings(raw)

    // Import senses/definitions.
    entry.senses = normalizeSenses(raw)

    // Import pitch accent entries.
    const pitchEntries = gatherPitchAccentEntries(entry.headings)
    if (pitchEntries.length !== 0)
        entry.pitch = pitchEntries

    // Calculate the whole entry's commonness score.
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
        
            if (r_ele.re_restr !== undefined &&
                !r_ele.re_restr.some(restr => restr === keb))
                continue

            if (r_ele.re_inf !== undefined &&
                r_ele.re_inf.some(tag => tag === "sk"))
                continue
            
            seenReadings.add(reb)
            headings.push(normalizeHeading(r_ele, k_ele))
        }
    }

    // Extract remaining reading elements that
    // have no associated kanji element.
    for (const r_ele of raw.r_ele)
    {
        const reb = r_ele.reb[0]

        if (seenReadings.has(reb))
            continue

        if (r_ele.re_inf !== undefined &&
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
        headings.push(heading)
        
        seenReadings.add(reb)
    }

    // Sort rare/outdated entries to the back,
    // and usually-only-kana entries to the front.
    const score = (h: Api.Word.Heading) => {
        return (
            (h.searchOnlyKanji ? -1000 : 0) +
            (h.searchOnlyKana ? -1000 : 0) +
            (h.outdatedKanji ? -100 : 0) +
            (h.outdatedKana ? -100 : 0) +
            (h.rareKanji ? -10 : 0) +
            (h.irregularKana ? -1 : 0) +
            (h.irregularKanji ? -1 : 0) +
            (h.irregularOkurigana ? -1 : 0) +
            (usuallyOnlyKana && !Kana.hasKanji(h.base) ? 1000 : 0)
        )
    }

    headings.sort((a, b) => score(b) - score(a))

    // If the word is usually written in plain kana,
    // extract the first hiragana reading element and put it
    // at the front, unless we've already got it, and unless
    // there's already a katakana heading for it of the
    // same or greater commonness score.
    if (usuallyOnlyKana)
    {
        for (const r_ele of raw.r_ele)
        {
            const reb = r_ele.reb[0]

            if (seenReadings.has(reb))
            {
                if (Kana.hasHiragana(reb))
                {
                    if (r_ele.re_inf?.some(tag => tag === "ik" || tag === "ok" || tag === "sk"))
                        continue

                    const asKatakana = Kana.toKatakana(reb)

                    const isMatchingCommonKatakana = (r: JmdictRaw.EntryREle) => {
                        return r.reb[0] === asKatakana &&
                            r.re_nokanji &&
                            (r.re_pri?.length ?? 0) >= (r_ele.re_pri?.length ?? 0)
                    }

                    if (reb !== asKatakana &&
                        raw.r_ele.some(isMatchingCommonKatakana))
                        continue
                }
                else
                {
                    const isMatchingKatakana = (r: JmdictRaw.EntryREle) => {
                        return r.reb[0] === reb &&
                            r.re_nokanji
                    }

                    if (raw.r_ele.some(isMatchingKatakana))
                        continue
                }
            }
            
            if (r_ele.re_inf !== undefined &&
                r_ele.re_inf.some(tag => tag === "sk"))
                continue
            
            const heading = normalizeHeading(r_ele, undefined)
            headings.unshift(heading)
            break
        }
    }

    return [...headings]
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
        heading.gikun = true

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
        score += Math.max(0, 100 + ((heading.jlpt - 1) * 100))

    if (heading.rankNf !== undefined)
        score += Math.max(0, 500 - ((heading.rankNf - 1) * 10))

    if (heading.rankIchi !== undefined)
        score +=
            heading.rankIchi === 2 ? 500 :
            heading.rankIchi === 1 ? 100 :
            0

    /*if (heading.rankNews !== undefined)
        score += 
            heading.rankNews === 2 ? 500 :
            heading.rankNews === 1 ? 100 :
            0*/

    if (heading.rankSpec !== undefined)
        score +=
            heading.rankSpec === 2 ? 500 :
            heading.rankSpec === 1 ? 100 :
            0

    if (heading.rankGai !== undefined)
        score +=
            heading.rankGai === 2 ? 50 :
            heading.rankGai === 1 ? 10 :
            0

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

    return Math.round(score)
}


function normalizeSenses(
    raw: JmdictRaw.Entry)
    : Api.Word.Sense[]
{
    const senses: Api.Word.Sense[] = []

    for (const rawSense of raw.sense)
    {
        const pos = rawSense.pos
        
        const gloss: Api.Word.Gloss[] = []
        for (const rawGloss of rawSense.gloss)
        {
            if (typeof rawGloss === "string")
                gloss.push(rawGloss)
            else
                gloss.push({
                    text: rawGloss.text,
                    type: rawGloss.attr.g_type,
                })
        }

        const sense: Api.Word.Sense = {
            pos,
            gloss,
        }

        if (rawSense.misc)
            sense.misc = rawSense.misc

        if (rawSense.field)
            sense.field = rawSense.field

        if (rawSense.s_inf)
            sense.info = rawSense.s_inf

        if (rawSense.xref)
        {
            sense.xref = []
            for (const rawXref of rawSense.xref)
                sense.xref.push(normalizeXref(rawXref))
        }

        if (rawSense.ant)
        {
            if (sense.xref === undefined)
                sense.xref = []

            for (const rawAnt of rawSense.ant)
                sense.xref.push({
                    ...normalizeXref(rawAnt),
                    type: "antonym",
                })
        }

        if (rawSense.lsource)
        {
            sense.lang = []

            for (const lsource of rawSense.lsource)
            {
                const langSrc: Api.Word.LanguageSource = {}

                if (lsource.attr["xml:lang"] !== undefined)
                    langSrc.language = lsource.attr["xml:lang"]

                if (lsource.attr.ls_type !== undefined)
                    langSrc.partial = !!lsource.attr.ls_type
                
                if (lsource.attr.ls_wasei !== undefined)
                    langSrc.wasei = !!lsource.attr.ls_wasei
                
                if (lsource.text !== undefined)
                    langSrc.source = lsource.text

                sense.lang.push(langSrc)
            }
        }

        if (rawSense.dial)
            sense.dialect = rawSense.dial

        if (rawSense.stagr)
            sense.restrict = rawSense.stagr

        senses.push(sense)
    }

    return senses
}


function normalizeXref(
    rawXref: string)
    : Api.Word.CrossReference
{
    const split = rawXref.split("・")

    if (split.length === 1)
        return { base: rawXref }

    if (split.length === 2)
    {
        if (Kana.hasJapanese(split[1]))
            return { base: split[0], reading: split[1] }
        else
            return { base: split[0], senseIndex: parseInt(split[1]) }
    }

    if (split.length === 3)
        return {
            base: split[0],
            reading: split[1],
            senseIndex: parseInt(split[2]),
        }

    throw `invalid xref`
}


function gatherPitchAccentEntries(
    apiHeadings: Api.Word.Heading[])
    : Api.Word.PitchAccent[]
{
    const hasAnyKanji = apiHeadings.some(h => Kana.hasKanji(h.base))

    const pitchKeys: [base: string, reading?: string][] = []

    for (const heading of apiHeadings)
    {
        if (!Kana.hasKanji(heading.base))
        {
            if (!hasAnyKanji)
            {
                pitchKeys.push([heading.base, undefined])
                continue
            }

            const kanjiCandidates = apiHeadings.filter(h =>
                Kana.hasKanji(h.base) &&
                h.reading === heading.base)

            for (const kanji of kanjiCandidates)
                pitchKeys.push([kanji.base, heading.base])

            continue
        }

        pitchKeys.push([heading.base, heading.reading])
    }

    const pitch = pitchKeys
        .flatMap(p => PitchAccent.get(p[0], p[1]))

    return [...new Set<string>(pitch)]
        .map(p => ({ text: p }))
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
    const partsOfSpeech = apiWord.senses
        .flatMap(d => d.pos)

    const glossTypes = apiWord.senses
        .flatMap(d => d.gloss.map(g => typeof g !== "string" ? [g.type] : []))
        .flat()
    
    const fieldTags = apiWord.senses
        .flatMap(d => d.field ?? [])

    const miscTags = apiWord.senses
        .flatMap(d => d.misc ?? [])

    const langTags = apiWord.senses
        .flatMap(d => d.lang ?? [])
        .map(l => l.language ?? "wasei")
    
    const dialectTags = apiWord.senses
        .flatMap(d => d.dialect ?? [])

    const commonness = apiWord.headings
        .map(h => JmdictTags.getCommonness(h))
        .filter(t => t !== null) as Api.CommonnessTag[]

    let lowestJlptLevel: Api.JlptLevel | undefined = undefined
    for (const heading of apiWord.headings)
    {
        if (heading.jlpt === undefined)
            continue

        if (lowestJlptLevel === undefined ||
            heading.jlpt > lowestJlptLevel)
            lowestJlptLevel = heading.jlpt
    }

    const jlptTag: Api.JlptTag[] = ["jlpt"]
    if (lowestJlptLevel !== undefined)
        jlptTag.push(`n${ lowestJlptLevel }`)

    return JmdictTags.expandFilterTags([...new Set<Api.Word.FilterTag>([
        ...partsOfSpeech,
        ...glossTypes,
        ...fieldTags,
        ...miscTags,
        ...langTags,
        ...dialectTags,
        ...commonness,
        ...jlptTag,
    ])])
}