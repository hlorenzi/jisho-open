import * as Api from "common/api/index.ts"


export interface Db
{
    importWords: (words: Api.Word.Entry[]) => Promise<void>

    searchByHeading: (queries: string[]) => Promise<Api.Word.Entry[]>
}


export function createDummy(): Db
{
    return {
        importWords: async () => {},

        searchByHeading: async () => [],
    }
}