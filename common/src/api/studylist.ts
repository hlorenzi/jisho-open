export const maxListCountPerUser = 1000
export const maxEditorCount = 100
export const maxWordCount = 10000


export type Entry = {
    id: string
    creatorId: string

    editorIds: string[]
    editorPassword?: string

    name: string
    public: boolean
    
    createDate: Date
    modifyDate: Date

    wordCount: number
    words: WordEntry[]

    /// Marks whether the word (specified in certain API requests) is present
    marked?: "exact" | "spelling"

    /// For use by the client. Not filled out by the server.
    folderName?: string
    selfName?: string
}


export type WordEntry = {
    id: string
    date: Date
}


export function encodeWordEntry(wordId: string, furigana?: string)
{
    if (furigana === undefined ||
        furigana.length === 0)
        return wordId

    return `${ wordId };${ furigana }`
}


export function decodeWordEntry(encoded: string): [string, string | undefined]
{
    const colonIndex = encoded.indexOf(";")
    if (colonIndex < 0)
        return [encoded, undefined]

    return [
        encoded.slice(0, colonIndex),
        encoded.slice(colonIndex + 1)
    ]
}


export function getFolderName(
    studylist: Entry)
    : [folderName: string | undefined, listName: string]
{
    const slashIndex = studylist.name.indexOf("/")
    if (slashIndex < 0)
        return [undefined, studylist.name]

    const folderName = studylist.name.slice(0, slashIndex).trim()
    const listName = studylist.name.slice(slashIndex + 1).trim()
    if (folderName.length === 0 || listName.length === 0)
        return [undefined, studylist.name]
        
    return [folderName, listName]
}