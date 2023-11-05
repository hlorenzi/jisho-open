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
        query.tags.size === 0)
        return { entries: [] }

    console.dir(query, { depth: null })

    const byTags =
        query.forcedType !== "tags" ?
            [] :
            db.searchByTags(
                query.tags,
                query.inverseTags)

    const byHeading =
        query.forcedType !== "none" && query.forcedType !== "verbatim" ?
            [] :
            db.searchByHeading(
                [query.str, query.strJapanese, query.strHiragana],
                query.tags,
                query.inverseTags)

    const byHeadingPrefix =
        query.forcedType !== "none" && query.forcedType !== "prefix" ?
            [] :
            db.searchByHeadingPrefix(
                [query.str, query.strJapanese],
                query.tags,
                query.inverseTags)

    const byInflections = 
        query.forcedType !== "none" && query.forcedType !== "inflected" ?
            [] :
            db.searchByInflections(
                Inflection.breakdown(query.strJapanese),
                query.tags,
                query.inverseTags)

    const byDefinition =
        query.forcedType !== "none" && query.forcedType !== "definition" ?
            [] :
            db.searchByDefinition(
                query.strInQuotes || query.str,
                query.tags,
                query.inverseTags)

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

    return { entries: searchEntries }
}


type QueryForcedType =
    | "none"
    | "tags"
    | "verbatim"
    | "inflected"
    | "prefix"
    | "definition"


type Query = {
    forcedType: QueryForcedType
    str: string
    strJapanese: string
    strHiragana: string
    strInQuotes: string
    tags: Set<string>
    inverseTags: Set<string>
}


function normalizeQuery(queryRaw: string): Query
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

    let forcedType: QueryForcedType = "none"
    if (queryInQuotes.length !== 0)
        forcedType = "definition"
    if (queryWithoutTags.length === 0 &&
        tags.length > 0)
        forcedType = "tags"

    return {
        forcedType,
        str: queryWithoutTags,
        strJapanese: queryJapanese,
        strHiragana: queryHiragana,
        strInQuotes: queryInQuotes,
        tags: new Set<string>(trueTags),
        inverseTags: new Set<string>(inverseTags),
    }
}