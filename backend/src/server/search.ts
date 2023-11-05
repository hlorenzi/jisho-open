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
        query.type !== "any" && query.type !== "definition" ?
            [] :
            db.searchByDefinition(
                query.strInQuotes || query.str,
                tagsSet,
                inverseTagsSet)

    const translateToSearchEntry = (word: Api.Word.Entry): Api.Search.Entry =>
        ({ ...word, type: "word" })

    const searchEntries: Api.Search.Entry[] = [
        { type: "section", section: "verbatim" },
        ...(await byTags).map(translateToSearchEntry),
        ...(await byHeading).map(translateToSearchEntry),
        { type: "section", section: "inflected" },
        ...(await byInflections).map(translateToSearchEntry),
        { type: "section", section: "prefix" },
        ...(await byHeadingPrefix).map(translateToSearchEntry),
        { type: "section", section: "definition" },
        ...(await byDefinition).map(translateToSearchEntry),
    ]

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

    const queryInQuotes = (queryNormalized.match(regexQuoted) ?? [])
        .join(" ")
        .replace(regexPunctuationToSplit, " ")
        .replace(regexPunctuationToCollapse, "")
        .trim()

    /*const queryNonQuoted = query
        .replace(regexQuoted, " ")
        .replace(regexTags, " ")
        .replace(regexPunctuationToSplit, " ")
        .replace(regexPunctuationToCollapse, "")
        .trim()

    const queryQuotedSplit = queryQuoted
        .split(/\s/g)
        .map(s => s.trim())
        .filter(s => s.length !== 0)*/
    
    //const queryNonQuotedSplit = queryNonQuoted.split(/\s/g).map(s => s.trim()).filter(s => !!s)
    
    const tags = (queryNormalized.match(regexTags) ?? [])
        .map(t => t.substring("#".length))
    
    const trueTags = tags
        .filter(t => t.indexOf("!") < 0)

    const inverseTags = tags
        .filter(t => t.indexOf("!") >= 0)
        .map(t => t.substring("!".length))

    const queryWithoutTags = queryNormalized
        .replace(regexTags, " ")
        .trim()
    
    const queryJapanese = Kana.toKana(queryWithoutTags)
    const queryHiragana = Kana.toHiragana(queryWithoutTags)

    let type: Api.Search.QueryType = "any"
    if (queryInQuotes.length !== 0)
        type = "definition"
    if (queryWithoutTags.length === 0 &&
        tags.length > 0)
        type = "tags"

    return {
        type,
        str: queryWithoutTags,
        strJapanese: queryJapanese,
        strHiragana: queryHiragana,
        strInQuotes: queryInQuotes,
        tags: trueTags,
        inverseTags,
    }
}