import * as Db from "../db/index.ts"
import * as Logging from "./logging.ts"
import * as File from "./file.ts"
import * as Xml from "./xml.ts"
import * as KanjidicRaw from "./kanjidic_raw.ts"
import * as BatchDispatcher from "./batch_dispatcher.ts"
import * as Api from "common/api/index.ts"
import * as Kana from "common/kana.ts"
import * as Furigana from "common/furigana.ts"
import * as JmdictTags from "common/jmdict_tags.ts"
import * as KanjiComponents from "../data/kanji_components.ts"
import * as KanjiStructCat from "../data/kanji_structural_category.ts"
import * as KanjiDescrSeq from "../data/kanji_description_sequences.ts"


export const url = "http://www.edrdg.org/kanjidic/kanjidic2.xml.gz"
export const gzipFilename = File.downloadFolder + "kanjidic2.gz"
export const xmlFilename = File.downloadFolder + "kanjidic2.xml"


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

    const entryIterator = Xml.iterateEntriesStreamed<KanjidicRaw.Entry>(
        logger,
        xmlFilename,
        "kanjidic2",
        "character")

    await logger.writeLn("importing kanji entries...")

    const dispatcher = new BatchDispatcher.BatchDispatcher(
        25,
        async (items: [Api.Kanji.Entry, Api.KanjiWordCrossRef.Entry][]) => {
            await db.importKanjiEntries(items.map(i => i[0]))
            await db.importKanjiWordCrossRefEntries(items.map(i => i[1]))

            if (!useCachedFiles)
                await new Promise((resolve) => setTimeout(resolve, 500))
        })
    
    for await (const rawEntry of entryIterator)
    {
        try
        {
            const [apiEntry, apiCrossRefEntry] =
                await normalizeEntry(db, rawEntry)
            
            await dispatcher.push([apiEntry, apiCrossRefEntry])
        }
        catch (e: any)
        {
            throw `error normalizing kanji entry ${ rawEntry.literal[0] }: ${ e }`
        }
    }

    await dispatcher.finish()

    KanjiComponents.clearCache()
    KanjiStructCat.clearCache()
    KanjiDescrSeq.clearCache()
}


async function normalizeEntry(
    db: Db.Interface,
    raw: KanjidicRaw.Entry)
    : Promise<[Api.Kanji.Entry, Api.KanjiWordCrossRef.Entry]>
{
    const entry: Api.Kanji.Entry = {
        id: raw.literal[0],

        strokeCount: parseInt(raw.misc[0].stroke_count[0]),

        components: [],
        meanings: [],
        kunyomi: [],
        onyomi: [],
        readings: [],
    }


    // Import alternative stroke-counts
    if (raw.misc[0].stroke_count.length > 1)
        entry.strokeCounts = raw.misc[0].stroke_count.slice(1).map(s => parseInt(s))
    

    // Import jouyou level or jinmeiyou status
    const gradeRaw = raw.misc[0].grade?.[0]
    if (gradeRaw)
    {
        const grade = parseInt(gradeRaw)
        if (grade <= 6)
            entry.jouyou = grade as Api.JouyouGrade
        else if (grade === 8)
            entry.jouyou = 7 as Api.JouyouGrade
        else if (grade >= 9)
            entry.jinmeiyou = true
    }


    // Import JLPT level
    const oldJlptRaw = raw.misc[0].jlpt?.[0]
    if (oldJlptRaw)
    {
        const oldJlpt = parseInt(oldJlptRaw)
        if (oldJlpt >= 2)
            entry.jlpt = (oldJlpt + 1) as Api.JlptLevel
        else
            entry.jlpt = 1
    }


    // Import frequency in news
    const freqNews = raw.misc[0].freq?.[0]
    if (freqNews)
        entry.rankNews = parseInt(freqNews)


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


    // Import components
    const components = new Set<string>(KanjiComponents.get(entry.id))


    // Import structural category
    const structCat = KanjiStructCat.get(entry.id)
    if (structCat !== undefined)
        entry.structuralCategory = structCat


    // Import structural usage
    const keiseiPhonetic = KanjiStructCat.getKeiseiPhoneticUsage(entry.id)
    if (keiseiPhonetic !== undefined)
        entry.keiseiPhonetic = keiseiPhonetic

    const keiseiSemantic = KanjiStructCat.getKeiseiSemanticUsage(entry.id)
    if (keiseiSemantic !== undefined)
        entry.keiseiSemantic = keiseiSemantic


    // Import description sequence
    const descrSeq = KanjiDescrSeq.get(entry.id)
    if (descrSeq !== undefined &&
        typeof descrSeq !== "string")
    {
        entry.descrSeq = descrSeq[1]

        for (const seq of descrSeq[1])
            for (const part of KanjiDescrSeq.extractComponents(seq))
                components.add(part)
    }


    // Finalize components
    entry.components = [...components].sort()


    // Cross-reference with word entries
    const [crossRefEntry, hasCommonWord] = await crossReferenceWords(db, entry)

    
    // Calculate overall commonness score.
    const score = scoreEntry(entry, hasCommonWord)
    if (score !== 0)
        entry.score = score


    return [entry, crossRefEntry]
}


function scoreCurve(
    n: number,
    min: number,
    max: number,
    minScore: number,
    maxScore: number)
{
    const t = Math.max(0, Math.min(1, (n - min) / (max - min)))
    const curve0to1 = t * t * t
    return Math.max(0, Math.ceil(minScore + ((maxScore - minScore) * curve0to1)))
}


function scoreEntry(
    entry: Api.Kanji.Entry,
    hasCommonWord: boolean)
    : number
{
    let score = 0

    if (entry.jlpt !== undefined)
        score += scoreCurve(entry.jlpt, 5, 1, 35000, 1000)

    if (entry.jouyou !== undefined)
        score += scoreCurve(entry.jouyou, 1, 7, 10000, 1000)

    if (entry.jinmeiyou)
        score += 250

    if (entry.rankNews !== undefined)
        score += scoreCurve(entry.rankNews, 1, 2501, 5000, 100)

    if (hasCommonWord)
        score += 500

    if (entry.meanings.length > 0)
        score += 1

    score += (entry.wordCount ?? 0)

    return Math.round(score)
}


export function gatherLookUpMeanings(
    entry: Api.Kanji.Entry)
    : string[]
{
    const meanings = new Set<string>()
    for (const meaning of entry.meanings)
    {
        const words = meaning
            .replace(/\(|\)|\,|\.|\/|\"/g, " ")
            .split(/\s/)
            .map(w => w.trim().toLowerCase())
            .filter(w => w.length !== 0)

        for (const word of words)
            meanings.add(word)
    }

    return [...meanings]
}


export async function crossReferenceWords(
    db: Db.Interface,
    apiKanji: Api.Kanji.Entry)
    : Promise<[Api.KanjiWordCrossRef.Entry, hasCommonEntry: boolean]>
{
    type WorkingData = {
        heading: Api.Word.Heading
        score: number
        commonScore: number
        ateji?: boolean
        gikun?: boolean
        priority: number
        jlpt?: 5 | 4 | 3 | 2 | 1
        sense: string
    }

    const kanji = apiKanji.id

    const words = await db.listWordsWithChars([kanji])

    const readingBuckets = new Map<string, Map<string, WorkingData>>()

    const getPossibleReadings = (read: string) => {
        read = read.replace(/～/g, "")

        let readings = [Kana.toHiragana(read)]
        // TODO: Maybe also use Furigana.getPossibleRendaku
        return readings
    }

    const setReadingCommonness = (
        str: string | undefined,
        commonness: Api.CommonnessIndex) => {
        if (str === undefined)
            return
        
        for (const r of apiKanji.kunyomi)
        {
            if (getPossibleReadings(r.text).some(rr => rr == str) &&
                (r.commonness === undefined || r.commonness < commonness))
                r.commonness = commonness
        }

        for (const r of apiKanji.onyomi)
        {
            if (getPossibleReadings(r.text).some(rr => rr == str) &&
                (r.commonness === undefined || r.commonness < commonness))
                r.commonness = commonness
        }
    }

    for (const word of words)
    {
        for (let h = 0; h < word.headings.length; h++)
        {
            const heading = word.headings[h]

            if (heading.searchOnlyKanji ||
                heading.searchOnlyKana)
                continue
            
            const headingCommonness = JmdictTags.getCommonness(heading)
            const furigana = Furigana.decode(heading.furigana)

            for (let f = 0; f < furigana.length; f++)
            {
                const furiPart = furigana[f]
                const furiPartNext =
                    f + 1 < furigana.length ?
                        furigana[f + 1] :
                        null

                if (furiPart[0].indexOf(kanji) < 0)
                    continue

                let readingWithOkurigana: string | undefined = undefined

                let bucketKey = ""
                if (furiPart[0].indexOf(kanji) >= 0)
                {
                    bucketKey = Kana.toHiragana(furiPart[1])

                    readingWithOkurigana = bucketKey +
                        (!furiPartNext ? "" :
                            Kana.toHiragana(!furiPartNext[1] ? "." + furiPartNext[0] : ""))
                }

                let bucket = readingBuckets.get(bucketKey)
                if (!bucket)
                    bucket = new Map()

                let commonScore = 0
                if (headingCommonness == "veryCommon")
                {
                    commonScore = 2
                    setReadingCommonness(readingWithOkurigana, 2)
                }
                else if (headingCommonness == "common")
                {
                    commonScore = 1
                    setReadingCommonness(readingWithOkurigana, 1)
                }
                else if (heading.irregularKanji || heading.irregularKana || heading.irregularOkurigana)
                    commonScore = -1
                else if (heading.rareKanji)
                    commonScore = -2
                else if (heading.outdatedKanji || heading.outdatedKana)
                    commonScore = -3

                const alreadyAddedWord = bucket.get(word.id)
                if (!alreadyAddedWord || h < alreadyAddedWord.priority)
                {
                    bucket.set(
                        word.id,
                        {
                            heading: heading,
                            score: word.score,
                            jlpt: heading.jlpt,
                            commonScore,
                            ateji: heading.ateji,
                            gikun: heading.gikun,
                            priority: h,
                            sense: word.senses[0].gloss
                                .map(g => typeof g === "string" ? g : g.text)
                                .join("; "),
                        })
                }

                readingBuckets.set(bucketKey, bucket)
            }
        }
    }

    const standardReadings = [...apiKanji.kunyomi, ...apiKanji.onyomi]
    const bucketOrder = [...standardReadings.map(r => r.text)]

    // Insert rendaku-affected readings near the base reading
    for (let i = bucketOrder.length - 1; i >= 0; i--)
    {
        let r = bucketOrder[i]
        r = r.replace(/-/g, "")
        r = Kana.toHiragana(r)

        if (r.indexOf(".") >= 0)
            r = r.split(".")[0]

        bucketOrder[i] = r

        const rendaku = Furigana.getPossibleRendaku(r)
        for (const rd of rendaku.reverse())
            bucketOrder.splice(i + 1, 0, rd)
    }

    // Collapse buckets containing a single word,
    // and put all of these words in the "others" bucket.
    let othersBucket = readingBuckets.get("") || new Map()
    for (const [read, wordMap] of readingBuckets)
    {
        if (wordMap.size <= 1 &&
            bucketOrder.findIndex(r => r == read) < 0)
        {
            for (const [wordId, word] of wordMap)
                othersBucket.set(wordId, word)

            readingBuckets.delete(read)
        }
    }

    if (othersBucket.size > 0)
        readingBuckets.set("", othersBucket)


    let hasCommonWord = false
    let dbBuckets: Api.KanjiWordCrossRef.ReadingBucket[] = []
    for (const [reading, wordMap] of readingBuckets)
    {
        let words = [...wordMap.values()]
        words.sort((a, b) => {
            const commonSort = b.commonScore - a.commonScore
            if (commonSort != 0)
                return commonSort
                
            return b.score - a.score
        })

        const entries: Api.KanjiWordCrossRef.Word[] = words.map(w => {
            const entry: Api.KanjiWordCrossRef.Word = {
                furigana: w.heading.furigana,
                sense: w.sense,
            }

            if (w.commonScore >= 1)
            {
                entry.commonness =
                    w.commonScore === 2 ? 2 :
                    1

                hasCommonWord = true
            }
            
            if (w.commonScore === -1)
                entry.irregular = true

            if (w.commonScore === -2)
                entry.rare = true

            if (w.commonScore === -3)
                entry.outdated = true

            if (w.ateji)
                entry.ateji = true

            if (w.gikun)
                entry.gikun = true

            if (w.jlpt !== undefined)
                entry.jlpt = w.jlpt

            return entry
        })

        dbBuckets.push({
            reading,
            entries,
        })
    }

    const bucketGetOrder = (reading: string) =>
    {
        if (!reading)
            return 10000

        const index = bucketOrder.findIndex(r => r == reading)
        if (index >= 0)
            return index

        return 9000
    }

    dbBuckets.sort((a, b) =>
    {
        const ordA = bucketGetOrder(a.reading)
        const ordB = bucketGetOrder(b.reading)

        if (ordA == 9000 && ordB == 9000)
            return a.reading.localeCompare(b.reading)

        return ordA - ordB
    })

    // Sort once more by the number of common words in each bucket.
    const bucketCommonness = new Map<string, number>()
    for (const dbBucket of dbBuckets)
    {
        const score = dbBucket.reading === "" ?
            -1 :            
            dbBucket.entries
                .reduce((s, entry) =>
                    s + (entry.commonness !== undefined ||
                        entry.jlpt !== undefined ?
                        1 :
                        0),
                    0)
        
        bucketCommonness.set(dbBucket.reading, score)
    }

    dbBuckets.sort((a, b) =>
        bucketCommonness.get(b.reading)! - bucketCommonness.get(a.reading)!)


    // Build the list of reading scores.
    const readings: Api.Kanji.ReadingScore[] = []
    for (const bucket of dbBuckets)
    {
        readings.push({
            reading: Kana.toHiragana(bucket.reading),
            score:
                (apiKanji.score ?? 0) +
                5 * Math.min(500, bucket.entries.length),
        })
    }

    for (const r of standardReadings)
    {
        if (readings.some(r => r.reading == r.reading))
            continue
        
        readings.push({
            reading: Kana.toHiragana(r.text),
            score: (apiKanji.score ?? 0),
        })
    }

    // Modify the base kanji entry.
    apiKanji.readings = readings

    apiKanji.wordCount = dbBuckets
        .reduce((count, bucket) => count + bucket.entries.length, 0)

    apiKanji.exampleWords =
        extractExampleSet(dbBuckets, 5)


    return [
        {
            id: kanji,
            readings: dbBuckets,
        },
        hasCommonWord,
    ]
}


/// Try to select most common words for
/// a variety of readings.
function extractExampleSet(
    buckets: Api.KanjiWordCrossRef.ReadingBucket[],
    maxWords: number)
    : Api.KanjiWordCrossRef.Word[]
{
    const exampleSet: Api.KanjiWordCrossRef.Word[] = []

    const bucketsIndex = new Map<string, number>()

    const minAttempts: [commonness: number, jlpt: number][] = [
        [2, 1],
        [2, 0],
        [1, 0],
        [0, 0],
    ]

    for (const attempt of minAttempts)
    {
        while (true)
        {
            let gotWord = false
            for (const bucket of buckets)
            {
                let index = bucketsIndex.get(bucket.reading) ?? 0
                if (index < bucket.entries.length)
                {
                    const entry = bucket.entries[index]
                    
                    if (attempt[0] === 0 ||
                        (entry.commonness === attempt[0] &&
                            (attempt[1] === 0 ||
                                entry.jlpt !== undefined)))
                    {
                        gotWord = true
                        exampleSet.push(bucket.entries[index])
                        index++
                    }
                }
                bucketsIndex.set(bucket.reading, index)
            }

            if (!gotWord)
                break
        }
    }

    return exampleSet.slice(0, maxWords)
}