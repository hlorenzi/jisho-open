import * as Framework from "./framework/index.ts"
import * as Api from "common/api/index.ts"
export * from "common/api/index.ts"


async function post(
    endpoint: string,
    payload: any)
    : Promise<any>
{
    let res: Response

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
        window.alert(`A network error occurred, or the server is unavailable.`)
        throw err
    }
            
    if (!res.ok)
    {
        const err = await res.text()
        window.alert(`An error occurred! (HTTP status: ${ res.status })\n\n${ err }`)
        throw err
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
        window.alert(`An error occurred!\n\n${ err }`)
        throw err
    }
}


export async function authenticate()
    : Promise<Api.Authenticate.Response>
{
    return post(Api.Authenticate.url, undefined)
}


export async function getUser(
    req: Api.GetUser.Request)
    : Promise<Api.GetUser.Response>
{
    return post(Api.GetUser.url, req)
}


export async function search(
    req: Api.Search.Request)
    : Promise<Api.Search.Response>
{
    return post(Api.Search.url, req)
}


export async function getKanjiWords(
    req: Api.KanjiWords.Request)
    : Promise<Api.KanjiWords.Response>
{
    return post(Api.KanjiWords.url, req)
}


export async function getKanjiByComponents(
    req: Api.KanjiByComponents.Request)
    : Promise<Api.KanjiByComponents.Response>
{
    return post(Api.KanjiByComponents.url, req)
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


export async function studylistWordsGet(
    req: Api.StudylistWordsGet.Request)
    : Promise<Api.StudylistWordsGet.Response>
{
    return post(Api.StudylistWordsGet.url, req)
}