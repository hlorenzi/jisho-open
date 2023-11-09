// @ts-expect-error
import xml2js from "xml2js"
import * as StreamedReader from "./streamed_reader.ts"
import * as Logging from "./logging.ts"


export const xml2jsAttributeKey = "attr"
export const xml2jsTextKey = "text"


/// Using a streamed file buffer, parses the XML file according
/// to the given `main` and `entry` tags, converts each entry
/// to a JSON object, and yields these objects interpreted as the
/// given `T` type (without type-checking).
export async function* iterateEntriesStreamed<T extends object>(
    logger: Logging.Logger,
    filename: string,
    mainTagId: string,
    entryTagId: string)
    : AsyncGenerator<T>
{
    const reader = await StreamedReader.create(filename)
    await reader.skipTo(`<${mainTagId}>`)

    const entryTagStart = `<${entryTagId}>`
    const entryTagEnd = `</${entryTagId}>`


    const readEntry = async () =>
    {
        await reader.skipTo(entryTagStart)
        
        const entryStr = await reader.readTo(entryTagEnd)
        if (entryStr === null)
            return null
        
        let entryXml = entryTagStart + entryStr
        entryXml = entryXml.replace(/\&(.*?)\;/g, "$1")

        const entryObj = await xml2js.parseStringPromise(
            entryXml,
            {
                attrkey: xml2jsAttributeKey,
                charkey: xml2jsTextKey,
            })

        return entryObj[entryTagId] as T
    }


    let prevPercent = -1

    while (true)
    {
        const curPercent = Math.floor(reader.getProgressFraction() * 100)
        if (curPercent !== prevPercent)
        {
            Logging.logProgressPercentage(logger, curPercent)
            prevPercent = curPercent
        }
        
        const entryObj = await readEntry()
        if (entryObj === null)
            break

        yield entryObj
    }

    Logging.logProgressPercentage(logger, 100)
}