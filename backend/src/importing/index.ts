import * as Db from "../db/index.ts"
import * as Kanjidic from "./kanjidic.ts"
import * as Jmdict from "./jmdict.ts"


export async function buildDatabase(
    db: Db.Db,
    useCachedFiles: boolean)
{
    //await Kanjidic.downloadAndImport(db, useCachedFiles)
    await Jmdict.downloadAndImport(db, useCachedFiles)
}