import * as Db from "../db/index.ts"
import * as Kanjidic from "./kanjidic.ts"
import * as Jmdict from "./jmdict.ts"
import * as Jmnedict from "./jmnedict.ts"
import * as StandardLists from "./standard_lists.ts"
import * as FuriganaOutput from "./furigana_output.ts"
import * as Logging from "./logging.ts"
import * as JlptWords from "../data/jlpt_words.ts"
import * as PitchAccent from "../data/pitch_accent.ts"
import * as FuriganaHelpers from "../data/furigana_helpers.ts"
import * as WordRankings from "../data/word_rankings.ts"
import * as JmdictExtraTags from "../data/jmdict_extra_tags.ts"


let building = false


export async function buildDatabase(
    db: Db.Interface,
    useCachedFiles: boolean)
{
    const logger: Logging.Logger = {
        write: async (str) => {
            process.stdout.write(str)
            await db.log(str)
        },

        writeLn: async (str) => {
            console.log(str)
            await db.log(str)
        }
    }

    if (building)
        return

    try
    {
        building = true
        await logger.writeLn("building database...")
        const startDate = new Date()
        await Jmdict.downloadAndImport(logger, db, useCachedFiles, startDate)
        JlptWords.clearCache()
        PitchAccent.clearCache()
        WordRankings.clearCache()
        JmdictExtraTags.clearCache()
        await StandardLists.buildStandardLists(logger, db)
        await Kanjidic.downloadAndImport(logger, db, useCachedFiles)
        await Jmnedict.downloadAndImport(logger, db, useCachedFiles, startDate)
        await db.importWordEntriesFinish(startDate)
        FuriganaHelpers.clearCache()
        await FuriganaOutput.outputFurigana(logger, db)
        await logger.writeLn("finished building database")
    }
    catch (e)
    {
        await logger.writeLn(`error building database: ${ e }`)
        throw e
    }
    finally
    {
        building = false
    }
}


export function setupScheduledDatabaseBuild(
    db: Db.Interface)
{
    const oneDay = 1000 * 60 * 60 * 24

    setInterval(
        () => buildDatabase(db, false),
        oneDay * 3.25)
}