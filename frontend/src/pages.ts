export namespace Search
{
    export const matchQuery = "query"
    export const urlPattern = `/search/:${ matchQuery }`

    export const urlForQuery = (query: string) => `/search/${ encodeURIComponent(query) }`
}


export namespace Jmdict
{
    export const urlForWordId = (wordId: string) => {
        const jmdictId = wordId.substring("w".length)
        return `http://www.edrdg.org/jmdictdb/cgi-bin/entr.py?svc=jmdict&sid=&q=${ jmdictId }`
    }
}