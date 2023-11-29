import * as Db from "../db/index.ts"
import * as Kanjidic from "./kanjidic.ts"
import * as Jmdict from "./jmdict.ts"
import * as StandardLists from "./standard_lists.ts"
import * as Logging from "./logging.ts"


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
        await Jmdict.downloadAndImport(logger, db, useCachedFiles)
        await StandardLists.buildStandardLists(logger, db)
        await Kanjidic.downloadAndImport(logger, db, useCachedFiles)
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
    setInterval(
        () => buildDatabase(db, false),
        1000 * 60 * 60 * 24)
}