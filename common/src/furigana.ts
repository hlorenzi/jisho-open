import * as Kana from "./kana.ts"


function debug(fn: () => void)
{
    //fn()
}


const ignorableRegex =
    /[\・\、\。\．\＝\?\？\-\−]/g


const isIgnorable = (c: string) =>
    c == "・" || c == "、" || c == "。" || c == "．" || c == "＝" ||
    c == "?" || // ascii question mark
    c == "？" || // full-width question mark
    c == "-" || // ascii minus
    c == "−" // U+2212 MINUS SIGN


export type Furigana = FuriganaSegment[]


export type FuriganaSegment = [base: string, reading: string]


export type GetKanjiReadingFn =
    (kanji: string) => string[]


export type GetFuriganaPatchFn =
    (base: string, reading: string) => Furigana | undefined


export function extractBase(furi: Furigana): string
{
    return furi.map(part => part[0]).join("")
}


export function extractReadingPure(furi: Furigana): string
{
    return furi.map(part => part[1]).join("")
}


export function extractReading(furi: Furigana): string
{
    return furi.map(part => part[1] || part[0]).join("")
}


export const READING_SEPARATOR = ";"
export const SEGMENT_SEPARATOR = "."


export function encode(furi: Furigana): string
{
    return furi.map(part => part[0]).join(SEGMENT_SEPARATOR) +
        READING_SEPARATOR +
        furi.map(part => {
            const reading = part[1] || part[0]
            return reading === part[0] ? "" : reading
        }).join(SEGMENT_SEPARATOR)
}


export function encodeFull(furi: Furigana): string
{
    return furi.map(part => part[0]).join(SEGMENT_SEPARATOR) +
        READING_SEPARATOR +
        furi.map(part => {
            const reading = part[1] || part[0]
            return reading
        }).join(SEGMENT_SEPARATOR)
}


export function decode(encoded: string): Furigana
{
    const split = encoded.split(READING_SEPARATOR)
    if (split.length !== 2)
        throw `invalid encoded furigana: ${encoded}`

    return decodeFromParts(split[0], split[1])
}


export function decodeFromParts(
    encodedBase: string,
    encodedReading: string)
    : Furigana
{
    const bases = encodedBase.split(SEGMENT_SEPARATOR)
    const readings = encodedReading.split(SEGMENT_SEPARATOR)

    if (bases.length !== readings.length)
        throw `encoded furigana segment number mismatch: ${encodedBase}${READING_SEPARATOR}${encodedReading}`

    return bases.map((base, i) => {
        const reading = readings[i]
        return [base, reading === base ? "" : reading]
    })
}


export function decodeFromPartsPure(
    encodedBase: string,
    encodedReading: string)
    : Furigana
{
    const bases = encodedBase.split(SEGMENT_SEPARATOR)
    const readings = encodedReading.split(SEGMENT_SEPARATOR)

    if (bases.length !== readings.length)
        throw `encoded furigana segment number mismatch: ${encodedBase}${READING_SEPARATOR}${encodedReading}`

    return bases.map((base, i) => {
        const reading = readings[i]
        return [base, reading]
    })
}


/// Takes a base and reading pair, and returns a list of
/// possible furigana segmentations, based solely on the text
/// given, without resorting to kanji reading tables.
/// Adjacent kanji cannot be reasoned upon, so they are just
/// grouped together.
/// Examples:
///   (召し上がる, めしあがる) =>
///      (召.し.上.がる, め.し.あ.がる)
///
///   (黄色い声, きいろいこえ) =>
///      (黄色.い.声, きいろ.い.こえ) and
///      (黄色.い.声, き.い.ろいこえ)
export function match(
    baseRaw: string,
    readingRaw: string)
    : Furigana[]
{
    if (readingRaw.length === 0)
        return [[[baseRaw, ""]]]

    if (baseRaw.length === 0)
        return [[["", readingRaw]]]

    if (baseRaw === readingRaw)
        return [[[baseRaw, ""]]]

    const base = baseRaw//.replace(ignorableRegex, "")
    const reading = readingRaw.replace(ignorableRegex, "")

    const withAddedPart = (result: Furigana, part: FuriganaSegment): Furigana =>
    {
        if (result.length == 0)
            return [part]

        let lastPart = result[result.length - 1]
        if (lastPart[1] == "" && part[1] == "")
        {
            return [
                ...result.slice(0, result.length - 1),
                [lastPart[0] + part[0], ""]
            ]
        }

        return [...result, part]
    }

    type Attempt = {
        baseI: number
        pendingBaseI: number
        readingI: number
        result: Furigana
    }

    let attempts: Attempt[] =
        [{ baseI: 0, pendingBaseI: 0, readingI: 0, result: [] }]

    while (true)
    {
        let hadWork = false

        const newAttempts = []

        for (const attempt of attempts)
        {
            if (attempt.baseI >= base.length ||
                attempt.readingI >= reading.length)
            {
                newAttempts.push(attempt)
                continue
            }

            hadWork = true
            
            debug(() => console.log("\nattempt",
                attempt.result,
                "base[",
                base.slice(attempt.baseI),
                "] pendingBase[",
                base.slice(attempt.pendingBaseI, attempt.baseI),
                "] reading[",
                reading.slice(attempt.readingI),
                "]"))

            // Find all positions where the current base character matches
            // upcoming reading characters.
            const currentBaseChar = base[attempt.baseI]
            const matchIndices = []
            for (let i = attempt.readingI; i < reading.length; i++)
            {
                if (currentBaseChar == reading[i])
                    matchIndices.push(i)
            }

            // If no match, skip the current base character.
            /*if (isIgnorable(currentBaseChar))
            {
                debug(() => console.log("-- skip ignorable", currentBaseChar))
                let result = withAddedPart(attempt.result, [currentBaseChar, ""])
                newAttempts.push({ ...attempt, result, baseI: attempt.baseI + 1, pendingBaseI: attempt.baseI + 1 })
                continue
            }*/

            if (matchIndices.length == 0)
            {
                debug(() => console.log("-- skip", currentBaseChar))

                // We're almost done, so add the remaining
                // reading to the pending base characters.
                if (attempt.baseI + 1 >= base.length)
                {
                    const result = withAddedPart(attempt.result, 
                    [
                        base.slice(attempt.pendingBaseI),
                        reading.slice(attempt.readingI)
                    ])

                    newAttempts.push({
                        ...attempt,
                        baseI: attempt.baseI + 1,
                        readingI: reading.length,
                        pendingBaseI: attempt.baseI + 1,
                        result,
                    })

                    debug(() => console.log("---- branch",
                        result,
                        "base[",
                        base.slice(attempt.baseI + 1),
                        "] pendingBase[",
                        base.slice(attempt.baseI + 1, attempt.baseI + 1),
                        "] reading[",
                        reading.slice(reading.length),
                        "]"))

                    continue
                }

                newAttempts.push({ ...attempt, baseI: attempt.baseI + 1 })
                continue
            }

            // If there were matches, add pending base characters with
            // the reading characters up to the match position.
            for (const matchIndex of matchIndices)
            {
                debug(() => console.log("-- match for", currentBaseChar, "at", matchIndex))

                if (attempt.pendingBaseI == attempt.baseI &&
                    matchIndex > attempt.readingI)
                {
                    debug(() => console.log("---- impossible 1"))
                    continue
                }

                if (attempt.pendingBaseI < attempt.baseI &&
                    matchIndex == attempt.readingI)
                {
                    debug(() => console.log("---- impossible 2"))
                    continue
                }

                debug(() => console.log("---- add pendingBase[",
                    base.slice(attempt.pendingBaseI, attempt.baseI),
                    "] reading [",
                    reading.slice(attempt.readingI, matchIndex),
                    "]"))

                let result = attempt.result

                result = withAddedPart(result, 
                [
                    base.slice(attempt.pendingBaseI, attempt.baseI),
                    reading.slice(attempt.readingI, matchIndex)
                ])

                result = withAddedPart(result, 
                [
                    base[attempt.baseI],
                    ""
                ])

                debug(() => console.log("---- branch",
                    result,
                    "base[",
                    base.slice(attempt.baseI + 1),
                    "] pendingBase[",
                    base.slice(attempt.baseI + 1, attempt.baseI + 1),
                    "] reading[",
                    reading.slice(matchIndex + 1),
                    "]"))

                newAttempts.push({
                    ...attempt,
                    baseI: attempt.baseI + 1,
                    readingI: matchIndex + 1,
                    pendingBaseI: attempt.baseI + 1,
                    result,
                })
            }
        }

        if (!hadWork)
            break

        attempts = newAttempts
    }

    attempts = attempts.filter(
        att => att.baseI >= base.length && att.readingI >= reading.length)

    const result = attempts
        .map(att => att.result)
        .filter(f => !f.some(p => p[0] === "物" && p[1] === "も"))
    
    if (result.length === 0)
        return [[[baseRaw, readingRaw]]]
    

    // Reinsert ignored characters
    /*if (base !== baseRaw)
    {
        for (const res of result)
        {
            let segment = 0
            let segmentChar = 0
            for (let c = 0; c < baseRaw.length; c++)
            {
                const segmentBase = res[segment][0]

                if (segmentBase[segmentChar] === baseRaw[c])
                    continue

                if (segmentChar === segmentBase.length - 1)
                {
                    res.splice(segment + 1, 0, [baseRaw[c], ""])
                    continue
                }

                res[segment][0] =
                    segmentBase.slice(0, segmentChar) +
                    baseRaw[c] +
                    segmentBase.slice(segmentChar)
            }
        }
    }*/

    return result
}


/// Choose the best one out of a list of possible furigana segmentations
/// (as returned by `match`) using a table of individual
/// kanji readings, in order to split up strings of adjacent kanji.
export function revise(
    furiganaArray: Furigana[],
    getKanjiReading: GetKanjiReadingFn)
    : Furigana
{
    return getRevisionMetadata(furiganaArray, getKanjiReading).furi
}


/// Apply hand-crafted transformations to specific furigana segments
/// where the readings are rare or special, and the automated solution
/// cannot figure it out.
export function patch(
    furigana: Furigana,
    getFuriganaPatch: GetFuriganaPatchFn)
    : Furigana
{
    let hasPatch = false
    for (const p of furigana)
    {
        const patch = getFuriganaPatch(p[0], p[1])
        if (!patch)
            continue

        hasPatch = true
        break
    }

    if (!hasPatch)
        return furigana

    let newFurigana: Furigana = []
    for (const p of furigana)
    {
        const patch = getFuriganaPatch(p[0], p[1])
        if (!patch)
        {
            newFurigana.push(p)
            continue
        }

        for (const p2 of patch)
        {
            newFurigana.push(p2)
        }
    }

    return newFurigana
}


function normalize(furi: Furigana): Furigana
{
    const collapsedFuri: Furigana = []
    let collapsePrev = false
    for (const part of furi)
    {
        if (!part[1] ||
            part[0] == part[1] ||
            Kana.toHiragana(part[0]) == Kana.toHiragana(part[1]))
        {
            if (collapsePrev)
            {
                let newPart = collapsedFuri.pop()!
                newPart = [newPart[0] + part[0], newPart[1]]
                collapsedFuri.push(newPart)
            }
            else
            {
                collapsedFuri.push([part[0], ""])
                collapsePrev = true
            }
        }
        else
        {
            collapsedFuri.push(part)
            collapsePrev = false
        }
    }

    return collapsedFuri
}


interface FuriganaRevision
{
    furi: Furigana
    score: number
    hasLowScore: boolean
    hasNonMatch: boolean
    hasGoodMatch: boolean
}


function getPossibleRevisions(
    origFuri: Furigana,
    getKanjiReading: GetKanjiReadingFn)
    : FuriganaRevision
{
    const revised: FuriganaRevision = {
        furi: [],
        score: 0,
        hasLowScore: false,
        hasNonMatch: false,
        hasGoodMatch: false,
    }

    for (const part of origFuri)
    {
        if (!part[1] || part[0].length <= 1)
        {
            revised.furi.push([part[0], part[1]])
            continue
        }

        const reading = Kana.toHiragana(part[1])
        const readingOrig = part[1]
        debug(() => console.log("part", part, reading))


        const mainChars = [...part[0]]

        type Attempt = {
            main: number
            read: number
            result: Furigana
            score: number
            chars: number
            fullMatches: number
            prevKanji?: string
            hasLowScore?: boolean
            hasNonMatch?: boolean
            hasGoodMatch?: boolean
        }

        let attempts: Attempt[] = [{
            main: 0,
            read: 0,
            result: [],
            score: 0,
            chars: 0,
            fullMatches: 0,
        }]

        while (true)
        {
            let allDone = true
            let newAttempts: Attempt[] = []
            for (const attempt of attempts)
            {
                debug(() => console.log("revise attempt", attempt))

                if (attempt.main >= mainChars.length ||
                    attempt.read >= reading.length)
                {
                    newAttempts.push(attempt)
                    continue
                }

                for (let len = 7; len >= 1; len--)
                {
                    allDone = false
                    const kanji = mainChars.slice(attempt.main, attempt.main + len).join("")
                    const read = reading.slice(attempt.read)
                    const readOrig = readingOrig.slice(attempt.read)
                    let defaultReadings = getKanjiReading(kanji)
                    let restrictInvalidStart = true

                    if (kanji == "々" && attempt.prevKanji)
                        defaultReadings = getKanjiReading(attempt.prevKanji)

                    if (defaultReadings.length == 0 && len == 1)
                    {
                        defaultReadings.push(Kana.toHiragana(kanji))
                        restrictInvalidStart = false
                    }

                    if (isIgnorable(kanji))
                        defaultReadings.push("")

                    debug(() => console.log("kanji", kanji, defaultReadings))

                    if (defaultReadings.length == 0)
                        continue

                    if (restrictInvalidStart &&
                        (read.startsWith("ん") ||
                        read.startsWith("っ") ||
                        read.startsWith("ゃ") ||
                        read.startsWith("ゅ") ||
                        read.startsWith("ょ") ||
                        read.startsWith("ぁ") ||
                        read.startsWith("ぃ") ||
                        read.startsWith("ぅ") ||
                        read.startsWith("ぇ") ||
                        read.startsWith("ぉ") ||
                        read.startsWith("ー")))
                        continue

                    let noReadingMatch = true
                    if (defaultReadings)
                    {
                        let defaultReadingsScored = defaultReadings.map(r => ({ read: r, score: 1 }))
                        for (const defread of [...defaultReadingsScored])
                        {
                            const rendaku = getPossibleRendaku(defread.read)
                            for (const rend of rendaku)
                                defaultReadingsScored.push({ read: rend, score: 0.75 })
                        }

                        debug(() => console.log(JSON.stringify(defaultReadingsScored, null, 2)))

                        let matchedFully = false
                        for (const defread of defaultReadingsScored)
                        {
                            if (defread.read.length == 0 || read.startsWith(defread.read))
                            {
                                if (attempt.main + len >= mainChars.length &&
                                    attempt.read + defread.read.length >= reading.length)
                                    matchedFully = true
                                
                                noReadingMatch = false
                                newAttempts.push({
                                    main: attempt.main + len,
                                    read: attempt.read + defread.read.length,
                                    result: [...attempt.result, [kanji, readOrig.slice(0, defread.read.length)]],
                                    score: attempt.score + len + defread.read.length * 0.1 + (len > 1 ? 10 : 0),
                                    prevKanji: kanji,
                                    chars: attempt.chars + len,
                                    fullMatches: attempt.fullMatches + len,
                                    hasLowScore: !!attempt.hasLowScore || defread.score < 1,
                                    hasNonMatch: !!attempt.hasNonMatch,
                                    hasGoodMatch: true,
                                })
                                debug(() => console.log("new match", newAttempts[newAttempts.length - 1]))
                                
                                if (part[0].length <= 6)
                                {
                                    for (let i = defread.read.length + 1; i <= Math.min(defread.read.length + 2, read.length); i++)
                                    {
                                        newAttempts.push({
                                            main: attempt.main + len,
                                            read: attempt.read + i,
                                            result: [...attempt.result, [kanji, readOrig.slice(0, i)]],
                                            score: attempt.score,
                                            chars: attempt.chars + len,
                                            fullMatches: attempt.fullMatches,
                                            hasLowScore: true,
                                            hasNonMatch: !!attempt.hasNonMatch,
                                            hasGoodMatch: !!attempt.hasGoodMatch,
                                        })
                                        debug(() => console.log("new match exp", newAttempts[newAttempts.length - 1]))
                                    }
                                }
                            }
                        }

                        if (len > 1 && matchedFully)
                            break
                    }

                    if (len == 1 && part[0].length <= 6 && noReadingMatch)
                    {
                        if (attempt.read > 0 &&
                            (readOrig.startsWith("の") ||
                                readOrig.startsWith("っ")))
                        {
                            newAttempts.push({
                                main: attempt.main,
                                read: attempt.read + 1,
                                result: [...attempt.result, ["", readOrig.slice(0, 1)]],
                                score: attempt.score + 0.05,
                                chars: attempt.chars,
                                fullMatches: attempt.fullMatches,
                                hasLowScore: !!attempt.hasLowScore,
                                hasNonMatch: true,
                                hasGoodMatch: !!attempt.hasGoodMatch,
                            })
                            debug(() => console.log("new", newAttempts[newAttempts.length - 1]))
                        }

                        for (let i = 1; i <= Math.min(4, read.length); i++)
                        {
                            newAttempts.push({
                                main: attempt.main + len,
                                read: attempt.read + i,
                                result: [...attempt.result, [kanji, readOrig.slice(0, i)]],
                                score: attempt.score,
                                chars: attempt.chars + len,
                                fullMatches: attempt.fullMatches,
                                hasLowScore: !!attempt.hasLowScore,
                                hasNonMatch: true,
                                hasGoodMatch: !!attempt.hasGoodMatch,
                            })
                            debug(() => console.log("new", newAttempts[newAttempts.length - 1]))
                        }
                    }
                }
            }

            attempts = newAttempts
            if (allDone)
                break
        }

        let validAttempts = []
        for (const attempt of attempts)
        {
            const mainLength = attempt.result.reduce(
                (accum, p) => accum + p[0].length, 0)

            const readLength = attempt.result.reduce(
                (accum, p) => accum + p[1].length, 0)

            if (attempt.score > 0 &&
                attempt.fullMatches >= attempt.chars - 1 &&
                mainLength == part[0].length &&
                readLength == part[1].length)
                validAttempts.push(attempt)
        }

        if (validAttempts.length == 0)
        {
            revised.furi.push([part[0], part[1]])
            revised.hasNonMatch = true
            continue
        }

        validAttempts.sort((a, b) => b.score - a.score)

        for (const part of validAttempts[0].result)
            revised.furi.push(part)

        revised.score += validAttempts[0].score
        revised.hasLowScore = revised.hasLowScore || !!validAttempts[0].hasLowScore
        revised.hasNonMatch = revised.hasNonMatch || !!validAttempts[0].hasNonMatch
        revised.hasGoodMatch = revised.hasGoodMatch || !!validAttempts[0].hasGoodMatch
    }

    revised.furi = normalize(revised.furi)
    return revised
}


function getRevisionMetadata(
    furiganaArray: Furigana[],
    getKanjiReading: GetKanjiReadingFn)
    : FuriganaRevision
{
    const revised = furiganaArray.map(
        furi => getPossibleRevisions(furi, getKanjiReading))

    revised.sort((a, b) => b.score - a.score)
    return revised[0]
}


export function getPossibleRendaku(str: string): string[]
{
    const rendaku: string[] = []
    
    if (Kana.canReceiveDakuten(str[0]))
    {
        const newFirst = Kana.withDakuten(str[0])
        rendaku.push(newFirst + str.slice(1))

        if (newFirst === "ぢ")
            rendaku.push("じ" + str.slice(1))

        if (newFirst === "づ")
            rendaku.push("ず" + str.slice(1))
    }
    
    if (Kana.canReceiveHandakuten(str[0]))
        rendaku.push(Kana.withHandakuten(str[0]) + str.slice(1))

    if (str.endsWith("い") ||
        str.endsWith("う") ||
        str.endsWith("き") ||
        str.endsWith("く") ||
        str.endsWith("ち") ||
        str.endsWith("つ"))
        rendaku.push(str.slice(0, str.length - 1) + "っ")

    if (str.length >= 2 &&
        str.endsWith("る"))
    {
        if (Kana.vowelOf(str[str.length - 2]) === "e" ||
            Kana.vowelOf(str[str.length - 2]) === "i")
            rendaku.push(str.slice(0, str.length - 1))
    }

    if (Kana.vowelOf(str[str.length - 1]) === "u")
    {
        rendaku.push(
            str.slice(0, str.length - 1) +
                Kana.withVowel(str[str.length - 1], "i"))
            
        rendaku.push(
            str.slice(0, str.length - 1) +
                Kana.withVowel(str[str.length - 1], "e"))
    }
    
    return rendaku
}