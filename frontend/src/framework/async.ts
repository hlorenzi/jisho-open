export async function waitMs(milliseconds: number)
{
    return new Promise((resolve, _) =>
    {
        window.setTimeout(resolve, milliseconds)
    })
}