import * as Api from "common/api/index.ts"
import * as Infletcion from "common/inflection.ts"


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
        tags: Set<string>,
        inverseTags: Set<string>)
        => Promise<Api.Word.Entry[]>
    
    searchByHeadingPrefix: (
        queries: string[],
        tags: Set<string>,
        inverseTags: Set<string>)
        => Promise<Api.Word.Entry[]>

    searchByInflections: (
        inflections: Infletcion.Breakdown,
        tags: Set<string>,
        inverseTags: Set<string>)
        => Promise<Api.Word.Entry[]>

    searchByDefinition: (
        query: string,
        tags: Set<string>,
        inverseTags: Set<string>)
        => Promise<Api.Word.Entry[]>

    searchByTags: (
        tags: Set<string>,
        inverseTags: Set<string>)
        => Promise<Api.Word.Entry[]>

    searchByWildcards: (
        queries: string[],
        tags: Set<string>,
        inverseTags: Set<string>)
        => Promise<Api.Word.Entry[]>

    searchKanji: (
        kanjiString: string,
        tags: Set<string>,
        inverseTags: Set<string>)
        => Promise<Api.Kanji.Entry[]>

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
        searchByHeadingPrefix: async () => [],
        searchByInflections: async () => [],
        searchByDefinition: async () => [],
        searchByTags: async () => [],
        searchByWildcards: async () => [],
        searchKanji: async () => [],
        
        listAllKanji: async () => [],
        listWordsWithChars: async () => [],
        listKanjiWordCrossRefEntries: async() => [], 
    }
}