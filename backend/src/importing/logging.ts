export type Logger = {
    write: (str: string) => Promise<void>
    writeLn: (str: string) => Promise<void>
}


export function logProgressPercentage(
    logger: Logger,
    percent: number)
    : Promise<void>
{
    if (percent < 100)
        return logger.write(`\r...${ percent }%`)
    else
        return logger.write("\r               \r")
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
            await logProgressPercentage(logger, curPercent)
            prevPercent = curPercent
        }

        await fn(array[i], i)
    }

    await logProgressPercentage(logger, 100)
}