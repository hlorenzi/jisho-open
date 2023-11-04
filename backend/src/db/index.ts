import * as Api from "common/api/index.ts"
import * as Infletcion from "common/inflection.ts"


export interface Db
{
    importWords:
        (words: Api.Word.Entry[]) => Promise<void>

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
}


export function createDummy(): Db
{
    return {
        importWords: async () => {},

        searchByHeading: async () => [],
        searchByHeadingPrefix: async () => [],
        searchByInflections: async () => [],
        searchByDefinition: async () => [],
    }
}