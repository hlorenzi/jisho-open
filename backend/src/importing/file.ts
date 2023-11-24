import * as fs from "fs"
import * as http from "http"
// @ts-expect-error
import gunzip from "gunzip-file"
import * as Logging from "./logging.ts"


export const downloadFolder = "./.download/"


export async function download(
    logger: Logging.Logger,
    url: string,
    toFilename: string,
    useCachedFile: boolean)
    : Promise<void>
{
    if (useCachedFile &&
        fs.existsSync(toFilename))
    {
        await logger.writeLn(`using cached file "${toFilename}"`)
        return
    }

    if (!fs.existsSync(downloadFolder))
    {
        await logger.writeLn(`creating folder ${downloadFolder}...`)
        fs.mkdirSync(downloadFolder)
    }

    await logger.writeLn(`downloading ${toFilename}...`)
    
    await new Promise<void>((resolve, reject) => {
        const writeStream = fs.createWriteStream(toFilename)

        const request = http.get(
            url,
            (response) => {
                response.pipe(writeStream)
                writeStream.on("finish", () => {
                    writeStream.close(() => resolve())
                })
            })
        
        request.on("error", async (err) => {
            fs.unlinkSync(downloadFolder + toFilename)
            await logger.writeLn(`error downloading ${toFilename}`)
            reject(err.message)
        })
    })
}


export async function extractGzip(
    logger: Logging.Logger,
    gzipFilename: string,
    extractedFilename: string,
    useCachedFile: boolean)
    : Promise<void>
{
    if (useCachedFile &&
        fs.existsSync(extractedFilename))
    {
        await logger.writeLn(`using cached file "${extractedFilename}"`)
        return
    }

    await logger.writeLn(`extracting ${gzipFilename}...`)

    await new Promise<void>((resolve, _) => {
        gunzip(
            gzipFilename,
            extractedFilename,
            () => resolve())
    })
}