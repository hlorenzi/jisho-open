import * as fs from "fs"


export interface BufferedReader
{
    getProgressFraction: () => number
    skipTo: (str: string) => void
    readTo: (str: string) => string | null
}


export async function create(
    filename: string)
    : Promise<BufferedReader>
{
    const file = fs.openSync(filename, "r")

    const fileStats = fs.statSync(filename)
    const fileSize = fileStats["size"]

    const bufferSize = 10000
    const buffer = Buffer.alloc(bufferSize)


    let overallIndex = 0

    let blockSize = 0
    let blockIndex = 0

    const readNext = () =>
    {
        if (blockIndex >= blockSize)
        {
            blockSize = fs.readSync(file, buffer, 0, bufferSize, null)
            blockIndex = 0
        }

        if (blockIndex >= blockSize)
            return null
        
        const c = buffer[blockIndex]
        blockIndex++
        overallIndex++

        return c
    }

    const reader: BufferedReader = {
        getProgressFraction: () =>
        {
            return overallIndex / fileSize
        },

        skipTo: (str) =>
        {
            let at = 0
            while (true)
            {
                const readC = readNext()
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

        readTo: (str) =>
        {
            let res: number[] = []
            let at = 0
            while (true)
            {
                const readC = readNext()
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