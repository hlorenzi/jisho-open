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
    const query = req.query.toLowerCase()
    const queryAllJapanese = Kana.toKana(query)
    const queryAllHiragana = Kana.toHiragana(query)

    console.log(query, queryAllJapanese, queryAllHiragana)

    const byHeading = db.searchByHeading([query, queryAllJapanese, queryAllHiragana])
    const byHeadingPrefix = db.searchByHeadingPrefix([query, queryAllJapanese])

    const inflections = Inflection.breakdown(queryAllJapanese)
    const byInflections = db.searchByInflections(inflections)

    const byDefinition = db.searchByDefinition(query)

    const translateToSearchEntry = (word: Api.Word.Entry): Api.Search.Entry =>
        ({ ...word, type: "word" })

    const searchEntries: Api.Search.Entry[] = [
        { type: "section", section: "verbatim" },
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