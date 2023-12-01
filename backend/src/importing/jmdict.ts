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
import * as AnimeDramaRanking from "../data/animedrama_ranking.ts"
import * as JmdictExtraTags from "../data/jmdict_extra_tags.ts"


export const url = "http://ftp.edrdg.org/pub/Nihongo/JMdict_e_examp.gz"
export const gzipFilename = File.downloadFolder + "JMdict_e_examp.gz"
export const xmlFilename = File.downloadFolder + "JMdict_e_examp.xml"


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

    const entryIterator = Xml.iterateEntriesStreamed<JmdictRaw.Entry>(
        logger,
        xmlFilename,
        "JMdict",
        "entry")

    await logger.writeLn("importing word entries...")

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

    await dispatcher.push(normalizeEntry({
        ent_seq: ["90000000"],
        r_ele: [{ reb: ["ロレンズィ"] }],
        sense: [
            {
                pos: ["n"],
                gloss: ["Lorenzi", "yours truly", "creator of https://jisho.hlorenzi.com"],
            }
        ]
    }))
    
    await dispatcher.push(normalizeEntry({
        ent_seq: ["90000001"],
        k_ele: [{ keb: ["剣白"] }],
        r_ele: [{ reb: ["けんしろ"] }],
        sense: [
            {
                pos: ["n"],
                gloss: ["Kenshiro", "green dragon character appearing in Lorenzi's logos"],
            }
        ]
    }))

    await dispatcher.finish()
}


export function normalizeEntry(
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
    const usuallyOnlyKana =
        raw.sense[0].misc !== undefined &&
        raw.sense[0].misc.some(miscTag => miscTag == "uk")

    entry.headings = normalizeHeadings(
        entry.id,
        raw.k_ele,
        raw.r_ele,
        usuallyOnlyKana,
        false)

    // Import senses/definitions.
    entry.senses = normalizeSenses(raw.sense)

    // Append extra part-of-speech tags.
    const extraTags = JmdictExtraTags.get(
        entry.id,
        entry.headings.map(h => h.base))
    
    if (extraTags.length !== 0)
        entry.senses.forEach(s => s.pos.push(...extraTags))

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


export function normalizeHeadings(
    wordId: string,
    rawKEle: JmdictRaw.EntryKEle[] | undefined,
    rawREle: JmdictRaw.EntryREle[],
    usuallyOnlyKana: boolean,
    isName: boolean)
    : Api.Word.Heading[]
{
    const headings: Api.Word.Heading[] = []

    const seenReadings = new Set<string>()

    // Extract all possible pairs of
    // (kanji elements * reading elements),
    // respecting the restrictive or search-only tags.
    for (const k_ele of rawKEle ?? [])
    {
        for (const r_ele of rawREle)
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
            headings.push(normalizeHeading(wordId, r_ele, k_ele, isName))
        }
    }

    // Extract remaining reading elements that
    // have no associated kanji element.
    for (const r_ele of rawREle)
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
        
        const heading = normalizeHeading(wordId, r_ele, undefined, isName)
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
        for (const r_ele of rawREle)
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
                        rawREle.some(isMatchingCommonKatakana))
                        continue
                }
                else
                {
                    const isMatchingKatakana = (r: JmdictRaw.EntryREle) => {
                        return r.reb[0] === reb &&
                            r.re_nokanji
                    }

                    if (rawREle.some(isMatchingKatakana))
                        continue
                }
            }
            
            if (r_ele.re_inf !== undefined &&
                r_ele.re_inf.some(tag => tag === "sk"))
                continue
            
            const heading = normalizeHeading(wordId, r_ele, undefined, isName)
            headings.unshift(heading)
            break
        }
    }

    for (let h = 0; h < headings.length; h++)
    {
        const heading = headings[h]

        if (!isName &&
            !heading.searchOnlyKanji &&
            !heading.searchOnlyKana &&
            !heading.outdatedKanji &&
            !heading.outdatedKana)
        {
            const jlpt = JlptWords.get(wordId, headings, h)
            if (jlpt !== undefined)
                heading.jlpt = jlpt
        }

        const score = scoreHeading(heading)
        if (score !== 0)
            heading.score = score
    }

    return [...headings]
}


function normalizeHeading(
    wordId: string,
    r_ele: JmdictRaw.EntryREle,
    k_ele: JmdictRaw.EntryKEle | undefined,
    isName: boolean)
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


    if (!isName)
    {
        const rankAnimeDrama = AnimeDramaRanking.get(wordId, heading.base)
        if (rankAnimeDrama !== undefined)
            heading.rankAnimeDrama = rankAnimeDrama
    }


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

    return heading
}


function scoreCurve(
    n: number,
    min: number,
    max: number,
    minScore: number,
    maxScore: number)
{
    const t = (n - min) / (max - min)
    const curve0to1 = t * t
    return Math.max(0, Math.ceil(minScore + ((maxScore - minScore) * curve0to1)))
}


function scoreHeading(
    heading: Api.Word.Heading)
    : number
{
    let score = 0

    if (heading.jlpt !== undefined)
        score += scoreCurve(heading.jlpt, 5, 1, 1000, 100)

    if (heading.rankNf !== undefined)
        score += scoreCurve(heading.rankNf, 1, 48, 500, 100)

    if (heading.rankIchi !== undefined)
        score +=
            heading.rankIchi === 2 ? 500 :
            heading.rankIchi === 1 ? 100 :
            0

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
        
    if (heading.rankAnimeDrama !== undefined)
        score += scoreCurve(heading.rankAnimeDrama, 1, 100_000, 100, 0)

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


export function normalizeSenses(
    rawSenses: JmdictRaw.Sense[])
    : Api.Word.Sense[]
{
    const senses: Api.Word.Sense[] = []

    for (const rawSense of rawSenses)
    {
        const pos = rawSense.pos
        if (pos.some(p => !Api.Word.partOfSpeechTags.includes(p as any)))
            throw "invalid pos"
        
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

        if (rawSense.stagr || rawSense.stagk)
            sense.restrict = [
                ...(rawSense.stagr ?? []),
                ...(rawSense.stagk ?? []),
            ]

        if (rawSense.example)
        {
            sense.examples = []
            for (const example of rawSense.example)
            {
                const term = example.ex_text[0]
                const ja = example.ex_sent.find(ex => ex.attr["xml:lang"] === "jpn")
                const en = example.ex_sent.find(ex => ex.attr["xml:lang"] === "eng")
                
                if (!term || !ja || !en || !ja.text || !en.text)
                    throw "invalid example sentence"
                
                sense.examples.push({
                    term,
                    ja: ja.text,
                    en: en.text,
                })
            }
        }

        senses.push(sense)
    }

    return senses
}


export function normalizeXref(
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

    const nameTag: Api.Word.FilterTag[] =
        partsOfSpeech.some(p => Api.Word.partOfSpeechNameTags.includes(p as any)) ?
            ["name"] :
            []

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
        .filter(t => t !== undefined) as Api.CommonnessTag[]

    let lowestJlptLevel: Api.JlptLevel | undefined = undefined
    for (const heading of apiWord.headings)
    {
        if (heading.jlpt === undefined)
            continue

        if (lowestJlptLevel === undefined ||
            heading.jlpt > lowestJlptLevel)
            lowestJlptLevel = heading.jlpt
    }

    const jlptTag: Api.JlptTag[] = []
    if (lowestJlptLevel !== undefined)
    {
        jlptTag.push("jlpt")
        jlptTag.push(`n${ lowestJlptLevel }`)
    }

    return JmdictTags.expandFilterTags([...new Set<Api.Word.FilterTag>([
        ...nameTag,
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