import * as MongoDb from "./index.ts"
import * as Api from "common/api/index.ts"
import * as Jmdict from "../../importing/jmdict.ts"


export async function importWordEntries(
    state: MongoDb.State,
    importStartDate: Date,
    apiWords: Api.Word.Entry[])
    : Promise<void>
{
    const dbWords = apiWords.map(translateWordApiToDb)

    if (dbWords.length === 0)
        return


    await state.collWords.deleteMany(
        { _id: { $in: dbWords.map(e => e._id) }})

    const resWords = await state.collWords.insertMany(dbWords)

    if (resWords.insertedCount !== dbWords.length)
        throw `MongoDb.importWords failed`


    const dbDefs: MongoDb.DbDefinitionEntry[] = []
    for (const apiWord of apiWords)
        dbDefs.push(...gatherDefinitionEntries(apiWord))

    await state.collDefinitions.deleteMany(
        { wordId: { $in: dbDefs.map(e => e.wordId) }})
    
    const resDefs = await state.collDefinitions.insertMany(dbDefs)

    if (resDefs.insertedCount !== dbDefs.length)
        throw `MongoDb.importWords failed`
}


export async function importWordEntriesFinish(
    state: MongoDb.State,
    importStartDate: Date)
    : Promise<void>
{
    await state.collWords.deleteMany(
        { date: { $lt: importStartDate }})
}


function translateWordApiToDb(
    apiWord: Api.Word.Entry)
    : MongoDb.DbWordEntry
{
    const len = apiWord.headings.reduce(
        (len, h) => len = Math.max(len, h.base.length), 0)

    const headings = Jmdict.gatherLookUpHeadings(apiWord)

    const tags = Jmdict.gatherLookUpTags(apiWord)

    const chars = [...new Set<string>(
        headings.flatMap(h => [...h.text]))]

    // Prepare look-up tables for DB indexing
    const lookUp: MongoDb.DbWordEntry["lookUp"] = {
        len,
        headings,
        tags,
        chars,
    }

    // Add and remove fields via destructuring assignment
    const translateHeading = (apiHeading: Api.Word.Heading): MongoDb.DbWordHeading => {
        const {
            base,
            reading,
            ...dbHeading
        } = apiHeading

        return dbHeading
    }

    const {
        id,
        ...dbWord
    } = {
        ...apiWord,
        _id: apiWord.id,
        headings: apiWord.headings.map(translateHeading),
        date: new Date(),
        lookUp,
    }

    return dbWord
}


const stopWords = new Set([
    "a", "an", "the", "to", "of", "in", "on", "from",
    "e.g.", "i.e.", "etc.", "esp.",
    "'s",
])


function gatherDefinitionEntries(
    apiWord: Api.Word.Entry)
{
    const results: MongoDb.DbDefinitionEntry[] = []

    const splitParentheses = (str: string): [outside: string, inside: string] => {
        let nesting = 0
        let outsideParen = ""
        let insideParen = ""

        for (const c of str)
        {
            if (c == "(")
            {
                nesting++
                insideParen += " "
                outsideParen += " "
            }
            else if (c == ")")
            {
                nesting--
                insideParen += " "
                outsideParen += " "
            }
            else
            {
                if (nesting > 0)
                    insideParen += c
                else
                    outsideParen += c
            }
        }

        return [outsideParen, insideParen]
    }

    for (let i = 0; i < apiWord.senses.length; i++)
    {
        type Gloss = {
            str: string
            score: number
            index: number
        }

        const glosses = apiWord.senses[i].gloss
        const newGlosses: Gloss[] = []
        for (let g = 0; g < glosses.length; g++)
        {
            const apiGloss = glosses[g]
            const gloss = typeof apiGloss === "string" ?
                apiGloss :
                apiGloss.text
            
            const [outsideParen, insideParen] = splitParentheses(gloss)
            newGlosses.push({ str: outsideParen, score: 1, index: g })

            if (outsideParen != gloss)
                newGlosses.push({ str: gloss.replace(/\(|\)/g, " "), score: 0.5, index: g })
        }

        for (const gloss of newGlosses)
        {
            const normalizedGloss = gloss.str
                .replace(/\(|\)|\,|\.|\/|\"/g, " ")

            const wordsWithDuplicates = normalizedGloss
                .split(" ")
                .map(w => w.trim().toLowerCase())
                .filter(w => !!w)

            const words = [...new Set(wordsWithDuplicates)]
                //.filter(w => !stopWords.has(w))

            const specificityScore = 3 * Math.max(0, 5 - words.length)
            const senseOrderScore = 5 * Math.max(0, 5 - i)
            const glossOrderScore = 1 * Math.max(0, 5 - gloss.index)

            const entryScore = (apiWord.score >= 5000) ?
                apiWord.score / 10000 * 4.5 :
                apiWord.score / 1000 * 4.5

            const score = gloss.score *
                (specificityScore +
                senseOrderScore +
                glossOrderScore +
                entryScore)

            for (const word of [...words])
            {
                if (word.indexOf("-") >= 0 || word.indexOf("'") >= 0)
                {
                    const regex = /\-|\'/g

                    words.push(...word.split(regex)
                        .map(w => w.trim())
                        .filter(w => !!w))

                    words.push(word.replace(regex, ""))
                }
            }
            
            results.push({
                _id: `${apiWord.id}.${results.length}`,
                wordId: apiWord.id,
                score,
                words,
                /*mult: gloss.score,
                sScore: specificityScore,
                soIndex: i,
                soScore: senseOrderScore,
                goIndex: gloss.index,
                goScore: glossOrderScore,
                eScore: entryScore,*/
            })
        }
    }

    return results
}