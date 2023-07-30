import * as BufferedReader from "./buffered_reader.js"
// @ts-expect-error
import xml2js from "xml2js"


export const xml2jsAttributeKey = "attr"
export const xml2jsTextKey = "text"


export async function* iterateEntriesBuffered<T extends object>(
    filename: string,
    mainTagId: string,
    entryTagId: string)
    : AsyncGenerator<T>
{
    const reader = await BufferedReader.create(filename)
    reader.skipTo(`<${mainTagId}>`)

    const entryTagStart = `<${entryTagId}>`
    const entryTagEnd = `</${entryTagId}>`


    const readEntry = async () =>
    {
        reader.skipTo(entryTagStart)
        
        const entryStr = reader.readTo(entryTagEnd)
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
            process.stdout.write(`\r...${curPercent}%`)
            prevPercent = curPercent
        }
        
        const entryObj = await readEntry()
        if (entryObj === null)
            break

        yield entryObj
    }

    process.stdout.write("\r               \r")
}