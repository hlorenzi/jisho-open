// @ts-expect-error
import Kuromoji from "kuromoji"
import * as Db from "../db/index.ts"
import * as Api from "common/api/index.ts"
import * as Kana from "common/kana.ts"
import * as Furigana from "common/furigana.ts"


type Tokenizer = {
    tokenize: (query: string) => RawToken[]
}


type RawToken = {
    word_id: number
    word_type: string
    word_position: number
    surface_form: string
    pos: string
    pos_detail_1: string
    pos_detail_2: string
    pos_detail_3: string
    conjugated_type: string
    conjugated_form: string
    basic_form: string
    reading: string
    pronunciation: string
}


const kuromojiTokenizer = new Promise<Tokenizer>((resolve, reject) => {
	Kuromoji
        .builder({ dicPath: "./node_modules/kuromoji/dict" })
        .build((err: any, tokenizer: Tokenizer) => {
            if (err)
                reject(err)
            else
                resolve(tokenizer)
        })
})


export async function tokenize(
    db: Db.Interface,
    query: string)
    : Promise<Api.Search.SentenceAnalysis>
{
    const morpho = (await kuromojiTokenizer).tokenize(query)
    if (!morpho)
        return { tokens: [] }

    //console.dir(morpho, { depth: null })

    const result: Api.Search.SentenceToken[] = []

    const translateCategory = (term: string, pos: string, pos_detail_1: string): Api.Word.PartOfSpeechTag => {
        if (term === "じゃない" &&
            pos === "助詞")
            return "unc"
        
        switch (pos)
        {
            case "名詞":
                switch (pos_detail_1)
                {
                    case "代名詞": return "pn"
                    default: return "n"
                }
            case "動詞": return "v"
            case "助動詞": return "unc"
            case "形容詞":
                switch (pos_detail_1)
                {
                    case "自立": return "adv"
                    default: return "adj"
                }
            case "形容動詞": return "adj"
            case "助詞": return "prt"
            default: return "unc"
        }
    }

    let i = 0
    while (i < morpho.length)
    {
        const baseToken = morpho[i]
        const basePos = baseToken.pos
        const baseDetail1 = baseToken.pos_detail_1
        const isBaseNoun = basePos === "名詞" && baseDetail1 !== "代名詞"
        const isBaseVerb = basePos === "動詞"
        const isBaseAdjI = basePos === "形容詞"
        const isBaseAdjNa = basePos === "名詞" && baseDetail1 === "形容動詞語幹"
        const isBaseNounSuruVerb = basePos === "名詞" && baseDetail1 === "サ変接続"

        let madeSuruVerb = false

        let newToken: Api.Search.SentenceToken | null = null
        let joinLen = 0
        while (i + joinLen < morpho.length)
        {
            const joinToken = morpho[i + joinLen]
            if (!joinToken)
                break

            const joinSlice = morpho.slice(i, i + joinLen + 1)
            const joined = joinSlice.map(t => t.surface_form).join("")

            const dictRes = await db.searchByHeading([joined], { limit: 1 })

            let canJoin =
                isBaseNoun &&
                dictRes.length > 0
            
            let stopJoin = false

            if (isBaseNounSuruVerb)
            {
                if (joinToken.pos === "動詞" &&
                    joinToken.basic_form === "する")
                {
                    canJoin = true
                    madeSuruVerb = true
                }
            }

            if (isBaseVerb ||
                madeSuruVerb)
            {
                //console.log("fix verb", joined, joinToken.pos)
                if (joinToken.pos == "助動詞")
                {
                    if (joinToken.basic_form == "た" ||
                        joinToken.basic_form == "ない" ||
                        joinToken.basic_form == "ます" ||
                        joinToken.basic_form == "ん" ||
                        joinToken.basic_form == "う" ||
                        joinToken.basic_form == "ぬ")
                        canJoin = true
                        
                    if (joinToken.basic_form == "です" && joined.endsWith("ませんでし"))
                        canJoin = true
                }

                if (joinToken.pos == "助詞")
                {
                    if (joinToken.surface_form == "て" ||
                        joinToken.surface_form == "で" ||
                        joinToken.surface_form == "たり" ||
                        joinToken.surface_form == "だり")
                        canJoin = true
                    
                    if (joinToken.surface_form == "ば")
                    {
                        canJoin = true
                        stopJoin = true
                    }
                }
                
                if (joinToken.pos != "名詞" && joinToken.pos != "助詞")
                {
                    if (joinToken.pos_detail_1 == "接尾" ||
                        joinToken.pos_detail_1 == "接続助詞" ||
                        joinToken.pos_detail_1 == "非自立") // aux. verbs after te-form
                        canJoin = true
                }

                if (joinToken.surface_form == "ば")
                {
                    canJoin = true
                    stopJoin = true
                }
            }

            if (isBaseAdjI)
            {
                //console.log("fix adj-i", joined, joinToken.pos)
                if (joinToken.pos == "助動詞")
                {
                    if (joinToken.basic_form == "た" ||
                        joinToken.basic_form == "ない")
                        canJoin = true
                }

                if (joinToken.pos == "名詞")
                {
                    if (joinToken.basic_form == "さ" && joinToken.pos_detail_1 == "接尾")
                        canJoin = true
                }

                if ((joinToken.surface_form == "て" || joinToken.surface_form == "で") &&
                    joinToken.pos == "助詞" && joinToken.pos_detail_1 == "接続助詞")
                    canJoin = true

                if (joinToken.pos != "名詞" && joinToken.pos != "助詞")
                {
                    if (joinToken.conjugated_type == "特殊・タ" ||
                        joinToken.pos_detail_1 == "接尾" ||
                        joinToken.pos_detail_1 == "接続助詞" ||
                        joinToken.pos_detail_1 == "非自立")
                        canJoin = true
                }

                if (joinToken.surface_form == "ば")
                {
                    canJoin = true
                    stopJoin = true
                }
            }

            if (isBaseAdjNa)
            {
                if (joinToken.surface_form === "な" &&
                    joinToken.pos === "助動詞")
                {
                    canJoin = true
                    stopJoin = true
                }
            }

            if (baseToken.pos === "助詞" &&
                baseToken.surface_form === "じゃ")
            {
                if (joinToken.basic_form === "ない" &&
                    joinToken.pos === "助動詞")
                {
                    canJoin = true
                }
            }

            if (baseToken.pos === "助動詞" &&
                (baseToken.surface_form === "だろ" ||
                    baseToken.surface_form === "でしょ"))
            {
                if (joinToken.surface_form === "う" &&
                    joinToken.pos === "助動詞")
                {
                    canJoin = true
                    stopJoin = true
                }
            }

            if (!canJoin && joinLen == 0)
            {
                joinLen++
                continue
            }

            if (!canJoin)
                break

            if (dictRes.length > 0)
            {
                let head = dictRes[0].headings.find(h => h.base === joined)
                if (!head)
                    dictRes[0].headings.find(h => h.reading === joined)

                if (!head)
                {
                    newToken = {
                        surface_form: joined,
                        basic_form: joined,
                        category: translateCategory(joined, basePos, baseDetail1),
                        pronunciation: joinSlice.map(t => t.pronunciation).join(""),
                        furigana: "",
                    }
                }
                else
                {
                    newToken = {
                        surface_form: joined,
                        basic_form: joinLen == 0 ? morpho[i].basic_form : joined,
                        category: translateCategory(joined, basePos, baseDetail1),
                        furigana: head.furigana,
                    }
                }
            }
            else
            {
                newToken = {
                    surface_form: joined,
                    basic_form: joined,
                    category: translateCategory(joined, basePos, baseDetail1),
                    pronunciation: joinSlice.map(t => t.pronunciation).join(""),
                    furigana: "",
                }
            }

            joinLen++
            if (stopJoin)
                break
            //console.log("found")
        }

        if (newToken)
        {
            result.push(newToken)
            i += joinLen
        }
        else
        {
            const rawToken = morpho[i]

            result.push({
                surface_form: rawToken.surface_form,
                basic_form: rawToken.basic_form,
                category: translateCategory(rawToken.surface_form, rawToken.pos, rawToken.pos_detail_1),
                pronunciation: rawToken.pronunciation,
                furigana: "",
            })

            i += 1
        }
    }

    for (const token of result)
    {
        if (token.furigana === "")
            token.furigana = token.surface_form + ";"

        if (token.pronunciation === undefined)
            continue
        
        const furi = Furigana.match(
            token.surface_form,
            Kana.toHiragana(token.pronunciation ?? ""))
        
        token.furigana = Furigana.encode(furi[0])
        token.pronunciation = undefined
    }

    return { tokens: result.filter(t => t.surface_form.trim().length !== 0) }
}