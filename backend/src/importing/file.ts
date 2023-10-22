import * as fs from "fs"
import * as http from "http"
// @ts-expect-error
import gunzip from "gunzip-file"


export const downloadFolder = "./.download/"


export async function download(
    url: string,
    toFilename: string,
    useCachedFile: boolean)
    : Promise<void>
{
    if (useCachedFile &&
        fs.existsSync(toFilename))
        return

    if (!fs.existsSync(downloadFolder))
    {
        console.log(`creating folder ${downloadFolder}...`)
        fs.mkdirSync(downloadFolder)
    }

    console.log(`downloading ${toFilename}...`)
    
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
        
        request.on("error", (err) => {
            fs.unlinkSync(downloadFolder + toFilename)
            console.log(`error downloading ${toFilename}`)
            reject(err.message)
        })
    })
}


export async function extractGzip(
    gzipFilename: string,
    extractedFilename: string,
    useCachedFile: boolean)
    : Promise<void>
{
    if (useCachedFile &&
        fs.existsSync(extractedFilename))
        return

    console.log(`extracting ${gzipFilename}...`)

    await new Promise<void>((resolve, _) => {
        gunzip(
            gzipFilename,
            extractedFilename,
            () => resolve())
    })
}