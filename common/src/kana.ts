const toRomajiMappings = new Map<ToRomajiMode, Map<string, string>>()
const toKanaMappings = new Map<ToKanaMode, Map<string, string>>()
const toHiraganaMappings = new Map<ToKanaMode, Map<string, string>>()
const toKatakanaMappings = new Map<ToKanaMode, Map<string, string>>()


export type ToRomajiMode = "nihon" | "hepburn" | "kunrei"


export interface ToRomajiOptions
{
    mode?: ToRomajiMode
}


export type ToKanaMode = "nihon" | "hepburn" | "kunrei" | "mixed"


export interface ToKanaOptions
{
    mode?: ToKanaMode
    ignoreJapanese?: boolean
}


type SokuonMode = "hepburn" | "both" | null


export function toRomaji(str: string, options: ToRomajiOptions = {})
{
    const mode = options.mode ?? "hepburn"

    const mappings = toRomajiMappings.get(mode)
    if (mappings)
        return transform(mappings, str)

    else
    {        
        const mappings = new Map<string, string>()
        
        let table: KanaTableEntry[] = [...baseKanaTable, ...baseExtensionsTable]
        let yoonTable: KanaTableEntry[] = baseYoonTable
        let sokuonMode: SokuonMode = null

        if (mode === "hepburn")
        {
            table = mapWithRomanizationMode(table, "hepburn")
            yoonTable = mapWithRomanizationMode(yoonTable, "hepburn")
            sokuonMode = "hepburn"
        }
        else if (mode === "kunrei")
        {
            table = mapWithRomanizationMode(table, "kunrei")
            yoonTable = mapWithRomanizationMode(yoonTable, "kunrei")
        }

        table = addYoonMappings(table, yoonTable)
        table = addSokuonMappings(table, sokuonMode)
        table = addApostropheMappings(table)

        //console.dir(table, { depth: null, maxArrayLength: null })
        table.forEach(m => mappings.set(m[0], m[2]))
        table.forEach(m => mappings.set(m[1], m[2].toUpperCase()))

        toRomajiMappings.set(mode, mappings)
        return transform(mappings, str)
    }
}


export function toKana(str: string, options: ToKanaOptions = {})
{
    const mode = options.mode ?? "mixed"

    const mappings = toKanaMappings.get(mode)
    if (mappings)
        return transform(mappings, str, options)

    else
    {
        const mappings = new Map<string, string>()
            
        const kanaTable = [...baseKanaTable, ...baseExtensionsTable]
        
        let table = kanaTable
        let yoonTable = baseYoonTable
        let sokuonMode: SokuonMode = null

        if (mode === "mixed")
        {
            table = [...table, ...mapWithRomanizationMode(kanaTable, "hepburn")]
            table = [...table, ...mapWithRomanizationMode(kanaTable, "kunrei")]
            table = [...table, ...mapWithRomanizationMode(kanaTable, "others")]
            yoonTable = [...yoonTable, ...mapWithRomanizationMode(baseYoonTable, "hepburn")]
            yoonTable = [...yoonTable, ...mapWithRomanizationMode(baseYoonTable, "kunrei")]
            yoonTable = [...yoonTable, ...mapWithRomanizationMode(baseYoonTable, "others")]
            sokuonMode = "both"
        }
        else if (mode === "hepburn")
        {
            table = mapWithRomanizationMode(table, "hepburn")
            yoonTable = mapWithRomanizationMode(yoonTable, "hepburn")
            sokuonMode = "hepburn"
        }
        else if (mode === "kunrei")
        {
            table = mapWithRomanizationMode(table, "kunrei")
            yoonTable = mapWithRomanizationMode(yoonTable, "kunrei")
        }

        table = addYoonMappings(table, yoonTable)
        table = addSokuonMappings(table, sokuonMode)
        table = addApostropheMappings(table)

        if (mode === "mixed")
            table = [...table, ...romajiSmallSpecifiersTable]

        //console.dir(table, { depth: null, maxArrayLength: null })
        table.forEach(m => mappings.set(m[2], m[0]))
        table.forEach(m => mappings.set(m[2].toUpperCase(), m[1]))

        toKanaMappings.set(mode, mappings)
        return transform(mappings, str, options)
    }
}


export function toHiragana(str: string, options?: ToKanaOptions)
{
    if (!str)
        return str
    
    str = toKana(str, options)

    const mappings = toHiraganaMappings.get("mixed")
    if (mappings)
        return transform(mappings, str, options)
    
    else
    {
        const mappings = new Map<string, string>()
        
        const table = [...baseKanaTable, ...romajiSmallSpecifiersTable, ...baseExtensionsTable]
        table.forEach(m => mappings.set(m[1], m[0]))

        toHiraganaMappings.set("mixed", mappings)
        return transform(mappings, str, options)
    }

}


export function toKatakana(str: string, options?: ToKanaOptions)
{
    if (!str)
        return str
    
    str = toKana(str, options)

    const mappings = toKatakanaMappings.get("mixed")
    if (mappings)
        return transform(mappings, str, options)

    else
    {
        const mappings = new Map<string, string>()
        
        const table = [...baseKanaTable, ...romajiSmallSpecifiersTable, ...baseExtensionsTable]
        table.forEach(m => mappings.set(m[0], m[1]))

        toKatakanaMappings.set("mixed", mappings)
        return transform(mappings, str, options)
    }
}


export function normalizeWidthForms(str: string)
{
    const result = []

    const exclam = "!".codePointAt(0)!
    const fullWidthExclam = "！".codePointAt(0)!
    const fullWidthTilde = "～".codePointAt(0)!

    for (const char of [...str])
    {
        const c = char.codePointAt(0)!

        if (c >= fullWidthExclam && c <= fullWidthTilde)
            result.push(String.fromCodePoint(c - fullWidthExclam + exclam))
        else
            result.push(char)
    }

    return result.join("")
}


export function normalizeForSimilarity(str: string)
{
    str = [...str].map(c => withoutDakuten(c) || c).join("")

    let chars = [...str]
    let result = []
    for (let i = 0; i < chars.length; i++)
    {
        const row = baseKanaMap.get(chars[i])
        if (i < chars.length - 1 && row && row[3] && row[3].vowel === "i")
        {
            if (chars[i + 1] == "ゃ" || chars[i + 1] == "ャ")
                result.push(withVowel(chars[i], "a") || chars[i])
            else if (chars[i + 1] == "ゅ" || chars[i + 1] == "ュ")
                result.push(withVowel(chars[i], "u") || chars[i])
            else if (chars[i + 1] == "ょ" || chars[i + 1] == "ョ")
                result.push(withVowel(chars[i], "o") || chars[i])
            else
                result.push(chars[i])
        }
        else
            result.push(chars[i])
    }

    str = result.join("")
    str = str.replace(/っ|ッ|ー/g, "")
    str = str.replace(/ぁ|ぃ|ぅ|ぇ|ぉ|ァ|ィ|ゥ|ェ|ォ/g, "")
    str = str.replace(/ゃ|ゅ|ょ|ャ|ュ|ョ/g, "")

    chars = [...str]
    result = []
    let prevSuppressed = false
    for (let i = 0; i < chars.length; i++)
    {
        const row = baseKanaMap.get(chars[i])
        if (!prevSuppressed && i > 0 && row && row[3] && row[3].consonant === "")
        {
            const prevRow = baseKanaMap.get(chars[i - 1])
            if (prevRow && prevRow[3])
            {
                if (prevRow[3].vowel == row[3].vowel ||
                    (prevRow[3].vowel == "e" && row[3].vowel == "i") ||
                    (prevRow[3].vowel == "o" && row[3].vowel == "u"))
                    {
                        prevSuppressed = true
                        continue
                    }
            }
        }

        result.push(withVowel(chars[i], "a") || chars[i])
        prevSuppressed = false
    }

    return toHiragana(result.join(""))
}


export function isKanjiOrIterationMark(c: string)
{
    const code = c.codePointAt(0) ?? 0
    
    return (
        code == 0x3005 || // Ideographic Iteration Mark
        isKanji(c)
    )
}


export function isKanji(c: string)
{
    const code = c.codePointAt(0) ?? 0
    
    return (
        (code >= 0x4e00 && code <= 0x9fff) || // CJK Main Block
        (code >= 0x3400 && code <= 0x4dbf) || // CJK Extensions A
        (code >= 0x20000 && code <= 0x2a6df) || // CJK Extensions B
        (code >= 0x2a700 && code <= 0x2b73f) || // CJK Extensions C
        (code >= 0x2b740 && code <= 0x2b81f) || // CJK Extensions D
        (code >= 0x2b820 && code <= 0x2cea1) || // CJK Extensions E
        (code >= 0x2ceb0 && code <= 0x2ebe0) || // CJK Extensions F
        (code >= 0x30000 && code <= 0x3134f) || // CJK Extensions G
        (code >= 0x2f00 && code <= 0x2fdf) || // Kangxi Radicals
        (code >= 0x2e80 && code <= 0x2eff) || // CJK Radicals Supplement
        (code >= 0xf900 && code <= 0xfaff) || // CJK Compatibility Ideographs
        (code >= 0x2f800 && code <= 0x2fa1f) // CJK Compatibility Ideographs Supplement
    )
}


export function isJapanesePunctuation(c: string)
{
    const code = c.codePointAt(0) ?? 0
    
    return (
        (code >= 0x3001 && code <= 0x303f) ||
        (code >= 0x3099 && code <= 0x30a0) ||
        (code >= 0x30fd && code <= 0x30ff)
    )
}


export function isHiragana(c: string)
{
    const code = c.codePointAt(0) ?? 0
    
    return (
        (code >= 0x3041 && code <= 0x3096) // Hiragana
    )
}


export function isKatakana(c: string)
{
    const code = c.codePointAt(0) ?? 0
    
    return (
        (code >= 0x30a1 && code <= 0x30fc) // Katakana
    )
}


export function isJapanese(c: string)
{
    return (
        isHiragana(c) ||
        isKatakana(c) ||
        isKanji(c) ||
        isJapanesePunctuation(c)
    )
}


export function hasKanjiOrIterationMark(str: string)
{
    return [...str].some(c => isKanjiOrIterationMark(c))
}


export function hasKanji(str: string)
{
    return [...str].some(c => isKanji(c))
}


export function hasHiragana(str: string)
{
    return [...str].some(c => isHiragana(c))
}


export function hasKatakana(str: string)
{
    return [...str].some(c => isKatakana(c))
}


export function hasJapanese(str: string)
{
    return [...str].some(c => isJapanese(c))
}


export function isPureKatakana(str: string)
{
    return [...str].every(c => isKatakana(c))
}


export function vowelOf(kana: string): Vowel | null
{
    const row = baseKanaMap.get(kana)
    if (!row || !row[3]?.vowel)
        return null

    return row[3].vowel
}


export function withVowel(kana: string, newVowel: string)
{
    const row = baseKanaMap.get(kana)
    if (!row || !row[3]?.vowel)
        return null

    const newVowelTable: { [vowel: string]: string } =
    {
        a: "a", i: "i", u: "u", e: "e", o: "o",
        あ: "a", い: "i", う: "u", え: "e", お: "o",
        ア: "a", イ: "i", ウ: "u", エ: "e", オ: "o",
    }
    
    const romanization = row[2]
    const newRomanization =
        romanization.slice(0, romanization.length - 1) +
        (newVowelTable[newVowel] ?? "")

    const newRow = baseKanaRomanizationMap.get(newRomanization)
    if (!newRow)
        return null
    
    if (isHiragana(kana))
        return newRow[0]
    else
        return newRow[1]
}


export function canReceiveDakuten(kana: string)
{
    const row = baseKanaMap.get(kana)
    return !!(row && row[3]?.dakuten)
}


export function canReceiveHandakuten(kana: string)
{
    const row = baseKanaMap.get(kana)
    return !!(row && row[3]?.handakuten)
}


export function withDakuten(kana: string)
{
    const row = baseKanaMap.get(kana)
    if (!row || !row[3]?.dakuten)
        return null

    const romanization = row[2]
    const newRomanization =
        row[3].dakuten +
        romanization.slice(1)

    const newRow = baseKanaRomanizationMap.get(newRomanization)
    if (!newRow)
        return null
    
    if (isHiragana(kana))
        return newRow[0]
    else
        return newRow[1]
}


export function withHandakuten(kana: string)
{
    const row = baseKanaMap.get(kana)
    if (!row || !row[3]?.handakuten)
        return null

    const romanization = row[2]
    const newRomanization =
        row[3].handakuten +
        romanization.slice(1)

    const newRow = baseKanaRomanizationMap.get(newRomanization)
    if (!newRow)
        return null
    
    if (isHiragana(kana))
        return newRow[0]
    else
        return newRow[1]
}


export function withoutDakuten(kana: string)
{
    const row = baseKanaMap.get(kana)
    if (!row || !row[3]?.base)
        return null

    const romanization = row[2]
    const newRomanization =
        row[3].base +
        romanization.slice(1)

    const newRow = baseKanaRomanizationMap.get(newRomanization)
    if (!newRow)
        return null
    
    if (isHiragana(kana))
        return newRow[0]
    else
        return newRow[1]
}


function transform(
    mappings: Map<string, string>,
    str: string,
    options?: ToKanaOptions)
{
    let res = ""
    let i = 0
    while (i < str.length)
    {
        let foundMapping = false

        if (!options?.ignoreJapanese ||
            !isJapanese(str[i]))
        {
            for (let j = 4; j >= 1; j--)
            {
                if (i + j > str.length)
                    continue
                
                const chars = str.slice(i, i + j)
                const mapping = mappings.get(chars)
                if (mapping)
                {
                    foundMapping = true
                    res += mapping
                    i += j
                    break
                }
            }
        }

        if (!foundMapping)
        {
            res += str[i]
            i += 1
        }
    }

    return res
}


function addYoonMappings(
    mappings: KanaTableEntry[],
    yoonTable: KanaTableEntry[])
    : KanaTableEntry[]
{
    const newMappings = [...mappings]

    for (const entry of yoonTable)
    {
        const hiraganaYoon = ["ゃ", "ゅ", "ぇ", "ょ"]
        const katakanaYoon = ["ャ", "ュ", "ェ", "ョ"]
        const romajiYoon = ["a", "u", "e", "o"]

        for (let i = 0; i < hiraganaYoon.length; i++)
        {
            newMappings.push([
                entry[0] + hiraganaYoon[i],
                entry[1] + katakanaYoon[i],
                entry[2] + romajiYoon[i]
            ])
        }
    }

    return newMappings
}


function addSokuonMappings(
    mappings: KanaTableEntry[],
    mode: SokuonMode = null)
    : KanaTableEntry[]
{
    const newMappings = [...mappings]

    for (const entry of mappings)
    {
        const firstLetter = entry[2][0]
        if (firstLetter == "a" ||
            firstLetter == "i" ||
            firstLetter == "u" ||
            firstLetter == "e" ||
            firstLetter == "o" ||
            firstLetter == "y" ||
            firstLetter == "w" ||
            firstLetter == "n" ||
            firstLetter == "-" ||
            firstLetter == " ")
            continue

        const isCh = entry[2].startsWith("ch")

        if ((mode === "hepburn" || mode === "both") && isCh)
        {
            newMappings.push([
                "っ" + entry[0],
                "ッ" + entry[1],
                "t" + entry[2]
            ])
        }
        
        if (!mode || mode === "both" || !isCh)
        {
            newMappings.push([
                "っ" + entry[0],
                "ッ" + entry[1],
                firstLetter + entry[2]
            ])
        }
    }

    return newMappings
}


function addApostropheMappings(
    mappings: KanaTableEntry[])
    : KanaTableEntry[]
{
    const newMappings = [...mappings]

    for (const entry of mappings)
    {
        const firstLetter = entry[2][0]
        if (firstLetter != "a" &&
            firstLetter != "i" &&
            firstLetter != "u" &&
            firstLetter != "e" &&
            firstLetter != "o" &&
            firstLetter != "y")
            continue

        newMappings.push([
            "ん" + entry[0],
            "ン" + entry[1],
            "n'" + entry[2]
        ])
    }

    return newMappings
}


function mapWithRomanizationMode(
    mappings: KanaTableEntry[],
    mode: "hiragana" | "katakana" | "hepburn" | "kunrei" | "others")
    : KanaMappingTriplet[]
{
    const newMappings: KanaMappingTriplet[] = []

    for (const m of mappings)
    {
        if (!m[3])
        {
            newMappings.push([m[0], m[1], m[2]])
            continue
        }

        if (!(m[3] as any)[mode])
        {
            newMappings.push([m[0], m[1], m[2]])
            continue
        }

        if (mode === "hiragana")
        {
            newMappings.push([m[0], m[1], m[0]])
            continue
        }

        if (mode === "katakana")
        {
            newMappings.push([m[0], m[1], m[1]])
            continue
        }

        if (mode === "others" &&
            Array.isArray(m[3].others))
        {
            for (var alt of m[3].others)
                newMappings.push([m[0], m[1], alt])

            continue
        }

        newMappings.push([m[0], m[1], (m[3] as any)[mode]])
    }

    return newMappings
}


type Vowel = "a" | "i" | "u" | "e" | "o"


type KanaMappingTriplet = [string, string, string]


type KanaTableEntry = [
    ...KanaMappingTriplet,
    {
        vowel?: Vowel,
        consonant?: string,
        base?: string,
        dakuten?: string,
        handakuten?: string,
        hepburn?: string,
        kunrei?: string,
        others?: string[],
    }?
]


const baseKanaTable: KanaTableEntry[] =
[
    [ "ー", "ー", "-", {} ],
    [ "　", "　", " ", {} ],

    [ "あ", "ア", "a", { vowel: "a", consonant: "" } ],
    [ "い", "イ", "i", { vowel: "i", consonant: "" } ],
    [ "う", "ウ", "u", { vowel: "u", consonant: "" } ],
    [ "え", "エ", "e", { vowel: "e", consonant: "" } ],
    [ "お", "オ", "o", { vowel: "o", consonant: "" } ],
    
    [ "か", "カ", "ka", { vowel: "a", consonant: "k", dakuten: "g" } ],
    [ "き", "キ", "ki", { vowel: "i", consonant: "k", dakuten: "g" } ],
    [ "く", "ク", "ku", { vowel: "u", consonant: "k", dakuten: "g" } ],
    [ "け", "ケ", "ke", { vowel: "e", consonant: "k", dakuten: "g" } ],
    [ "こ", "コ", "ko", { vowel: "o", consonant: "k", dakuten: "g" } ],
    
    [ "が", "ガ", "ga", { vowel: "a", consonant: "g", base: "k" } ],
    [ "ぎ", "ギ", "gi", { vowel: "i", consonant: "g", base: "k" } ],
    [ "ぐ", "グ", "gu", { vowel: "u", consonant: "g", base: "k" } ],
    [ "げ", "ゲ", "ge", { vowel: "e", consonant: "g", base: "k" } ],
    [ "ご", "ゴ", "go", { vowel: "o", consonant: "g", base: "k" } ],
    
    // Inverted TA and SA columns for correct Kunrei romaji->kana mapping
    [ "た", "タ", "ta", { vowel: "a", consonant: "t", dakuten: "d" } ],
    [ "ち", "チ", "ti", { vowel: "i", consonant: "t", dakuten: "d", hepburn: "chi" } ],
    [ "つ", "ツ", "tu", { vowel: "u", consonant: "t", dakuten: "d", hepburn: "tsu" } ],
    [ "て", "テ", "te", { vowel: "e", consonant: "t", dakuten: "d" } ],
    [ "と", "ト", "to", { vowel: "o", consonant: "t", dakuten: "d" } ],
    
    [ "だ", "ダ", "da", { vowel: "a", consonant: "d", base: "t" } ],
    [ "ぢ", "ヂ", "di", { vowel: "i", consonant: "d", base: "t", hepburn: "ji", kunrei: "zi", others: ["dji"] } ],
    [ "づ", "ヅ", "du", { vowel: "u", consonant: "d", base: "t", hepburn: "zu", kunrei: "zu", others: ["dzu"] } ],
    [ "で", "デ", "de", { vowel: "e", consonant: "d", base: "t" } ],
    [ "ど", "ド", "do", { vowel: "o", consonant: "d", base: "t" } ],
    
    // Inverted TA and SA columns for correct Kunrei romaji->kana mapping
    [ "さ", "サ", "sa", { vowel: "a", consonant: "s", dakuten: "z" } ],
    [ "し", "シ", "si", { vowel: "i", consonant: "s", dakuten: "z", hepburn: "shi" } ],
    [ "す", "ス", "su", { vowel: "u", consonant: "s", dakuten: "z" } ],
    [ "せ", "セ", "se", { vowel: "e", consonant: "s", dakuten: "z" } ],
    [ "そ", "ソ", "so", { vowel: "o", consonant: "s", dakuten: "z" } ],
    
    [ "ざ", "ザ", "za", { vowel: "a", consonant: "z", base: "s" } ],
    [ "じ", "ジ", "zi", { vowel: "i", consonant: "z", base: "s", hepburn: "ji" } ],
    [ "ず", "ズ", "zu", { vowel: "u", consonant: "z", base: "s" } ],
    [ "ぜ", "ゼ", "ze", { vowel: "e", consonant: "z", base: "s" } ],
    [ "ぞ", "ゾ", "zo", { vowel: "o", consonant: "z", base: "s" } ],
    
    [ "な", "ナ", "na", { vowel: "a", consonant: "n" } ],
    [ "に", "ニ", "ni", { vowel: "i", consonant: "n" } ],
    [ "ぬ", "ヌ", "nu", { vowel: "u", consonant: "n" } ],
    [ "ね", "ネ", "ne", { vowel: "e", consonant: "n" } ],
    [ "の", "ノ", "no", { vowel: "o", consonant: "n" } ],
    
    [ "ま", "マ", "ma", { vowel: "a", consonant: "m" } ],
    [ "み", "ミ", "mi", { vowel: "i", consonant: "m" } ],
    [ "む", "ム", "mu", { vowel: "u", consonant: "m" } ],
    [ "め", "メ", "me", { vowel: "e", consonant: "m" } ],
    [ "も", "モ", "mo", { vowel: "o", consonant: "m" } ],
    
    [ "は", "ハ", "ha", { vowel: "a", consonant: "h", dakuten: "b", handakuten: "p" } ],
    [ "ひ", "ヒ", "hi", { vowel: "i", consonant: "h", dakuten: "b", handakuten: "p" } ],
    [ "ふ", "フ", "hu", { vowel: "u", consonant: "h", dakuten: "b", handakuten: "p", hepburn: "fu" } ],
    [ "へ", "ヘ", "he", { vowel: "e", consonant: "h", dakuten: "b", handakuten: "p" } ],
    [ "ほ", "ホ", "ho", { vowel: "o", consonant: "h", dakuten: "b", handakuten: "p" } ],
    
    [ "ば", "バ", "ba", { vowel: "a", consonant: "b", base: "h" } ],
    [ "び", "ビ", "bi", { vowel: "i", consonant: "b", base: "h" } ],
    [ "ぶ", "ブ", "bu", { vowel: "u", consonant: "b", base: "h" } ],
    [ "べ", "ベ", "be", { vowel: "e", consonant: "b", base: "h" } ],
    [ "ぼ", "ボ", "bo", { vowel: "o", consonant: "b", base: "h" } ],
    
    [ "ぱ", "パ", "pa", { vowel: "a", consonant: "p", base: "h" } ],
    [ "ぴ", "ピ", "pi", { vowel: "i", consonant: "p", base: "h" } ],
    [ "ぷ", "プ", "pu", { vowel: "u", consonant: "p", base: "h" } ],
    [ "ぺ", "ペ", "pe", { vowel: "e", consonant: "p", base: "h" } ],
    [ "ぽ", "ポ", "po", { vowel: "o", consonant: "p", base: "h" } ],
    
    [ "や", "ヤ", "ya", { vowel: "a", consonant: "y" } ],
    [ "ゆ", "ユ", "yu", { vowel: "u", consonant: "y" } ],
    [ "よ", "ヨ", "yo", { vowel: "o", consonant: "y" } ],
    
    [ "ら", "ラ", "ra", { vowel: "a", consonant: "r" } ],
    [ "り", "リ", "ri", { vowel: "i", consonant: "r" } ],
    [ "る", "ル", "ru", { vowel: "u", consonant: "r" } ],
    [ "れ", "レ", "re", { vowel: "e", consonant: "r" } ],
    [ "ろ", "ロ", "ro", { vowel: "o", consonant: "r" } ],
    
    [ "わ", "ワ", "wa", { vowel: "a", consonant: "w" } ],
    [ "を", "ヲ", "wo", { vowel: "o", consonant: "w" } ],
    
    [ "ん", "ン", "n", { others: ["m"] } ],
]


const baseKanaMap = new Map<string, KanaTableEntry>()
const baseKanaHiraganaMap = new Map<string, KanaTableEntry>()
const baseKanaKatakanaMap = new Map<string, KanaTableEntry>()
const baseKanaRomanizationMap = new Map<string, KanaTableEntry>()
baseKanaTable.forEach(r => baseKanaMap.set(r[0], r))
baseKanaTable.forEach(r => baseKanaMap.set(r[1], r))
baseKanaTable.forEach(r => baseKanaHiraganaMap.set(r[0], r))
baseKanaTable.forEach(r => baseKanaKatakanaMap.set(r[1], r))
baseKanaTable.forEach(r => baseKanaRomanizationMap.set(r[2], r))


const baseYoonTable: KanaTableEntry[] =
[
    [ "き", "キ", "ky" ],
    [ "ぎ", "ギ", "gy" ],

    [ "し", "シ", "sy", { hepburn: "sh" } ],
    [ "ち", "チ", "ty", { hepburn: "ch" } ],

    // Inverted JI and DI columns for correct Kunrei romaji->kana mapping
    [ "ぢ", "ヂ", "dy", { hepburn: "j", kunrei: "zy", others: ["dj"] } ],
    [ "じ", "ジ", "zy", { hepburn: "j" } ],

    [ "に", "ニ", "ny" ],
    [ "み", "ミ", "my" ],
    [ "ひ", "ヒ", "hy" ],
    [ "び", "ビ", "by" ],
    [ "ぴ", "ピ", "py" ],
    [ "り", "リ", "ry" ],
]


const romajiSmallSpecifiersTable: KanaTableEntry[] =
[
    [ "ぁ", "ァ", "la" ],
    [ "ぃ", "ィ", "li" ],
    [ "ぅ", "ゥ", "lu" ],
    [ "ぇ", "ェ", "le" ],
    [ "ぉ", "ォ", "lo" ],
    
    [ "ゕ", "ヵ", "lka" ],
    [ "ゖ", "ヶ", "lke" ],

    [ "ゃ", "ャ", "lya" ],
    [ "ゅ", "ュ", "lyu" ],
    [ "ょ", "ョ", "lyo" ],

    [ "っ", "ッ", "ltu" ],
    [ "っ", "ッ", "ltsu" ],
    
    [ "ぁ", "ァ", "xa" ],
    [ "ぃ", "ィ", "xi" ],
    [ "ぅ", "ゥ", "xu" ],
    [ "ぇ", "ェ", "xe" ],
    [ "ぉ", "ォ", "xo" ],
    
    [ "ゕ", "ヵ", "xka" ],
    [ "ゖ", "ヶ", "xke" ],

    [ "ゃ", "ャ", "xya" ],
    [ "ゅ", "ュ", "xyu" ],
    [ "ょ", "ョ", "xyo" ],

    [ "っ", "ッ", "xtu" ],
    [ "っ", "ッ", "xtsu" ],
]


const baseExtensionsTable: KanaTableEntry[] =
[
    [ "ゐ", "ヰ", "wyi" ],
    [ "ゑ", "ヱ", "wye" ],
    
    [ "うぇ", "ウェ", "we" ],
    [ "うぃ", "ウィ", "wi" ],

    [ "ゔぁ", "ヴァ", "va" ],
    [ "ゔぃ", "ヴィ", "vi" ],
    [ "ゔ", "ヴ", "vu" ],
    [ "ゔぇ", "ヴェ", "ve" ],
    [ "ゔぉ", "ヴォ", "vo" ],
    
    [ "ふぁ", "ファ", "fa" ],
    [ "ふぃ", "フィ", "fi" ],
    [ "ふぇ", "フェ", "fe" ],
    [ "ふぉ", "フォ", "fo" ],
    
    [ "つぁ", "ツァ", "tsa" ],
    [ "つぃ", "ツィ", "tsi" ],
    [ "つぇ", "ツェ", "tse" ],
    [ "つぉ", "ツォ", "tso" ],
    
    [ "すぃ", "スィ", "swi" ],
    [ "ずぃ", "ズィ", "zwi" ],
    
    [ "てぃ", "ティ", "thi" ],
    [ "でぃ", "ディ", "dhi" ],
    [ "とぅ", "トゥ", "twu" ],
    [ "どぅ", "ドゥ", "dwu" ],
]