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
    marked?: boolean

    /// For use by the client. Not filled out by the server.
    folderName?: string
    selfName?: string
}


export type WordEntry = {
    id: string
    date: Date

    /// Encoded furigana of a particular spelling of the word
    spelling?: string
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