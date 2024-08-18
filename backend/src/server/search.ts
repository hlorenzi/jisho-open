import * as Express from "express"
import * as Db from "../db/index.ts"
import * as Morpho from "./morpho.ts"
import * as Api from "common/api/index.ts"
import * as Kana from "common/kana.ts"
import * as Inflection from "common/inflection.ts"


export function init(
    app: Express.Application,
    db: Db.Interface)
{
    app.post(Api.Search.url, async (req, res) => {

        const body = req.body as Api.Search.Request

        if (typeof body.query !== "string")
        {
            res.sendStatus(400)
            return
        }

        if (typeof body.limit !== "undefined" &&
            typeof body.limit !== "number")
        {
            res.sendStatus(400)
            return
        }
        
        res.send(await search(db, body))
        db.analyticsAdd("search", 1)
    })
}


export async function search(
    db: Db.Interface,
    req: Api.Search.Request)
    : Promise<Api.Search.Response>
{
    const query = normalizeQuery(req.query)
    query.limit = req.limit

    const sectionEnd: Api.Search.Entry = {
        type: "section",
        section: "end",
    }

    if (query.str.length === 0 &&
        query.tags.length === 0)
        return { query, entries: [sectionEnd] }

    //console.dir(query, { depth: null })

    const options: Db.SearchOptions = {
        limit: req.limit ?? 1000,
        tags: new Set<string>(query.tags),
        inverseTags: new Set<string>(query.inverseTags),
    }

    const optionsNoTags: Db.SearchOptions = {
        ...options,
        tags: new Set<string>(),
        inverseTags: new Set<string>(),
    }

    const byTags =
        query.type !== "tags" ?
            [] :
            db.searchByTags(options)

    const byWildcards =
        !query.canBeWildcards ?
            [] :
        query.type !== "wildcards" ?
            [] :
            db.searchByWildcards(
                [query.strWildcards, query.strWildcardsHiragana],
                options)

    const byHeading =
        query.type !== "any" && query.type !== "verbatim" ?
            [] :
        query.strSplit.length >= 2 ?
            [] :
            db.searchByHeading(
                [query.str, query.strJapanese, query.strHiragana],
                options)

    const byHeadingAll =
        query.type !== "any" && query.type !== "verbatim" ?
            [] :
        query.strSplit.length < 2 ?
            [] :
            db.searchByHeadingAll(
                query.strSplit,
                options)

    const byHeadingPrefix =
        query.type !== "any" && query.type !== "prefix" ?
            [] :
            db.searchByHeadingPrefix(
                [query.str, query.strJapanese],
                options)

    const byInflections = 
        query.type !== "any" && query.type !== "inflected" ?
            [] :
            db.searchByInflections(
                query.inflectionBreakdown,
                query.inflectionOf,
                options)

    const byDefinition =
        !query.canBeDefinition ?
            [] :
        query.type !== "any" && query.type !== "definition" ?
            [] :
            db.searchByDefinition(
                query.strInQuotes.length !== 0 ?
                    query.strInQuotesSplit :
                    query.strSplit,
                options)

    const byKanji =
        query.type !== "any" && query.type !== "kanji" ?
            [] :
        query.type === "any" && !Kana.hasKanji(query.str) ?
            db.searchKanji(
                extractKanjiFromFirstHeadings(
                    [...await byHeading, ...await byInflections], 1)
                    .join(""),
                optionsNoTags)
        :
            db.searchKanji(
                [...new Set(query.kanji)].join(""),
                optionsNoTags)

    const byKanjiComponents =
        query.type !== "components" ?
            [] :
        db.searchKanjiByComponents(
            [...new Set(query.components)],
            false)

    const byKanjiReading =
        query.type !== "kanji" ?
            [] :
        db.searchKanjiByReading(
            query.strJapaneseSplit.map(q => Kana.toHiragana(q)),
            optionsNoTags)

    const byKanjiMeaning =
        query.type !== "kanji" ?
            [] :
        db.searchKanjiByMeaning(
            query.strInQuotes.length !== 0 ?
                query.strInQuotesSplit :
                query.strSplit,
            optionsNoTags)

    const bySentence =
        !query.canBeSentence ?
            undefined :
        query.type !== "any" &&
        query.type !== "sentence" &&
        query.type !== "wildcards" ?
            undefined :
        options.tags?.has("name") ?
            undefined :
        (await byHeading).length !== 0 ||
        (await byHeadingAll).length !== 0 ||
        (await byTags).length !== 0 ||
        (await byWildcards).length !== 0 ||
        (await byDefinition).length !== 0 ||
        (await byInflections).length !== 0 ||
        (await byHeadingPrefix).length !== 0 ?
            undefined :
            Morpho.tokenize(db, query.strJapanese)


    const translateToSearchWordEntry = (word: Api.Word.Entry): Api.Search.Entry =>
        ({ ...word, type: "word" })

    const translateToSearchKanjiEntry = (kanji: Api.Kanji.Entry): Api.Search.Entry =>
        ({ ...kanji, type: "kanji" })

    const translateToSearchSentenceEntry = (sentence: Api.Search.SentenceAnalysis): Api.Search.Entry =>
        ({ ...sentence, type: "sentence" })

    const kanjiEntries: Api.Search.Entry[] = [
        { type: "section", section: "kanji" },
        ...(await byKanji).map(translateToSearchKanjiEntry),
        ...(await byKanjiComponents).map(translateToSearchKanjiEntry),
        ...(await byKanjiReading).map(translateToSearchKanjiEntry),
        ...(await byKanjiMeaning).map(translateToSearchKanjiEntry),
    ]

    let searchEntries: Api.Search.Entry[] = [
        { type: "section", section: "verbatim" },
        ...(await byHeading).map(translateToSearchWordEntry),
        ...(await byHeadingAll).map(translateToSearchWordEntry),
        ...(await byTags).map(translateToSearchWordEntry),
        ...(await byWildcards).map(translateToSearchWordEntry),
        { type: "section", section: "inflected" },
        ...(await byInflections).map(translateToSearchWordEntry),
        { type: "section", section: "definition" },
        ...(await byDefinition).map(translateToSearchWordEntry),
    ]

    // Put prefix results before kanji if they're the only results
    if (searchEntries.length === 3)
    {
        searchEntries.push(
            { type: "section", section: "prefix" },
            ...(await byHeadingPrefix).map(translateToSearchWordEntry),
            ...kanjiEntries)
    }
    else
    {
        searchEntries.push(
            ...kanjiEntries,
            { type: "section", section: "prefix" },
            ...(await byHeadingPrefix).map(translateToSearchWordEntry))
    }

    // Push the end section
    searchEntries.push(sectionEnd)

    // Remove duplicate entries.
    const seenEntryIds = new Set<string>()
    searchEntries = searchEntries.filter(e => {
        if (e.type !== "word")
            return true

        if (seenEntryIds.has(e.id))
            return false

        seenEntryIds.add(e.id)
        return true
    })

    // Repeat query including names.
    if (searchEntries.length <= 5 + kanjiEntries.length &&
        !options.tags?.has("name") &&
        !query.explicitNotName)
    {
        const searchWithNames = await search(
            db,
            {
                ...req,
                query: req.query + " #name"
            })

        searchEntries = searchWithNames.entries
    }

    // Insert sentence entry in the first spot, if available.
    if (bySentence !== undefined &&
        (await bySentence).tokens.length > 1)
    {
        searchEntries.unshift(...[
            { type: "section", section: "sentence" } satisfies Api.Search.Entry,
            translateToSearchSentenceEntry(await bySentence),
        ])
    }

    // Limit resulting entries, ignoring section headers
    let limitCount = 0
    let limitAt = 0
    while (limitCount < options.limit && limitAt < searchEntries.length)
    {
        if (searchEntries[limitAt].type === "section")
        {
            limitAt++
            continue
        }

        limitAt++
        limitCount++
    }
    
    searchEntries = searchEntries.slice(0, limitAt)

    // Remove empty section markers.
    for (let i = searchEntries.length - 1; i >= 0; i--)
    {
        const entry = searchEntries[i]

        if (entry.type === "section" &&
            entry.section !== "end")
        {
            if (i + 1 >= searchEntries.length ||
                searchEntries[i + 1].type === "section")
                searchEntries.splice(i, 1)
        }
    }

    // Add a continue section if applicable.
    const lastEntry = searchEntries[searchEntries.length - 1]
    if (lastEntry !== undefined &&
        (lastEntry.type !== "section" || lastEntry.section !== "end"))
        searchEntries.push({ type: "section", section: "continue" })

    return {
        query,
        entries: searchEntries,
    }
}


function normalizeQuery(queryRaw: string): Api.Search.Query
{
    const regexFancyQuotes = /\“|\”|\„|\‟|\＂/g
    const regexQuoted = /\"(.*?)\"/g
    const regexTags = /\#[!]?[-0-9A-Za-z]+/g
    const regexPunctuationToSplit = /\(|\)|\,|\.|\/|\"/g
    const regexPunctuationToCollapse = /\-|\'/g
    const regexRemove = /[\.\+\^\$\%\|\;\:\{\}\[\]\(\)\/\\]/g

    const queryRawLimited = queryRaw.substring(0, 250)

    const queryNormalized = Kana.normalizeWidthForms(queryRawLimited)
        .trim()
        .replace(regexFancyQuotes, "\"")
        .replace(regexRemove, " ")

    const queryNormalizedLowercase = queryNormalized
        .toLowerCase()

    const rawTags = (queryNormalized.match(regexTags) ?? [])
        .map(t => t.substring("#".length))
    
    let tags = rawTags
        .filter(t => t.indexOf("!") < 0)

    let inverseTags = rawTags
        .filter(t => t.indexOf("!") >= 0)
        .map(t => t.substring("!".length))
    
    const queryWithoutTags = queryNormalized
        .replace(regexTags, " ")
        .trim()
    
    const queryInQuotes = (queryWithoutTags.match(regexQuoted) ?? [])
        .join(" ")
        .replace(regexPunctuationToSplit, " ")
        .replace(regexPunctuationToCollapse, "")
        .toLowerCase()
        .trim()

    const queryNotInQuotes = queryWithoutTags
        .replace(regexQuoted, " ")
        .replace(regexTags, " ")
        .replace(regexPunctuationToSplit, " ")
        .trim()

    const queryCanBeWildcards =
        queryNotInQuotes.indexOf("*") >= 0 ||
        queryNotInQuotes.indexOf("?") >= 0
        
    const queryJapanese = Kana.toKana(queryNotInQuotes, { ignoreJapanese: true })
    const queryHiragana = Kana.toHiragana(queryNotInQuotes)

    const queryKanji = [...queryNotInQuotes]
        .filter(c => Kana.isKanji(c))

    const queryComponents = [...queryNotInQuotes]
        .filter(c => Kana.isKanji(c) || Kana.isJapanese(c))

    const queryWildcards = queryCanBeWildcards ?
        queryNotInQuotes :
        ""
        
    const queryWildcardsHiragana = Kana.toHiragana(queryWildcards)

    const queryWithoutTagsSplit = queryWithoutTags
        .replace(regexPunctuationToSplit, " ")
        .replace(regexPunctuationToCollapse, "")
        .toLowerCase()
        .split(/\s/)
        .map(s => s.trim())
        .filter(s => s.length !== 0)
    
    const queryJapaneseSplit = queryJapanese
        .split(/\s/)
        .map(s => s.trim())
        .filter(s => s.length !== 0)
    
    const queryInQuotesSplit = queryInQuotes
        .split(/\s/)
        .map(w => w.trim().toLowerCase())
        .filter(w => w.length !== 0)

    const inflectionBreakdown = Inflection.breakdown(queryJapanese)
    const inflectionOf = Inflection.flattenBreakdown(inflectionBreakdown)

    const queryCanBeDefinition =
        !Kana.hasJapanese(queryWithoutTags) ||
        queryInQuotes.length !== 0

    const queryCanBeSentence =
        !inverseTags.some(tag => tag === "sentence")

    let type: Api.Search.QueryType = "any"
    if (queryInQuotes.length !== 0)
        type = "definition"
    if (queryWithoutTags.length === 0 &&
        tags.length > 0)
        type = "tags"
    if (queryWildcards.length !== 0)
        type = "wildcards"
    if (tags.some(tag => tag === "sentence"))
        type = "sentence"
    if (tags.some(tag => tag === "k" || tag === "kanji"))
        type = "kanji"
    if (tags.some(tag => tag === "c" || tag === "components"))
        type = "components"

    const tagsToRemove = new Set(["k", "kanji", "sentence"])
    tags = tags.filter(tag => !tagsToRemove.has(tag))
    inverseTags = inverseTags.filter(tag => !tagsToRemove.has(tag))

    const explicitNotName = inverseTags.some(t => t === "name")

    if (!tags.some(t =>
            t === "name" ||
            Api.Word.partOfSpeechNameTags.includes(t as any)))
        inverseTags.push("name")

    return {
        type,
        strRaw: queryRawLimited,
        str: queryWithoutTags,
        strSplit: queryWithoutTagsSplit,
        strJapanese: queryJapanese,
        strJapaneseSplit: queryJapaneseSplit,
        strHiragana: queryHiragana,
        strInQuotes: queryInQuotes,
        strInQuotesSplit: queryInQuotesSplit,
        strWildcards: queryWildcards,
        strWildcardsHiragana: queryWildcardsHiragana,
        kanji: queryKanji,
        components: queryComponents,
        inflectionBreakdown,
        inflectionOf,
        canBeDefinition: queryCanBeDefinition && type !== "kanji",
        canBeWildcards: queryCanBeWildcards,
        canBeSentence: queryCanBeSentence,
        tags,
        inverseTags,
        explicitNotName,
    }
}


function extractKanjiFromFirstHeadings(
    entries: Api.Word.Entry[],
    maxEntries: number)
    : string[]
{
    const kanji = new Set<string>()

    for (let e = 0; e < entries.length && e < maxEntries; e++)
    {
        for (const heading of entries[e].headings)
        {
            if (heading.irregularKanji ||
                heading.irregularKana ||
                heading.irregularOkurigana ||
                heading.rareKanji ||
                heading.outdatedKanji ||
                heading.outdatedKana ||
                heading.searchOnlyKanji ||
                heading.searchOnlyKana)
                continue

            for (const c of heading.base)
            {
                if (Kana.isKanji(c))
                    kanji.add(c)
            }
        }
    }

    return [...kanji]
}