import * as Express from "express"
import * as DbWord from "common/db_word.ts"
import * as Api from "common/api.ts"


export function init(app: Express.Application)
{
    app.post("/api/v1/search", async (req, res) => {

        const body = req.body as Api.SearchRequest

        if (typeof body.query !== "string")
        {
            res.sendStatus(400)
            return
        }
        
        const entries = await search(body)

        res.send(entries)
    })
}


async function search(
    req: Api.SearchRequest)
    : Promise<Api.SearchResponse>
{
    return { entries: [] }
}