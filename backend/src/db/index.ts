import * as Api from "common/api/index.ts"
import * as Infletcion from "common/inflection.ts"


export type SearchOptions = {
    limit: number
    tags?: Set<string>
    inverseTags?: Set<string>
}


export interface Interface
{
    importWordEntries: (
        importStartDate: Date,
        entries: Api.Word.Entry[])
        => Promise<void>

    importWordEntriesFinish:
        (importStartDate: Date) => Promise<void>

    importKanjiEntries:
        (entries: Api.Kanji.Entry[]) => Promise<void>

    importKanjiWordCrossRefEntries:
        (entries: Api.KanjiWordCrossRef.Entry[]) => Promise<void>

    importStandardStudylist: (
        studylistId: string,
        studylistName: string,
        wordIds: string[])
        => Promise<void>

    searchByHeading: (
        queries: string[],
        options: SearchOptions)
        => Promise<Api.Word.Entry[]>
    
    searchByHeadingAll: (
        queries: string[],
        options: SearchOptions)
        => Promise<Api.Word.Entry[]>
    
    searchByHeadingPrefix: (
        queries: string[],
        options: SearchOptions)
        => Promise<Api.Word.Entry[]>

    searchByInflections: (
        inflections: Infletcion.Breakdown,
        options: SearchOptions)
        => Promise<Api.Word.Entry[]>

    searchByDefinition: (
        queries: string[],
        options: SearchOptions)
        => Promise<Api.Word.Entry[]>

    searchByTags: (
        options: SearchOptions)
        => Promise<Api.Word.Entry[]>

    searchByWildcards: (
        queries: string[],
        options: SearchOptions)
        => Promise<Api.Word.Entry[]>

    searchKanji: (
        kanjiString: string,
        options: SearchOptions)
        => Promise<Api.Kanji.Entry[]>

    searchKanjiByReading: (
        queries: string[],
        options: SearchOptions)
        => Promise<Api.Kanji.Entry[]>

    searchKanjiByMeaning: (
        queries: string[],
        options: SearchOptions)
        => Promise<Api.Kanji.Entry[]>

    searchKanjiByComponents: (
        queries: string[],
        onlyCommon: boolean)
        => Promise<Api.KanjiByComponents.Kanji[]>

    listKanjiWordCrossRefEntries(
        kanjiString: string)
        : Promise<Api.KanjiWordCrossRef.Entry[]>

    listAllKanji: ()
        => Promise<Api.Kanji.Entry[]>
    
    listWordsWithChars: (
        chars: string[])
        => Promise<Api.Word.Entry[]>

    studylistCreate: (
        authUser: Api.MaybeUser,
        name: string)
        => Promise<string>

    studylistDelete: (
        authUser: Api.MaybeUser,
        studylistId: string)
        => Promise<void>

    studylistEdit: (
        authUser: Api.MaybeUser,
        studylistId: string,
        edit: Api.StudylistEdit.Request["edit"])
        => Promise<void>

    studylistGet: (
        authUser: Api.MaybeUser,
        studylistId: string)
        => Promise<Api.StudyList.Entry>
    
    studylistGetAll: (
        authUser: Api.MaybeUser,
        userId: string)
        => Promise<Api.StudyList.Entry[]>

    studylistGetAllMarked: (
        authUser: Api.MaybeUser,
        markWordId: string | undefined)
        => Promise<Api.StudyList.Entry[]>

    studylistWordAdd: (
        authUser: Api.MaybeUser,
        studylistId: string,
        wordId: string)
        => Promise<void>

    studylistWordRemoveMany: (
        authUser: Api.MaybeUser,
        studylistId: string,
        wordIds: string[])
        => Promise<void>

    studylistWordsGet: (
        authUser: Api.MaybeUser,
        studylistId: string)
        => Promise<Api.Word.Entry[]>

    studylistCommunityGetRecent: (
        authUser: Api.MaybeUser,
        limit: number)
        => Promise<Api.StudyList.Entry[]>
}


export function createDummy(): Interface
{
    return {
        importWordEntries: async () => {},
        importWordEntriesFinish: async () => {},
        importKanjiEntries: async () => {},
        importKanjiWordCrossRefEntries: async () => {},
        importStandardStudylist: async () => {},

        searchByHeading: async () => [],
        searchByHeadingAll: async () => [],
        searchByHeadingPrefix: async () => [],
        searchByInflections: async () => [],
        searchByDefinition: async () => [],
        searchByTags: async () => [],
        searchByWildcards: async () => [],
        searchKanji: async () => [],
        searchKanjiByReading: async () => [],
        searchKanjiByMeaning: async () => [],
        searchKanjiByComponents: async () => [],

        studylistCreate: async () => "fake",
        studylistDelete: async () => {},
        studylistEdit: async () => {},
        studylistGet: async () => { throw Api.Error.forbidden },
        studylistGetAll: async () => [],
        studylistGetAllMarked: async () => [],
        studylistWordAdd: async () => {},
        studylistWordRemoveMany: async () => {},
        studylistWordsGet: async () => [],
        studylistCommunityGetRecent: async () => [],
        
        listAllKanji: async () => [],
        listWordsWithChars: async () => [],
        listKanjiWordCrossRefEntries: async() => [], 
    }
}