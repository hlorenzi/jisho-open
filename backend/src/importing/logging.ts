export type Logger = {
    write: (str: string) => void
    writeLn: (str: string) => void
}


export function logProgressPercentage(
    logger: Logger,
    percent: number)
{
    if (percent < 100)
        logger.write(`\r...${ percent }%`)
    else
        logger.write("\r               \r")
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
            logProgressPercentage(logger, curPercent)
            prevPercent = curPercent
        }

        await fn(array[i], i)
    }

    logProgressPercentage(logger, 100)
}