export namespace Search
{
    export const matchQuery = "query"

    export const url = (query: string) => `/search/${ encodeURIComponent(query) }`
    export const urlPattern = `/search/:${ matchQuery }`
}