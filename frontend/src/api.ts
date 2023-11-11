import * as Api from "common/api/index.ts"
export * from "common/api/index.ts"


function post(
    endpoint: string,
    payload: any)
    : Promise<any>
{
    return new Promise<any>((resolve) =>
        fetch(
            endpoint,
            {
                method: "post",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
                body: JSON.stringify(payload),
            })
        .then(res => res.json())
        .then(resolve)
    )
}


export async function search(
    req: Api.Search.Request)
    : Promise<Api.Search.Response>
{
    const res = await post(Api.Search.url, req)
    console.log(
        "%cApi.search", "color: white; background-color: magenta;",
        req, res)
    return res
}


export async function getKanjiWords(
    req: Api.KanjiWords.Request)
    : Promise<Api.KanjiWords.Response>
{
    const res = await post(Api.KanjiWords.url, req)
    console.log(
        "%cApi.getKanjiWords", "color: white; background-color: magenta;",
        req, res)
    return res
}


export async function getKanjiByComponents(
    req: Api.KanjiByComponents.Request)
    : Promise<Api.KanjiByComponents.Response>
{
    const res = await post(Api.KanjiByComponents.url, req)
    console.log(
        "%cApi.getKanjiByComponents", "color: white; background-color: magenta;",
        req, res)
    return res
}