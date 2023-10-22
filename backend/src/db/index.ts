import * as DbWord from "common/db_word.ts"


export interface Db
{
    importWords: (words: DbWord.Entry[]) => Promise<void>
}


export function createDummy(): Db
{
    return {
        importWords: async () => {},
    }
}