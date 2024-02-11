import * as Api from "common/api/index.ts"


export namespace LoginFake
{
    export const urlPattern = Api.Login.urlFrontendFake
}


export namespace Log
{
    export const url = `/log`
}


export namespace Search
{
    export const matchQuery = "query"
    export const matchToken = "token"
    export const urlPattern = `/search/:${ matchQuery }`
    export const urlPatternToken = `/search/:${ matchQuery }/:${ matchToken }`

    export const urlForQuery = (query: string) =>
        `/search/${ encodeURIComponent(query) }`
    
    export const urlForKanjiQuery = (query: string) =>
        `/search/${ encodeURIComponent(`${ query } #k`) }`
    
    export const urlForComponentsQuery = (query: string) =>
        `/search/${ encodeURIComponent(`${ query } #c`) }`
    
    export const urlForBaseReading = (base: string, reading?: string) => {
        if (!reading ||
            reading === base)
            return `/search/${ encodeURIComponent(base) }`
        else
            return `/search/${ encodeURIComponent(base) } ${ encodeURIComponent(reading)}`
    }

    export const urlForQueryToken = (query: string, token: number) =>
        `/search/${ encodeURIComponent(query) }/${ token.toString() }`
}


export namespace Jmdict
{
    export const urlForWordId = (wordId: string) => {
        const jmdictId = wordId.substring("w".length)
        return `http://www.edrdg.org/jmdictdb/cgi-bin/entr.py?svc=jmdict&sid=&q=${ jmdictId }`
    }
}


export namespace KanjiWords
{
    export const matchKanji = "kanji"
    export const urlPattern = `/words/:${ matchKanji }`

    export const urlForQuery = (query: string) =>
        `/words/${ encodeURIComponent(query) }`
}


export namespace User
{
    export const matchUserId = "userId"
    export const urlPattern = `/user/:${ matchUserId }`

    export const urlForUserId = (userId: string) =>
        `/user/${ encodeURIComponent(userId) }`
}


export namespace Studylist
{
    export const matchStudylistId = "studylistId"
    export const urlPattern = `/list/:${ matchStudylistId }`

    export const urlWith = (studylistId: string) =>
        `/list/${ encodeURIComponent(studylistId) }`
}


export namespace StudylistEditorJoin
{
    export const matchStudylistId = "studylistId"
    export const matchPassword = "password"
    export const urlPattern = `/join/:${ matchStudylistId }/:${ matchPassword }`

    export const urlWith = (studylistId: string, password: string) =>
        `/join/${ encodeURIComponent(studylistId) }/${ encodeURIComponent(password) }`
}


export namespace Community
{
    export const url = `/community`
}


export namespace Help
{
    export const url = `/help`
}


export namespace HelpAnki
{
    export const url = `/help/anki`
}


export namespace HelpSymbols
{
    export const url = `/help/symbols`
}


export namespace HelpFilters
{
    export const url = `/help/filters`
}