import * as Express from "express"
import * as Db from "../db/index.ts"
import * as Api from "common/api/index.ts"
import * as Kana from "common/kana.ts"
import * as Inflection from "common/inflection.ts"


export function init(
    app: Express.Application,
    db: Db.Db)
{
    app.post(Api.KanjiWords.url, async (req, res) => {

        const body = req.body as Api.KanjiWords.Request

        if (typeof body.kanji !== "string")
        {
            res.sendStatus(400)
            return
        }
        
        const entries = await getKanjiWords(db, body)

        res.send(entries)
    })
}


async function getKanjiWords(
    db: Db.Db,
    req: Api.KanjiWords.Request)
    : Promise<Api.KanjiWords.Response>
{
    const kanjiArray = [...req.kanji]
    if (kanjiArray.length !== 1 ||
        !Kana.hasKanji(kanjiArray[0]))
        return { query: kanjiArray[0], kanji: [], entries: [] }

    const kanji = db.searchKanji(kanjiArray[0], new Set(), new Set())
    const entries = db.listKanjiWordCrossRefEntries(kanjiArray[0])

    return {
        query: kanjiArray[0],
        kanji: await kanji,
        entries: await entries,
    }
}