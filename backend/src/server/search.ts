import * as Express from "express"
import * as Db from "../db/index.ts"
import * as Api from "common/api/index.ts"
import * as Kana from "common/kana.ts"
import * as Inflection from "common/inflection.ts"


export function init(
    app: Express.Application,
    db: Db.Db)
{
    app.post(Api.Search.url, async (req, res) => {

        const body = req.body as Api.Search.Request

        if (typeof body.query !== "string")
        {
            res.sendStatus(400)
            return
        }
        
        const entries = await search(db, body)

        res.send(entries)
    })
}


async function search(
    db: Db.Db,
    req: Api.Search.Request)
    : Promise<Api.Search.Response>
{
    const query = normalizeQuery(req.query)
    if (query.str.length === 0 &&
        query.tags.length === 0)
        return { query, entries: [] }

    console.dir(query, { depth: null })

    const tagsSet = new Set<string>(query.tags)
    const inverseTagsSet = new Set<string>(query.inverseTags)

    const byTags =
        query.type !== "tags" ?
            [] :
            db.searchByTags(
                tagsSet,
                inverseTagsSet)

    const byWildcards =
        query.type !== "wildcards" ?
            [] :
            db.searchByWildcards(
                [query.strWildcards, query.strWildcardsHiragana],
                tagsSet,
                inverseTagsSet)

    const byHeading =
        query.type !== "any" && query.type !== "verbatim" ?
            [] :
            db.searchByHeading(
                [query.str, query.strJapanese, query.strHiragana],
                tagsSet,
                inverseTagsSet)

    const byHeadingPrefix =
        query.type !== "any" && query.type !== "prefix" ?
            [] :
            db.searchByHeadingPrefix(
                [query.str, query.strJapanese],
                tagsSet,
                inverseTagsSet)

    const byInflections = 
        query.type !== "any" && query.type !== "inflected" ?
            [] :
            db.searchByInflections(
                Inflection.breakdown(query.strJapanese),
                tagsSet,
                inverseTagsSet)

    const byDefinition =
        !query.searchDefinitions &&
        query.type !== "any" && query.type !== "definition" ?
            [] :
            db.searchByDefinition(
                query.strInQuotes || query.str,
                tagsSet,
                inverseTagsSet)

    const byKanji =
        query.type !== "any" && query.type !== "kanji" ?
            [] :
        !Kana.hasKanji(query.str) ?
            db.searchKanji(
                extractKanjiFromFirstHeadings(await byHeading, 3).join(""),
                new Set<string>(),
                new Set<string>())
        :
            db.searchKanji(
                [...new Set(query.kanji)].join(""),
                tagsSet,
                inverseTagsSet)

    const translateToSearchWordEntry = (word: Api.Word.Entry): Api.Search.Entry =>
        ({ ...word, type: "word" })

    const translateToSearchKanjiEntry = (kanji: Api.Kanji.Entry): Api.Search.Entry =>
        ({ ...kanji, type: "kanji" })

    const searchEntries: Api.Search.Entry[] = [
        { type: "section", section: "verbatim" },
        ...(await byHeading).map(translateToSearchWordEntry),
        ...(await byTags).map(translateToSearchWordEntry),
        ...(await byWildcards).map(translateToSearchWordEntry),
        { type: "section", section: "inflected" },
        ...(await byInflections).map(translateToSearchWordEntry),
        { type: "section", section: "prefix" },
        ...(await byHeadingPrefix).map(translateToSearchWordEntry),
        { type: "section", section: "definition" },
        ...(await byDefinition).map(translateToSearchWordEntry),
        { type: "section", section: "kanji" },
        ...(await byKanji).map(translateToSearchKanjiEntry),
    ]

    // Remove empty section markers
    for (let i = searchEntries.length - 1; i >= 0; i--)
    {
        if (searchEntries[i].type === "section")
        {
            if (i + 1 >= searchEntries.length ||
                searchEntries[i + 1].type === "section")
                searchEntries.splice(i, 1)
        }
    }

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

    const queryNormalized = Kana.normalizeWidthForms(queryRaw)
        .trim()
        .toLowerCase()
        .replace(regexFancyQuotes, "\"")

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
        .trim()
    
    const queryHasWildcards =
        queryWithoutTags.indexOf("*") >= 0 ||
        queryWithoutTags.indexOf("?") >= 0
        
    const queryCanBeEnglish =
        !Kana.hasJapanese(queryWithoutTags) ||
        queryInQuotes.length !== 0

    const queryJapanese = Kana.toKana(queryWithoutTags)
    const queryHiragana = Kana.toHiragana(queryWithoutTags)
    const queryKanji = [...queryWithoutTags]
        .filter(c => Kana.isKanji(c))

    const queryWildcards = queryHasWildcards ?
        queryWithoutTags.replace(/[-.+^${}()|!&%#[\]\\]/g, "") :
        ""
        
    const queryWildcardsHiragana = Kana.toHiragana(queryWildcards)

    let type: Api.Search.QueryType = "any"
    if (queryInQuotes.length !== 0)
        type = "definition"
    if (tags.some(tag => tag === "k" || tag === "kanji"))
        type = "kanji"
    if (queryWithoutTags.length === 0 &&
        tags.length > 0)
        type = "tags"
    if (queryWildcards.length !== 0)
        type = "wildcards"

    const tagsToRemove = new Set(["k", "kanji"])
    tags = tags.filter(tag => !tagsToRemove.has(tag))
    inverseTags = inverseTags.filter(tag => !tagsToRemove.has(tag))

    return {
        type,
        str: queryWithoutTags,
        strJapanese: queryJapanese,
        strHiragana: queryHiragana,
        strInQuotes: queryInQuotes,
        strWildcards: queryWildcards,
        strWildcardsHiragana: queryWildcardsHiragana,
        kanji: queryKanji,
        searchDefinitions: queryCanBeEnglish,
        tags,
        inverseTags,
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
            for (const c of heading.base)
            {
                if (Kana.isKanji(c))
                    kanji.add(c)
            }
        }
    }

    return [...kanji]
}