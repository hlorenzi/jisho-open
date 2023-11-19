import * as Db from "../db/index.ts"
import * as Kanjidic from "./kanjidic.ts"
import * as Jmdict from "./jmdict.ts"
import * as KanjiWords from "./kanji_words.ts"
import * as StandardLists from "./standard_lists.ts"
import * as Logging from "./logging.ts"


export async function buildDatabase(
    db: Db.Interface,
    useCachedFiles: boolean)
{
    const logger: Logging.Logger = {
        write: (str) => process.stdout.write(str),
        writeLn: (str) => console.log(str),
    }

    try
    {
        logger.writeLn("building database...")
        //await Jmdict.downloadAndImport(logger, db, useCachedFiles)
        //await Kanjidic.downloadAndImport(logger, db, useCachedFiles)
        //await KanjiWords.crossReferenceKanjiWords(logger, db)
        await StandardLists.buildStandardLists(logger, db)
        logger.writeLn("finished building database")
    }
    catch (e)
    {
        logger.writeLn(`error building database: ${ e }`)
        throw e
    }
}