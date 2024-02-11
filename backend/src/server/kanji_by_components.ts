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
    app.post(Api.KanjiByComponents.url, async (req, res) => {

        const body = req.body as Api.KanjiByComponents.Request

        if (typeof body.components !== "string")
        {
            res.sendStatus(400)
            return
        }

        if (typeof body.onlyCommon !== "boolean")
        {
            res.sendStatus(400)
            return
        }
        
        const entries = await getKanjiComponents(db, body)

        res.send(entries)
    })
}


async function getKanjiComponents(
    db: Db.Interface,
    req: Api.KanjiByComponents.Request)
    : Promise<Api.KanjiByComponents.Response>
{
    const components = [...req.components]
    const kanji = await db.searchKanjiByComponents(components, req.onlyCommon)
    kanji.sort((a, b) => a.strokeCount - b.strokeCount)
    return { kanji }
}