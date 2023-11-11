import * as Api from "common/api/index.ts"
import * as Infletcion from "common/inflection.ts"


export type SearchOptions = {
    limit: number
    tags?: Set<string>
    inverseTags?: Set<string>
}


export interface Db
{
    importWordEntries:
        (entries: Api.Word.Entry[]) => Promise<void>

    importKanjiEntries:
        (entries: Api.Kanji.Entry[]) => Promise<void>

    importKanjiWordCrossRefEntries:
        (entries: Api.KanjiWordCrossRef.Entry[]) => Promise<void>

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
}


export function createDummy(): Db
{
    return {
        importWordEntries: async () => {},
        importKanjiEntries: async () => {},
        importKanjiWordCrossRefEntries: async () => {},

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
        
        listAllKanji: async () => [],
        listWordsWithChars: async () => [],
        listKanjiWordCrossRefEntries: async() => [], 
    }
}