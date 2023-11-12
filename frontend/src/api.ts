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
                body: !payload ? undefined : JSON.stringify(payload),
            })
        .then(res => res.json())
        .then(resolve)
    )
}


export async function authenticate()
    : Promise<Api.Authenticate.Response>
{
    const res = await post(Api.Authenticate.url, undefined)
    console.log(
        "%cApi.authenticate", "color: white; background-color: magenta;",
        res)
    return res
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


export async function studylistGetAll(
    req: Api.StudylistGetAll.Request)
    : Promise<Api.StudylistGetAll.Response>
{
    const res = await post(Api.StudylistGetAll.url, req)
    console.log(
        "%cApi.studylistGetAll", "color: white; background-color: magenta;",
        req, res)
    return res
}


export async function studylistWordAdd(
    req: Api.StudylistWordAdd.Request)
    : Promise<Api.StudylistWordAdd.Response>
{
    const res = await post(Api.StudylistWordAdd.url, req)
    console.log(
        "%cApi.studylistWordAdd", "color: white; background-color: magenta;",
        req, res)
    return res
}


export async function studylistWordRemoveMany(
    req: Api.StudylistWordRemoveMany.Request)
    : Promise<Api.StudylistWordRemoveMany.Response>
{
    const res = await post(Api.StudylistWordRemoveMany.url, req)
    console.log(
        "%cApi.studylistWordRemoveMany", "color: white; background-color: magenta;",
        req, res)
    return res
}