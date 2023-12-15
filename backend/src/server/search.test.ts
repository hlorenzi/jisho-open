import * as MongoDb from "../db/mongodb/index.ts"
import * as ServerSearch from "./search.ts"


await test()
process.exit(0)


export async function test()
{
    const db = await MongoDb.connect()


    const expectWord = async (
        query: string,
        expectedHeadingBase: string,
        expectedHeadingReading?: string) =>
    {
        console.log(`testing \`${ query }\`...`)

        const results = await ServerSearch.search(db, { query, limit: 10 })

        for (const entry of results.entries)
        {
            if (entry.type === "section")
                continue

            if (entry.type !== "word")
                throw `wrong results for \`${ query }\`: got entry type \`${ entry.type }\``

            if (!entry.headings.some(h =>
                    h.base === expectedHeadingBase &&
                    (h.reading === expectedHeadingBase ||
                        h.reading === expectedHeadingReading)))
            {
                throw `wrong results for \`${ query }\`: ` +
                    entry.headings
                        .map(h => "[" + h.base + ", " + h.reading + "]")
                        .join("; ")
            }
            
            return
        }

        throw `no entry results for "${ query }"`
    }

    const expectWordFirstHeading = async (
        query: string,
        expectedHeadingBase: string,
        expectedHeadingReading?: string) =>
    {
        console.log(`testing \`${ query }\`...`)

        const results = await ServerSearch.search(db, { query, limit: 10 })

        for (const entry of results.entries)
        {
            if (entry.type === "section")
                continue

            if (entry.type !== "word")
                throw `wrong results for \`${ query }\`: got entry type \`${ entry.type }\``

            if (entry.headings[0].base !== expectedHeadingBase ||
                (entry.headings[0].reading !== expectedHeadingBase &&
                    entry.headings[0].reading !== expectedHeadingReading))
            {
                throw `wrong results for \`${ query }\`: ` +
                    entry.headings
                        .map(h => "[" + h.base + ", " + h.reading + "]")
                        .join("; ")
            }
            
            return
        }

        throw `no entry results for "${ query }"`
    }

    const expectKanji = async (
        query: string,
        expectedKanji: string) =>
    {
        console.log(`testing \`${ query }\`...`)

        const results = await ServerSearch.search(db, { query, limit: 10 })

        for (const entry of results.entries)
        {
            if (entry.type === "section")
                continue

            if (entry.type !== "kanji")
                throw `wrong results for \`${ query }\`: got entry type \`${ entry.type }\``

            if (entry.id !== expectedKanji)
                throw `wrong results for \`${ query }\`: got kanji \`${ entry.id }\``
            
            return
        }

        throw `no entry results for "${ query }"`
    }
    
    const expectSentence = async (
        query: string,
        expectedFragments: string[]) =>
    {
        console.log(`testing \`${ query }\`...`)
        
        const results = await ServerSearch.search(db, { query, limit: 10 })

        for (const entry of results.entries)
        {
            if (entry.type === "section")
                continue

            if (entry.type !== "sentence")
                throw `wrong results for \`${ query }\`: got entry type \`${ entry.type }\``

            if (entry.tokens.length !== expectedFragments.length)
                throw `wrong results for \`${ query }\`: length mismatch [${ entry.tokens.map(t => t.surface_form).join(", ") }]`

            for (let i = 0; i < expectedFragments.length; i++)
            {
                if (expectedFragments[i] !== entry.tokens[i].surface_form)
                    throw `wrong results for \`${ query }\`: token mistmatch at #${ i } [${ entry.tokens.map(t => t.surface_form).join(", ") }]`
            }

            return
        }

        throw `no entry results for "${ query }"`
    }


    await expectWordFirstHeading("烏賊", "イカ", undefined)
    await expectWordFirstHeading("烏賊フライ", "イカフライ", undefined)
    await expectWordFirstHeading("海豚", "イルカ", undefined)
    await expectWordFirstHeading("玩具", "おもちゃ", undefined)
    await expectWordFirstHeading("鞄", "かばん", undefined)
    await expectWordFirstHeading("葡萄", "ぶどう", undefined)
    await expectWordFirstHeading("不味い", "まずい", undefined)
    await expectWordFirstHeading("掏摸", "すり", undefined)
    await expectWordFirstHeading("綺麗", "綺麗", "きれい")
    await expectWordFirstHeading("凄い", "すごい", undefined)
    await expectWordFirstHeading("螺子", "ネジ", undefined)
    await expectWordFirstHeading("薔薇", "ばら", undefined)

    await expectWord("cat", "猫", "ねこ")
    await expectWord("white cat", "白猫", "しろねこ")
    await expectWord("dog", "犬", "いぬ")
    await expectWord("house", "家", "いえ")
    await expectWord("rose", "薔薇", "ばら")
    await expectWord("fire", "ヒレ", undefined)
    await expectWord("to fire", "飛ばす", "とばす")
    await expectWord("fire to", "飛ばす", "とばす")
    await expectWord("drink", "飲み物", "のみもの")
    await expectWord("to drink", "飲む", "のむ")
    await expectWord("coffee", "珈琲", "コーヒー")
    await expectWord("canis lupus familiaris", "犬", "いぬ")
    await expectWord("canis lupus", "犬", "いぬ")
    await expectWord("father", "お父さん", "おとうさん")
    await expectWord("mother", "お母さん", "おかあさん")
    await expectWord("i", "Ｉ", "アイ")
    await expectWord("me", "目", "め")

    await expectWord("email", "電子メール", "でんしメール")
    await expectWord("e-mail", "電子メール", "でんしメール")
    await expectWord("e mail", "電子メール", "でんしメール")

    await expectWord("\"cat\"", "猫", "ねこ")
    await expectWord("\"white\" \"cat\"", "白猫", "しろねこ")
    await expectWord("\"dog\"", "犬", "いぬ")
    await expectWord("\"house\"", "家", "いえ")
    await expectWord("\"rose\"", "薔薇", "ばら")
    await expectWord("\"fire\"", "火", "ひ")
    await expectWord("\"to fire\"", "飛ばす", "とばす")
    await expectWord("\"fire to\"", "飛ばす", "とばす")
    await expectWord("\"drink\"", "飲み物", "のみもの")
    await expectWord("\"to drink\"", "飲む", "のむ")
    await expectWord("\"i\"", "私", "わたし")
    await expectWord("\"I\"", "私", "わたし")
    await expectWord("\"me\"", "私", "わたし")
    await expectWord("\"e-mail\"", "電子メール", "でんしメール")

    await expectWord("“me”", "私", "わたし")
    await expectWord("„me‟", "私", "わたし")
    await expectWord("＂me＂", "私", "わたし")

    await expectWord("ねこ", "猫", "ねこ")
    await expectWord("いぬ", "犬", "いぬ")
    await expectWord("いえ", "家", "いえ")
    await expectWord("こーひー", "珈琲", "コーヒー")
    await expectWord("コーヒー", "珈琲", "コーヒー")

    await expectWord("御苦労様", "御苦労様", "ごくろうさま")
    await expectWord("御く労様", "御苦労様", "ごくろうさま")
    await expectWord("御苦ろう様", "御苦労様", "ごくろうさま")
    await expectWord("御くろう様", "御苦労様", "ごくろうさま")
    await expectWord("御苦ろうさま", "御苦労様", "ごくろうさま")
    await expectWord("ご苦ろう様", "御苦労様", "ごくろうさま")

    await expectWord("neko", "猫", "ねこ")
    await expectWord("inu", "犬", "いぬ")
    await expectWord("ie", "家", "いえ")
    await expectWord("batoru", "バトル", undefined)
    await expectWord("TAberu", "食べる", "たべる")
    await expectWord("sironeko", "白猫", "しろねこ")
    await expectWord("shironeko", "白猫", "しろねこ")
    await expectWord("SIRONEKO", "白猫", "しろねこ")
    await expectWord("ko-hi-", "珈琲", "コーヒー")
    await expectWord("an'ya", "暗夜", "あんや")
    
    await expectWord("猫", "猫", "ねこ")
    await expectWord("犬", "犬", "いぬ")
    await expectWord("家", "家", "いえ")
    await expectWord("珈琲", "珈琲", "コーヒー")

    await expectWord("家 うち", "うち", undefined)
    await expectWord("食べる　たべる", "食べる", "たべる")

    await expectWord("食べない", "食べる", "たべる")
    await expectWord("食benai", "食べる", "たべる")
    await expectWord("sitemasen", "する", undefined)
    await expectWord("motteikimasu", "持っていく", "もっていく")
    await expectWord("benkyousiezari", "勉強", "べんきょう")
    await expectWord("食べて", "食べる", "たべる")
    await expectWord("食べてしまう", "食べる", "たべる")
    await expectWord("食べてしまった", "食べる", "たべる")
    await expectWord("食べちゃう", "食べる", "たべる")
    await expectWord("食べちゃった", "食べる", "たべる")
    await expectWord("食べちまう", "食べる", "たべる")
    await expectWord("食べちまった", "食べる", "たべる")
    
    await expectWord("siroi #!name", "白い", "しろい")
    await expectWord("siroi #adj-i", "白い", "しろい")
    await expectWord("siroi #adj", "白い", "しろい")
    await expectWord("siroi #!adj #!name", "白石", "しろいし")
    await expectWord("sirokunai #adj", "白い", "しろい")
    await expectWord("siroi #name", "支路遺", "しろい")

    await expectWord("nara", "ならば", undefined)
    await expectWord("\"nara\"", "奈良", "なら")
    await expectWord("nara #name", "ナラ", undefined)
    await expectWord("\"nara\" #name", "ナーラ", undefined)

    await expectWord("#veryCommon #v5m #vi", "休む", "やすむ")
    await expectWord("#veryCommon#v5m#vi", "休む", "やすむ")
    await expectWord("#v5b #vi #common", "遊ぶ", "あそぶ")
    
    await expectKanji("剣 #kanji", "剣")
    await expectKanji("剣 #k", "剣")
    await expectKanji("白石#k", "白")
    await expectKanji("#k雨遊", "雨")
    await expectKanji("ば火 #k", "火")
    await expectKanji("蛇スープ #k", "蛇")

    await expectKanji("i #kanji", "意")
    await expectKanji("na #kanji", "無")
    await expectKanji("na mei #kanji", "名")
    await expectKanji("ba #kanji", "場")
    await expectKanji("ba ma #kanji", "馬")
    await expectKanji("い #kanji", "意")
    await expectKanji("い] #kanji", "意")
    await expectKanji("イ #kanji", "意")
    await expectKanji("な #kanji", "無")
    await expectKanji("na めい #kanji", "名")
    await expectKanji("ナ めい #kanji", "名")
    await expectKanji("sa #kanji", "作")
    await expectKanji("uma #kanji", "馬")
    await expectKanji("ma #kanji", "間")

    await expectKanji("eat #kanji", "食")
    await expectKanji("eat food #kanji", "食")
    await expectKanji("food eat #kanji", "食")
    await expectKanji("\"eat\" #kanji", "食")
    await expectKanji("\"eat\" \"food\" #kanji", "食")
    await expectKanji("\"eat food\" #kanji", "食")
    await expectKanji("make #kanji", "負")
    await expectKanji("\"make\" #kanji", "作")
    await expectKanji("water #kanji", "水")

    await expectWord("??直*", "真っ直ぐ", "まっすぐ")
    await expectWord("??ま*", "車", "くるま")
    await expectWord("??ma*", "車", "くるま")
    await expectWord("web*", "ｗｅｂ拍手", "ウェブはくしゅ")
    await expectWord("ｗｅｂ*", "ｗｅｂ拍手", "ウェブはくしゅ")
    await expectWord("ウェブ*", "ウェブサイト", undefined)
    await expectWord("gugu?", "ググる", undefined)
    await expectWord("ぐぐ?", "ググる", undefined)
    await expectWord("ググ?", "ググる", undefined)
    await expectWord("kompyu-*", "コンピュータ", undefined)

    await expectWord("？？直＊", "真っ直ぐ", "まっすぐ")
    await expectWord("？？ま＊", "車", "くるま")
    await expectWord("？？ma＊", "車", "くるま")
    
    await expectSentence(
        "毎日私は学校に鉛筆を持っていきますよ。",
        ["毎日", "私", "は", "学校", "に", "鉛筆", "を", "持っていきます", "よ", "。"])
    await expectSentence(
        "ぼくのたかさ",
        ["ぼく", "の", "たかさ"])
    await expectSentence(
        "kakkoyokereba naranai",
        ["かっこよければ", "ならない"])

    console.log("passed")
}