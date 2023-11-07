export type Logger = {
    write: (str: string) => void
    writeLn: (str: string) => void
}



export async function loopWithProgress<T>(
    logger: Logger,
    array: T[],
    fn: (item: T, index: number) => Promise<void>)
{
    let prevPercent = -1

    for (let i = 0; i < array.length; i++)
    {
        const curPercent = Math.floor(i / array.length * 100)
        if (curPercent != prevPercent)
        {
            logger.write(`\r...${ curPercent }%`)
            //process.stdout.write("\r..." + curPercent + "%")
            prevPercent = curPercent
        }

        await fn(array[i], i)
    }

    logger.write("\r               \r")
    //process.stdout.write("\r               \r")
}