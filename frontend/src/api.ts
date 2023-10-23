import * as Api from "common/api.ts"
export * from "common/api.ts"


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
    req: Api.SearchRequest)
    : Promise<Api.SearchResponse>
{
    return post("api/v1/search", req)
}