import * as fs from "fs"
import * as util from "util"


export interface StreamedReader
{
    getProgressFraction: () => number
    skipTo: (str: string) => Promise<void>
    readTo: (str: string) => Promise<string | null>
}


export async function create(
    filename: string)
    : Promise<StreamedReader>
{
    const file = fs.openSync(filename, "r")

    const fileStats = fs.statSync(filename)
    const fileSize = fileStats["size"]

    const bufferSize = 1_000_000
    const buffer = Buffer.alloc(bufferSize)


    let overallIndex = 0

    let blockSize = 0
    let blockIndex = 0

    const fsRead = util.promisify(fs.read)

    const readNext = async () => {
        if (blockIndex >= blockSize)
        {
            blockSize = (await fsRead(file, buffer, 0, bufferSize, null)).bytesRead
            blockIndex = 0
        }

        if (blockIndex >= blockSize)
            return null
        
        const c = buffer[blockIndex]
        blockIndex++
        overallIndex++

        return c
    }

    const reader: StreamedReader = {
        getProgressFraction: () => {
            return overallIndex / fileSize
        },

        skipTo: async (str) => {
            let at = 0
            while (true)
            {
                const readC = await readNext()
                if (!readC)
                    break

                if (readC == str.codePointAt(at))
                {
                    at++
                    if (at >= str.length)
                        break
                }
                else
                {
                    at = 0
                }
            }
        },

        readTo: async (str) => {
            let res: number[] = []
            let at = 0
            while (true)
            {
                const readC = await readNext()
                if (!readC)
                    return null

                res.push(readC)

                if (readC == str.codePointAt(at))
                {
                    at++
                    if (at >= str.length)
                        break
                }
                else
                {
                    at = 0
                }
            }

            const resBuffer = Buffer.from(res)
            return resBuffer.toString("utf8")
        }
    }

    return reader
}