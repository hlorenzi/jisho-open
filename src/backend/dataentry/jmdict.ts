import * as File from "./file.js"
import * as Xml from "./xml.js"
import * as JmdictRaw from "../../common/jmdict_raw.js"


export const url = "http://ftp.edrdg.org/pub/Nihongo/JMdict_e.gz"
export const gzipFilename = File.downloadFolder + "JMdict_e.gz"
export const xmlFilename = File.downloadFolder + "JMdict_e.xml"


export async function downloadAndParse()
{
    await File.download(
        url,
        gzipFilename,
        true)
    
    await File.extractGzip(
        gzipFilename,
        xmlFilename,
        true)

    const entryIterator = Xml.iterateEntriesBuffered<JmdictRaw.Entry>(
        xmlFilename,
        "JMdict",
        "entry")
    
    for await (const entry of entryIterator)
    {
        console.dir(entry, { depth: null })
        console.log()
        console.log()
        console.log()
    }
}