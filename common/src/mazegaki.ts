import * as Furigana from "./furigana.ts"
import * as Kana from "./kana.ts"


export function *generateMazegaki(
    furi: Furigana.Furigana)
    : Generator<string, void>
{
    let kanjiCount = 0
    for (const segment of furi)
    {
        if (Kana.hasKanjiOrIterationMark(segment[0]))
            kanjiCount++
    }

    if (kanjiCount == 0 || kanjiCount >= 6)
        return

    //console.log("enumerate -----")
    //console.log(furi.map(p => p[0]).join(""), furi.length, "kanjiCount", kanjiCount)

    for (let d = 1; d <= Math.min(2, kanjiCount); d++)
    {
        //console.log("iter", d)
        const removeArray: number[] = []
        for (let i = 0; i < d; i++)
            removeArray.push(0)

        while (true)
        {
            //console.log(removeArray)
            let res = ""
            let i = 0
            for (const segment of furi)
            {
                if (removeArray.some(a => a == i))
                    res += (segment[1] || segment[0])
                else
                    res += (segment[0])

                i++
            }

            //console.log(res)
            yield res

            let advance = 0
            while (advance < removeArray.length)
            {
                while (true)
                {
                    removeArray[advance]++
                    if (removeArray[advance] < furi.length &&
                        !Kana.hasKanjiOrIterationMark(furi[removeArray[advance]][0]))
                        continue

                    break
                }

                if (removeArray[advance] >= furi.length)
                {
                    removeArray[advance] = 0
                    advance++
                }
                else
                {
                    break
                }
            }

            if (advance >= removeArray.length)
                break
        }
    }
}