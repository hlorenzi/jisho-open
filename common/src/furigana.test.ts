import * as Furigana from "./furigana.ts"
import assert from "assert"


export function test()
{
    assert.deepStrictEqual(
        Furigana.match("", ""),
        [[["", ""]]])

    assert.deepStrictEqual(
        Furigana.match("よい", ""),
        [[["よい", ""]]])

    assert.deepStrictEqual(
        Furigana.match("", "よい"),
        [[["", "よい"]]])

    assert.deepStrictEqual(
        Furigana.match("よいね", "よい"),
        [[["よいね", "よい"]]])

    assert.deepStrictEqual(
        Furigana.match("よい", "よいね"),
        [[["よい", "よいね"]]])

    assert.deepStrictEqual(
        Furigana.match("よい", "よい"),
        [
            [["よい", ""]]
        ])

    assert.deepStrictEqual(
        Furigana.match("いい", "いい"),
        [
            [["いい", ""]]
        ])

    assert.deepStrictEqual(
        Furigana.match("黄色", "きいろ"),
        [
            [["黄色", "きいろ"]]
        ])

    assert.deepStrictEqual(
        Furigana.match("黄色い", "きいろい"),
        [
            [["黄色", "きいろ"], ["い", ""]]
        ])

    assert.deepStrictEqual(
        Furigana.match("黄色い声", "きいろいこえ"),
        [
            [["黄色", "き"], ["い", ""], ["声", "ろいこえ"]],
            [["黄色", "きいろ"], ["い", ""], ["声", "こえ"]],
        ])

    assert.deepStrictEqual(
        Furigana.match("聞き取り", "ききとり"),
        [
            [["聞", "き"], ["き", ""], ["取", "と"], ["り", ""]]
        ])

    assert.deepStrictEqual(
        Furigana.match("お金", "おかね"),
        [
            [["お", ""], ["金", "かね"]]
        ])

    assert.deepStrictEqual(
        Furigana.match("お祝いです", "おいわいです"),
        [
            [["お", ""], ["祝", "いわ"], ["いです", ""]]
        ])

    assert.deepStrictEqual(
        Furigana.match("現つを抜かす", "うつつをぬかす"),
        [
            [["現", "うつ"], ["つを", ""], ["抜", "ぬ"], ["かす", ""]]
        ])

    assert.deepStrictEqual(
        Furigana.match("ブラジル・ポルトガル語", "ブラジルポルトガルご"),
        [
            [["ブラジル・ポルトガル語", "ブラジルポルトガルご"]]
        ])

    assert.deepStrictEqual(
        Furigana.match("鱧も一期、海老も一期", "はももいちごえびもいちご"),
        [
            [["鱧", "は"], ["も", ""], ["一期、海老", "もいちごえび"], ["も", ""], ["一期", "いちご"]],
            [["鱧", "はも"], ["も", ""], ["一期、海老", "いちごえび"], ["も", ""], ["一期", "いちご"]],
            [["鱧", "はももいちごえび"], ["も", ""], ["一期、海老も一期", "いちご"]]
        ])

    const kanjiReadings = new Map()
    kanjiReadings.set("黄", ["き"])
    kanjiReadings.set("色", ["いろ"])
    kanjiReadings.set("明", ["あ"])
    kanjiReadings.set("日", ["にち"])
    kanjiReadings.set("明日", ["あした"])
    kanjiReadings.set("本", ["ほん"])
    kanjiReadings.set("伯", ["はく"])
    kanjiReadings.set("衆", ["しゅう"])
    kanjiReadings.set("蜘", ["くも"])
    kanjiReadings.set("蛛", [""])
    kanjiReadings.set("打", ["う", "うつ", "うち"])
    kanjiReadings.set("合", ["が", "がっ", "かっ", "あう", "あわす", "あわせる"])
    kanjiReadings.set("作", ["さく", "さ"])
    kanjiReadings.set("家", ["いえ", "か"])
    kanjiReadings.set("聞", ["き", "きき"])
    kanjiReadings.set("取", ["と", "とり"])
    kanjiReadings.set("冷", ["ひ", "ひえる"])
    kanjiReadings.set("者", ["もの"])
    kanjiReadings.set("体", ["からだ", "かたち", "たい", "てい"])
    kanjiReadings.set("十", ["と", "とお"])
    kanjiReadings.set("夜", ["よる", "や"])
    kanjiReadings.set("誰", ["だれ"])
    kanjiReadings.set("語", ["ご"])
    kanjiReadings.set("ｗｅｂ", ["うぇぶ"])
    kanjiReadings.set("拍", ["はく"])
    kanjiReadings.set("手", ["しゅ"])
    kanjiReadings.set("楽", ["うたまい"])
    kanjiReadings.set("歌", ["うた"])
    kanjiReadings.set("舞", ["まい"])
    kanjiReadings.set("人", ["ひと"])
    kanjiReadings.set("大和", ["やまと"])
    kanjiReadings.set("小灰蝶", ["しじみ"])
    kanjiReadings.set("蜆蝶", ["しじみ"])
    kanjiReadings.set("佳", ["よし"])

    const furiganaPatches = new Map()
    furiganaPatches.set("蜆蝶;しじみ", [["蜆", "しじみ"], ["蝶", ""]])
    furiganaPatches.set("小灰蝶;しじみ", [["小灰", "しじみ"], ["蝶", ""]])

    const getKanjiReading: Furigana.GetKanjiReadingFn = (k) => kanjiReadings.get(k)
    const getFuriganaPatch: Furigana.GetFuriganaPatchFn = (k) => furiganaPatches.get(k)

    assert.deepStrictEqual(
        Furigana.revise(Furigana.match("よい", "よい"), getKanjiReading),
        [["よい", ""]])

    assert.deepStrictEqual(
        Furigana.revise(Furigana.match("黄色い", "きいろい"), getKanjiReading),
        [["黄", "き"], ["色", "いろ"], ["い", ""]])
        
    assert.deepStrictEqual(
        Furigana.revise(Furigana.match("黄色い声", "きいろいこえ"), getKanjiReading),
        [["黄", "き"], ["色", "いろ"], ["い", ""], ["声", "こえ"]])
        
    assert.deepStrictEqual(
        Furigana.revise(Furigana.match("聞き取り", "ききとり"), getKanjiReading),
        [["聞", "き"], ["き", ""], ["取", "と"], ["り", ""]])

    assert.deepStrictEqual(
        Furigana.revise(Furigana.match("明日", "あした"), getKanjiReading),
        [["明日", "あした"]])
        
    assert.deepStrictEqual(
        Furigana.revise(Furigana.match("日伯", "にっぱく"), getKanjiReading),
        [["日", "にっ"], ["伯", "ぱく"]])

    assert.deepStrictEqual(
        Furigana.revise(Furigana.match("合衆", "がっしゅう"), getKanjiReading),
        [["合", "がっ"], ["衆", "しゅう"]])

    assert.deepStrictEqual(
        Furigana.revise(Furigana.match("蜘蛛", "くも"), getKanjiReading),
        [["蜘蛛", "くも"]])

    assert.deepStrictEqual(
        Furigana.revise(Furigana.match("打合せ", "うちあわせ"), getKanjiReading),
        [["打", "うち"], ["合", "あわ"], ["せ", ""]])

    assert.deepStrictEqual(
        Furigana.revise(Furigana.match("作家", "さっか"), getKanjiReading),
        [["作", "さっ"], ["家", "か"]])

    assert.deepStrictEqual(
        Furigana.revise(Furigana.match("冷者", "ひえもの"), getKanjiReading),
        [["冷", "ひえ"], ["者", "もの"]])

    assert.deepStrictEqual(
        Furigana.revise(Furigana.match("合体", "がったい"), getKanjiReading),
        [["合", "がっ"], ["体", "たい"]])

    assert.deepStrictEqual(
        Furigana.revise(Furigana.match("日本", "にほん"), getKanjiReading),
        [["日", "に"], ["本", "ほん"]])

    assert.deepStrictEqual(
        Furigana.revise(Furigana.match("十日夜", "とおかんや"), getKanjiReading),
        [["十", "とお"], ["日", "かん"], ["夜", "や"]])

    assert.deepStrictEqual(
        Furigana.revise(Furigana.match("誰々", "だれだれ"), getKanjiReading),
        [["誰", "だれ"], ["々", "だれ"]])

    assert.deepStrictEqual(
        Furigana.revise(Furigana.match("ｗｅｂ拍手", "ウェブはくしゅ"), getKanjiReading),
        [["ｗｅｂ", "ウェブ"], ["拍", "はく"], ["手", "しゅ"]])

    assert.deepStrictEqual(
        Furigana.revise(Furigana.match("ブラジル・ポルトガル語", "ブラジルポルトガルご"), getKanjiReading),
        [["ブラジル・ポルトガル", ""], ["語", "ご"]])

    assert.deepStrictEqual(
        Furigana.revise(Furigana.match("日、本", "にちほん"), getKanjiReading),
        [["日", "にち"], ["、", ""], ["本", "ほん"]])

    assert.deepStrictEqual(
        Furigana.revise(Furigana.match("楽人", "うたまいのひと"), getKanjiReading),
        [["楽", "うたまい"], ["", "の"], ["人", "ひと"]])

    assert.deepStrictEqual(
        Furigana.revise(Furigana.match("歌舞人", "うたまいのひと"), getKanjiReading),
        [["歌", "うた"], ["舞", "まい"], ["", "の"], ["人", "ひと"]])

    assert.deepStrictEqual(
        Furigana.patch(Furigana.revise(Furigana.match("蜆蝶", "しじみ"), getKanjiReading), getFuriganaPatch),
        [["蜆", "しじみ"], ["蝶", ""]])

    assert.deepStrictEqual(
        Furigana.patch(Furigana.revise(Furigana.match("大和小灰蝶", "やまとしじみ"), getKanjiReading), getFuriganaPatch),
        [["大和", "やまと"], ["小灰", "しじみ"], ["蝶", ""]])

    assert.deepStrictEqual(
        Furigana.patch(Furigana.revise(Furigana.match("与佳", "のぶよし"), getKanjiReading), getFuriganaPatch),
        [["与", "のぶ"], ["佳", "よし"]])

    console.log("success")
}


test()