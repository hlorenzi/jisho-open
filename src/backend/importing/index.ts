import * as Db from "../db/index.js"
import * as Kanjidic from "./kanjidic.js"
import * as Jmdict from "./jmdict.js"


export async function buildDatabase(
    db: Db.Db,
    useCachedFiles: boolean)
{
    //await Kanjidic.downloadAndImport(db, useCachedFiles)
    await Jmdict.downloadAndImport(db, useCachedFiles)
}