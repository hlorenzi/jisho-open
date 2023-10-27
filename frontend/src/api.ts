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
    return post(Api.Search.url, req)
}