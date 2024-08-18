import * as Framework from "./framework/index.ts"
import * as Api from "common/api/index.ts"
export * from "common/api/index.ts"


type CachedResponse = Promise<object>


type EndpointCache = Map<string, CachedResponse>


const cache = new Map<string, EndpointCache>()


async function postCached(
    endpoint: string,
    payload: any)
    : Promise<any>
{
    const cacheForEndpoint: EndpointCache = cache.get(endpoint) ?? new Map()
    const payloadKey = JSON.stringify(payload)
    const cachedResponsePromise = cacheForEndpoint.get(payloadKey)
    if (cachedResponsePromise)
    {
        const cachedResponse = await cachedResponsePromise

        console.log(
            `%c${ endpoint } [cached]`,
            "color: white; background-color: limegreen;",
            payload,
            cachedResponse)

        return cachedResponse
    }

    const response = post(endpoint, payload)
    cacheForEndpoint.set(payloadKey, response)
    cache.set(endpoint, cacheForEndpoint)
    return response
}


async function post(
    endpoint: string,
    payload: any)
    : Promise<any>
{
    let res: Response

    const logError = () => {
        console.error(
            `%c${ endpoint }`,
            "color: white; background-color: green;",
            payload,
            "[error]")
    }

    Framework.Analytics.event(
        endpoint.substring(1).replace(/\//g, "_"))

    try
    {
        res = await fetch(
            endpoint,
            {
                method: "post",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
                body: !payload ? undefined : JSON.stringify(payload),
            })
    }
    catch (err)
    {
        logError()
        window.alert(`A network error occurred, or the server is unavailable.`)
        throw err
    }
            
    if (!res.ok)
    {
        const err = await res.text()
        logError()

        window.alert(`An error occurred! (HTTP status: ${ res.status })\n\n${ err }`)
        
        throw new Error(
            err,
            { cause: { statusCode: res.status, statusMessage: err } })
    }
    
    try
    {
        const json = await res.json()

        console.log(
            `%c${ endpoint }`,
            "color: white; background-color: green;",
            payload,
            json)

        return json
    }
    catch (err)
    {
        logError()
        window.alert(`An error occurred!\n\n${ err }`)
        throw err
    }
}


export async function authenticate()
    : Promise<Api.Authenticate.Response>
{
    const authUser = await postCached(Api.Authenticate.url, undefined) as Api.Authenticate.Response
    
    if (Api.userIsAdmin(authUser))
        Framework.Analytics.setUserAdmin(true)

    return authUser
}


export async function getUser(
    req: Api.GetUser.Request)
    : Promise<Api.GetUser.Response>
{
    return postCached(Api.GetUser.url, req)
}


export async function logGet()
    : Promise<Api.Log.Response>
{
    return post(Api.Log.url, undefined)
}


export async function search(
    req: Api.Search.Request)
    : Promise<Api.Search.Response>
{
    return postCached(Api.Search.url, req)
}


export async function getKanjiWords(
    req: Api.KanjiWords.Request)
    : Promise<Api.KanjiWords.Response>
{
    return postCached(Api.KanjiWords.url, req)
}


export async function getKanjiByComponents(
    req: Api.KanjiByComponents.Request)
    : Promise<Api.KanjiByComponents.Response>
{
    return postCached(Api.KanjiByComponents.url, req)
}


const folderInstruction =
    "If you use a slash, it will be interpreted as a folder: " +
    "\"Games/Pokémon\""

const studylistCreatePrompt =
    "Name for new study list?\n\n" +
    folderInstruction

const studylistRenamePrompt =
    "New name for study list?\n\n" +
    folderInstruction


export async function studylistCreate()
    : Promise<Api.StudylistCreate.Response | undefined>
{
    const name = prompt(studylistCreatePrompt, "")
    if (!name)
        return undefined
    
    return post(Api.StudylistCreate.url, { name })
}


export async function studylistClone(
    req: Api.StudylistClone.Request)
    : Promise<Api.StudylistClone.Response>
{
    return post(Api.StudylistClone.url, req)
}


export async function studylistCreateAndAddWord(
    wordId: string)
    : Promise<Api.StudylistWordAdd.Response | undefined>
{
    const res = await studylistCreate()
    if (!res)
        return undefined

    return studylistWordAdd({
        studylistId: res.studylistId,
        wordId,
    })
}


export async function studylistDelete(
    studylist: Api.StudyList.Entry)
    : Promise<Api.StudylistDelete.Response | undefined>
{
    const studylistDeletePrompt =
        `Delete this study list with ` +
        `${ studylist.wordCount } ` +
        `${ Framework.formPlural(studylist.wordCount, "word", "s") }?\n\n` +
        `Type in that number to confirm.`
    
    const name = prompt(studylistDeletePrompt, "")
    if (!name ||
        name !== studylist.wordCount.toString())
        return undefined

    const req: Api.StudylistDelete.Request = {
        studylistId: studylist.id,
    }
    
    return post(Api.StudylistDelete.url, req)
}


export async function studylistEditName(
    studylist: Api.StudyList.Entry)
    : Promise<Api.StudylistEdit.Response | undefined>
{
    const name = prompt(studylistRenamePrompt, studylist.name)
    if (!name ||
        name === studylist.name)
        return undefined

    const req: Api.StudylistEdit.Request = {
        studylistId: studylist.id,
        edit: {
            type: "name",
            value: name,
        },
    }
    
    return post(Api.StudylistEdit.url, req)
}


export async function studylistEditPublic(
    studylist: Api.StudyList.Entry)
    : Promise<Api.StudylistEdit.Response | undefined>
{
    const isPublic = studylist.public
    
    const studylistEditPublicPrompt = isPublic ?
        `Set list as private?\n\n` +
        `Other people will lose access to it.`
        :
        `Set list as public?\n\n` +
        `Other people will be able to view its contents, ` +
        `but still only you can edit it.\n\n` +
        `It may also appear on the Community page.`

    const confirmed = confirm(studylistEditPublicPrompt)
    if (!confirmed)
        return undefined

    const req: Api.StudylistEdit.Request = {
        studylistId: studylist.id,
        edit: {
            type: "public",
            value: !isPublic,
        },
    }
    
    return post(Api.StudylistEdit.url, req)
}


export async function studylistEdit(
    req: Api.StudylistEdit.Request)
    : Promise<Api.StudylistEdit.Response>
{
    return post(Api.StudylistEdit.url, req)
}


export async function studylistEditorJoin(
    req: Api.StudylistEditorJoin.Request)
    : Promise<Api.StudylistEditorJoin.Response>
{
    return post(Api.StudylistEditorJoin.url, req)
}


export async function studylistEditorLeave(
    req: Api.StudylistEditorLeave.Request)
    : Promise<Api.StudylistEditorLeave.Response>
{
    return post(Api.StudylistEditorLeave.url, req)
}


export async function studylistGet(
    req: Api.StudylistGet.Request)
    : Promise<Api.StudylistGet.Response>
{
    return post(Api.StudylistGet.url, req)
}


export async function studylistGetAll(
    req: Api.StudylistGetAll.Request)
    : Promise<Api.StudylistGetAll.Response>
{
    return post(Api.StudylistGetAll.url, req)
}


export async function studylistGetAllMarked(
    req: Api.StudylistGetAllMarked.Request)
    : Promise<Api.StudylistGetAllMarked.Response>
{
    return post(Api.StudylistGetAllMarked.url, req)
}


export async function studylistWordAdd(
    req: Api.StudylistWordAdd.Request)
    : Promise<Api.StudylistWordAdd.Response>
{
    return post(Api.StudylistWordAdd.url, req)
}


export async function studylistWordRemoveMany(
    req: Api.StudylistWordRemoveMany.Request)
    : Promise<Api.StudylistWordRemoveMany.Response>
{
    return post(Api.StudylistWordRemoveMany.url, req)
}


export async function studylistWordImport(
    req: Api.StudylistWordImport.Request)
    : Promise<Api.StudylistWordImport.Response>
{
    return post(Api.StudylistWordImport.url, req)
}


export async function studylistWordsGet(
    req: Api.StudylistWordsGet.Request)
    : Promise<Api.StudylistWordsGet.Response>
{
    return post(Api.StudylistWordsGet.url, req)
}


export async function studylistStandardGetAll(
    req: Api.StudylistStandardGetAll.Request)
    : Promise<Api.StudylistStandardGetAll.Response>
{
    return post(Api.StudylistStandardGetAll.url, req)
}


export async function studylistCommunityGetRecent(
    req: Api.StudylistCommunityGetRecent.Request)
    : Promise<Api.StudylistCommunityGetRecent.Response>
{
    return post(Api.StudylistCommunityGetRecent.url, req)
}


export async function analyticsDailyGet()
    : Promise<Api.Analytics.Response>
{
    return post(Api.Analytics.url, {})
}


let cachedVersion: string | undefined = undefined
export async function versionGet()
    : Promise<string>
{
    if (cachedVersion === undefined)
    {
        cachedVersion = (await post(Api.VersionGet.url, {})).version
    }

    return cachedVersion ?? "v?.??-??????"
}