import * as Express from "express"
import * as Db from "../db/index.ts"
import * as Api from "common/api/index.ts"


export function init(
    app: Express.Application,
    db: Db.Interface)
{
    app.post(Api.HandwritingGet.url, async (req, res) => {

        const body = req.body as Api.HandwritingGet.Request

        if (!Array.isArray(body.strokes) ||
            !body.strokes.every(stroke =>
                Array.isArray(stroke) &&
                stroke.every(array =>
                    Array.isArray(array) &&
                    array.every(p => typeof p === "number")
                )))
        {
            res.sendStatus(400)
            return
        }
        
        const result = await handwritingGet(body)
        res.send(result)
    })
}


export async function handwritingGet(
    req: Api.HandwritingGet.Request)
    : Promise<Api.HandwritingGet.Response>
{
    if (req.strokes.length === 0 ||
        req.strokes.length > 100)
        return { results: [] }

    const payload = {
        itc: "ja-t-i0-handwrit",
        app_version: 0.4,
        api_level: "537.36",
        device: "5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
        input_type: "0",
        options: "enable_pre_space",
        requests: [
            {
                writing_guide: {
                    writing_area_width: 1,
                    writing_area_height: 1,
                },
                pre_context: "",
                max_num_results: 5,
                max_completions: 0,
                language: "ja",
                ink: req.strokes,
            }
        ],
    }

    const res = await fetch(
        "https://inputtools.google.com/request?itc=ja-t-i0-handwrit&app=jsapi",
        {
            "headers": {
                "accept": "*/*",
                "cache-control": "no-cache",
                "content-type": "application/json; charset=UTF-8",
                "pragma": "no-cache",
            },
            "body": JSON.stringify(payload),
            "method": "POST",
        })

    type Response = [
        resultCode: string,
        result: [
            result: [
                code: string,
                results: string[],
            ]
        ]
    ]

    const json: Response = await res.json()
    
    if (json[0] !== "SUCCESS")
        throw Api.Error.internal

    const results = (json[1][0][1] ?? []).slice(0, 5)
    return { results }
}