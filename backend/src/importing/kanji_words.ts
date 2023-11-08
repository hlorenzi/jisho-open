import * as Db from "../db/index.ts"
import * as Logging from "./logging.ts"
import * as Api from "common/api/index.ts"
import * as Kana from "common/kana.ts"
import * as Furigana from "common/furigana.ts"
import * as JmdictTags from "common/jmdict_tags.ts"


export async function crossReferenceKanjiWords(
    logger: Logging.Logger,
    db: Db.Db)
{
    logger.writeLn("cross-referencing kanji and word entries...")

    const kanjiEntries = await db.listAllKanji()

    type WorkingData = {
        heading: Api.Word.Heading
        score: number
        commonScore: number
        priority: number
        jlpt?: 5 | 4 | 3 | 2 | 1
        sense: string
    }

    await Logging.loopWithProgress(
        logger,
        kanjiEntries,
        async (kanjiEntry) =>
    {
        const kanji = kanjiEntry.id

        const words = await db.listWordsWithChars([kanji])

        const readingBuckets = new Map<string, Map<string, WorkingData>>()

        const getPossibleReadings = (read: string) =>
        {
            read = read.replace(/～/g, "")

            let readings = [Kana.toHiragana(read)]
            // TODO: Maybe also use Furigana.getPossibleRendaku
            return readings
        }

        const setReadingCommonness = (str: string | undefined, commonness: Api.Kanji.CommonnessIndex) =>
        {
            if (str === undefined)
                return
            
            for (const r of kanjiEntry.kunyomi)
            {
                if (getPossibleReadings(r.text).some(rr => rr == str) &&
                    (r.commonness === undefined || r.commonness < commonness))
                    r.commonness = commonness
            }

            for (const r of kanjiEntry.onyomi)
            {
                if (getPossibleReadings(r.text).some(rr => rr == str) &&
                    (r.commonness === undefined || r.commonness < commonness))
                    r.commonness = commonness
            }
        }

        for (const word of words)
        {
            //if (word.pos.includes("name"))
            //    continue

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

        const standardReadings = [...kanjiEntry.kunyomi, ...kanjiEntry.onyomi]
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
                    entry.commonness =
                        w.commonScore === 2 ? 2 :
                        1
                
                if (w.commonScore === -1)
                    entry.irregular = true

                if (w.commonScore === -2)
                    entry.rare = true

                if (w.commonScore === -3)
                    entry.outdated = true

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
            const score = dbBucket.entries
                .reduce((s, entry) => s + (entry.commonness !== undefined || entry.jlpt !== undefined ? 1 : 0), 0)
            
            bucketCommonness.set(dbBucket.reading, score)
        }

        dbBuckets.sort((a, b) =>
            bucketCommonness.get(b.reading)! - bucketCommonness.get(a.reading)!)

        if (dbBuckets.length > 0)
        {
            await db.importKanjiWordCrossRefEntries([{
                id: kanji,
                readings: dbBuckets,
            }])
        }

        /*const luRead = []
        for (const bucket of dbBuckets)
        {
            luRead.push({
                str: bucket.read,
                score: kanjiEntry.score + 5 * Math.min(500, bucket.entries.length),
            })
        }

        for (const r of standardReadings)
        {
            if (luRead.find(r => r.str == r))
                continue
            
            luRead.push({
                str: r,
                score: kanjiEntry.score,
            })
        }*/

        kanjiEntry.wordCount = dbBuckets
            .reduce((count, bucket) => count + bucket.entries.length, 0)

        kanjiEntry.exampleWords =
            extractExampleSet(dbBuckets, 5)

        await db.importKanjiEntries([kanjiEntry])
    })
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