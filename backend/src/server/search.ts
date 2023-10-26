import * as Express from "express"
import * as Db from "../db/index.ts"
import * as Api from "common/api/index.ts"
import * as Kana from "common/kana.ts"


export function init(
    app: Express.Application,
    db: Db.Db)
{
    app.post("/api/v1/search", async (req, res) => {

        const body = req.body as Api.SearchRequest

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
    req: Api.SearchRequest)
    : Promise<Api.SearchResponse>
{
    const queryWithoutTags = req.query
    const queryAllHiragana = Kana.toHiragana(req.query)
    console.log(req.query, queryAllHiragana)

    const entries = await db.searchByHeading([queryWithoutTags, queryAllHiragana])
    
    return { entries }
}