export const wordCountMax = 10000


export type Entry = {
    id: string
    creatorId: string

    editorIds: string[]
    editorPassword?: string

    name: string
    public: boolean
    
    createDate: Date
    modifyDate: Date
    activityDate: Date

    wordCount: number
    words: WordEntry[]

    /// Marks whether the word (specified in certain API requests) is present
    marked?: boolean
}


export type WordEntry = {
    id: string
    date: Date

    /// Encoded furigana of a particular spelling of the word
    spelling?: string
}