import fs from "fs"
import * as cheerio from "cheerio"
import * as File from "../importing/file.ts"
import * as Logger from "../importing/logging.ts"
import * as MongoDb from "../db/mongodb/index.ts"
import * as Kana from "common/kana.ts"


const regexHan = `[\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u3005\u3007\u3021-\u3029\u3038-\u303B\u3400-\u4DB5\u4E00-\u9FCC\uF900-\uFA6D\uFA70-\uFAD9\u{20000}-\u{2A6DF}]`


function isKanji(s: string)
{
    return Kana.isKanji(s) ||
        s === "〇"
}


async function scrape(kanji: string)
{
    console.log(`scraping ${ kanji }...`)

    const filename = File.downloadFolder + `wiktionary_${ kanji }.html`

    await File.download(
        Logger.loggerConsole,
        `https://en.wiktionary.org/wiki/${ encodeURIComponent(kanji) }`,
        filename,
        true)

    const pageText = fs.readFileSync(filename, "utf-8")

    const $ = cheerio.load(pageText)

    let $glyphOriginHeader = $("h2:contains(Japanese) ~ h3:contains(Glyph origin)")
    if ($glyphOriginHeader.length === 0)
        $glyphOriginHeader = $("h2:contains(Chinese) ~ h3:contains(Glyph origin)")
    const $glyphOriginBody = $glyphOriginHeader.nextUntil("h3", "p")
    const glyphOrigin = $glyphOriginBody.text().trim()
    if ($glyphOriginHeader.length !== 0 &&
        $glyphOriginBody.length !== 0)
    {
        const glyphOriginLower = glyphOrigin.toLowerCase()
        const isPictogram =
            //glyphOriginLower.indexOf("pictogram") >= 0 ||
            glyphOriginLower.indexOf("象形") >= 0
        const isSimple =
            //glyphOriginLower.indexOf("ideogram") >= 0 ||
            glyphOriginLower.indexOf("指事") >= 0
        const isCompound =
            //glyphOriginLower.indexOf("ideogrammic compound") >= 0 ||
            glyphOriginLower.indexOf("会意") >= 0
        const compoundPartsRaw =
            glyphOriginLower.match(new RegExp(`会意.*?:(.*?)\\.`, "u")) ??
            glyphOriginLower.match(new RegExp(`会意.*?:(.*?)$`, "u")) ??
            glyphOriginLower.match(new RegExp(`会意.*?of(.*?)\\.`, "u"))
        const compoundPartsIter =
            compoundPartsRaw?.[1]?.matchAll(new RegExp(`(${ regexHan })`, "ug"))
        const compoundParts = compoundPartsIter ? [...compoundPartsIter].map(s => s[1].trim()) : []
        
        const isPhonosemantic =
            //glyphOriginLower.indexOf("phono-semantic compound") >= 0 ||
            glyphOriginLower.indexOf("形声") >= 0
        const phonosemanticParts =
            glyphOriginLower.match(new RegExp(`形声.*?:(.*?)\\.`, "u")) ??
            glyphOriginLower.match(new RegExp(`形声.*?:(.*?)$`, "u"))
        const phonosemanticPartsPhoneticIter =
            phonosemanticParts?.[1]?.matchAll(new RegExp(`phonetic\\s*?(${ regexHan })`, "ug"))
        const phonosemanticPartsPhonetic = phonosemanticPartsPhoneticIter ? [...phonosemanticPartsPhoneticIter].map(s => s[1].trim()) : []
        const phonosemanticPartsSemanticIter =
            phonosemanticParts?.[1]?.matchAll(new RegExp(`semantic\\s*?(${ regexHan })`, "ug"))
        const phonosemanticPartsSemantic = phonosemanticPartsSemanticIter ? [...phonosemanticPartsSemanticIter].map(s => s[1].trim()) : []
        
        const isKokuji =
            glyphOriginLower.indexOf("kokuji") >= 0 ||
            glyphOriginLower.indexOf("国字") >= 0
        const originalGlyph =
            glyphOriginLower.match(new RegExp(`originally (${ regexHan })`, "u"))?.[1] ??
            glyphOriginLower.match(new RegExp(`originally written (${ regexHan })`, "u"))?.[1] ??
            glyphOriginLower.match(new RegExp(`corruption of (${ regexHan })`, "u"))?.[1] ??
            glyphOriginLower.match(new RegExp(`simplified from (${ regexHan })`, "u"))?.[1] ??
            glyphOriginLower.match(new RegExp(`variant of (${ regexHan })`, "u"))?.[1] ??
            glyphOriginLower.match(new RegExp(`variant form of (${ regexHan })`, "u"))?.[1] ??
            glyphOriginLower.match(new RegExp(`triplication of (${ regexHan })`, "u"))?.[1]

        console.log(`glyph origin: ${ glyphOrigin }`)

        if (isPictogram)
            console.log(`isPictogram: ${ isPictogram }`)

        if (isSimple)
            console.log(`isSimple: ${ isSimple }`)

        if (isCompound)
            console.log(`isCompound: ${ isCompound }, from: ${ compoundParts }`)

        if (isPhonosemantic)
            console.log(`isPhonosemantic: ${ isPhonosemantic }, semantic: ${ phonosemanticPartsSemantic }, phonetic: ${ phonosemanticPartsPhonetic }`)

        if (isKokuji)
            console.log(`isKokuji: ${ isKokuji }`)

        if (originalGlyph)
            console.log(`originalGlyph: ${ originalGlyph }`)
        
        if ((isPictogram && (isSimple || isCompound || isPhonosemantic)) ||
            (isSimple && (isPictogram || isCompound || isPhonosemantic)) ||
            (isCompound && (isSimple || isPictogram || isPhonosemantic)) ||
            (isPhonosemantic && (isSimple || isPictogram || isCompound)))
            console.log(`[!] ambiguous glyph origin`)

        if (isCompound &&
            compoundParts.length === 0)
            throw `missing compoundParts`
    
        for (const part of compoundParts)
            if ([...part].length !== 1 ||
                !isKanji(part))
                throw `invalid compoundParts: ${ part }`

        if (isPhonosemantic &&
            phonosemanticPartsPhonetic.length === 0)
            throw `missing phonosemanticPartsSemantic`

        if (isPhonosemantic &&
            phonosemanticPartsSemantic.length === 0)
            throw `missing phonosemanticPartsSemantic`
        
        for (const part of phonosemanticPartsSemantic)
            if ([...part].length !== 1 ||
                !isKanji(part))
                throw `invalid phonosemanticPartsSemantic: ${ part }`
    
        for (const part of phonosemanticPartsPhonetic)
            if ([...part].length !== 1 ||
                !isKanji(part))
                throw `invalid phonosemanticPartsPhonetic: ${ part }`
        
        if (originalGlyph)
        {
            if (!isKanji(originalGlyph))
                throw `invalid originalGlyph: ${ originalGlyph }`

            await scrape(originalGlyph)
        }
    }

    const $kyuujitaiHeader = $("td:contains(Kyūjitai):first")
    const $kyuujitaiBody = $kyuujitaiHeader.nextAll("td:not(:contains(Kyūjitai)):first")
    const kyuujitai = [...$kyuujitaiBody.text().trim()][0]
    if ($kyuujitaiHeader.length === 1 &&
        $kyuujitaiBody.length === 1)
    {
        if (!isKanji(kyuujitai))
            throw `invalid kyuujitai: ${ kyuujitai }`

        console.log(`kyuujitai: ${ kyuujitai }`)
        await scrape(kyuujitai)
    }

    const $shinjitaiHeader = $("td:contains(Shinjitai):first")
    const $shinjitaiBody = $shinjitaiHeader.nextAll("td:not(:contains(Shinjitai)):first")
    const shinjitai = [...$shinjitaiBody.text().trim()][0]
    if ($shinjitaiHeader.length === 1 &&
        $shinjitaiBody.length === 1)
    {
        if (!isKanji(shinjitai))
            throw `invalid shinjitai: ${ shinjitai }`
        
        console.log(`shinjitai: ${ shinjitai }`)
        await scrape(shinjitai)
    }

    console.log("")
}

await scrape("化")
await scrape("飲")
await scrape("鵜")
await scrape("脳")
await scrape("腦")
await scrape("匘")
await scrape("人")
await scrape("傘")
await scrape("峠")
await scrape("声")
await scrape("性")

const dbClient = await MongoDb.connect()
const db = dbClient.client.db("jisho2")
const collKanji = db.collection("kanji")

const total = await collKanji.countDocuments()
let count = 1

for await (const entry of collKanji.find({}).stream())
{
    console.log(`scraping ${ count } of ${ total }...`)
    count += 1

    const kanji = entry._id.toString()
    try
    {
        await scrape(kanji)
    }
    catch (e)
    {
        console.error(e)
    }
}

console.log("done")
process.exit(0)