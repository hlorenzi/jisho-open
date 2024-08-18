import * as Api from "./api/index.ts"


export function getCommonness(
    heading: Api.Word.Heading)
    : Api.CommonnessTag | undefined
{
    if (heading.outdatedKanji ||
        heading.outdatedKana ||
        heading.rareKanji)
        return undefined

    if (heading.rankIchi === 1 ||
        heading.rankNews === 1 ||
        heading.rankGai === 1 ||
        heading.rankSpec === 1)
        return "veryCommon"

    if (heading.rankIchi === 2 ||
        heading.rankNews === 2 ||
        heading.rankGai === 2 ||
        heading.rankSpec === 2)
        return "common"

    return undefined
}


export function getKanjiCommonness(
    entry: Omit<Api.Kanji.Entry, "id">)
    : Api.CommonnessTag | undefined
{
    if (entry.jouyou !== undefined &&
        entry.rankNews !== undefined)
        return "veryCommon"

    if (entry.jouyou !== undefined ||
        entry.rankNews !== undefined ||
        entry.jlpt !== undefined ||
        (entry.score !== undefined && entry.score >= 500))
        return "common"

    return undefined
}


export function extractPitchReading(
    pitch: string)
    : string
{
    return pitch.replace(/\ꜛ|\ꜜ|\*|\~/g, "")
}


export function extractMoraPitch(
    pitch: string)
    : Api.Word.MoraPitch[]
{
    const moraPitch: Api.Word.MoraPitch[] = []
    
    let currentPitch: Api.Word.MoraPitch = "L"

    for (const c of [...pitch])
    {
        if (c === "ꜛ")
        {
            currentPitch = "H"
            continue
        }
        
        if (c === "ꜜ")
        {
            currentPitch = "L"
            continue
        }
        
        if (c === "*" || c === "~")
        {
            continue
        }

        if (c === "ぁ" || c == "ァ" ||
            c === "ぃ" || c == "ィ" ||
            c === "ぅ" || c == "ゥ" ||
            c === "ぇ" || c == "ェ" ||
            c === "ぉ" || c == "ォ" ||
            c === "ゃ" || c == "ャ" ||
            c === "ゅ" || c == "ュ" ||
            c === "ょ" || c == "ョ" ||
            c === "ゎ" || c == "ヮ")
        {
            continue
        }

        moraPitch.push(currentPitch)
    }

    moraPitch.push(currentPitch)
    return moraPitch
}


export function moraPitchToString(
    moraPitch: Api.Word.MoraPitch[])
    : string
{
    return moraPitch.slice(0, moraPitch.length - 1).join("") +
        "-" +
        moraPitch[moraPitch.length - 1]
}


export function categorizePitch(
    pitch: string)
    : Api.Word.PitchAccentTag
{
    const moraPitch = extractMoraPitch(pitch)

    if (moraPitch.length === 2 &&
        moraPitch[0] === "L" &&
        moraPitch[1] === "L")
        return "heiban"

    if (moraPitch[0] === "L" &&
        moraPitch.slice(1).every(p => p === "H"))
        return "heiban"

    if (moraPitch[0] === "H" &&
        moraPitch.slice(1).every(p => p === "L"))
        return "atamadaka"

    if (moraPitch[0] === "L" &&
        moraPitch.slice(1, moraPitch.length - 1).every(p => p === "H") &&
        moraPitch[moraPitch.length - 1] === "L")
        return "odaka"

    return "nakadaka"
}


/// From: https://www.edrdg.org/jmwsgi/edhelp.py?svc=jmdict&sid=#kw_pos
type PartOfSpeechDict = {
    [tag in Api.Word.PartOfSpeechTag]: string
}

const partOfSpeechDict: Partial<PartOfSpeechDict> = {
    "adj-i": "i-adjective",
    "adj-f": "prenominal attributive",
    "adj-ix": "irregular i-adjective",
    "adj-kari": "archaic kari-adjective",
    "adj-ku": "archaic ku-adjective",
    "adj-na": "na-adjective",
    "adj-nari": "archaic nari-adjective",
    "adj-no": "no-adjective",
    "adj-pn": "pre-noun adjectival",
    "adj-t": "taru-adjective",
    "adj-shiku": "archaic shiku-adjective",
    "adv": "adverb",
    "adv-to": "to-adverb",
    "aux": "auxiliary",
    "aux-adj": "auxiliary adjective",
    "aux-v": "auxiliary verb",
    "conj": "conjunction",
    "cop": "copula",
    "ctr": "counter",
    "exp": "expression",
    "int": "interjection",
    "n": "noun",
    "n-adv": "adverbial noun",
    "n-suf": "suffix",
    "n-pref": "prefix",
    "n-t": "temporal noun",
    "num": "numeric",
    "pn": "pronoun",
    "prt": "particle",
    "pref": "prefix",
    "suf": "suffix",
    "unc": "unclassified",

    "v1": "ichidan verb",
    "v1-s": "irregular ichidan verb",

    "v2k-k": "archaic upper nidan verb",
    "v2g-k": "archaic upper nidan verb",
    "v2t-k": "archaic upper nidan verb",
    "v2d-k": "archaic upper nidan verb",
    "v2h-k": "archaic upper nidan verb",
    "v2b-k": "archaic upper nidan verb",
    "v2m-k": "archaic upper nidan verb",
    "v2y-k": "archaic upper nidan verb",
    "v2r-k": "archaic upper nidan verb",

    "v2a-s": "archaic lower nidan verb",
    "v2k-s": "archaic lower nidan verb",
    "v2g-s": "archaic lower nidan verb",
    "v2s-s": "archaic lower nidan verb",
    "v2z-s": "archaic lower nidan verb",
    "v2t-s": "archaic lower nidan verb",
    "v2d-s": "archaic lower nidan verb",
    "v2n-s": "archaic lower nidan verb",
    "v2h-s": "archaic lower nidan verb",
    "v2b-s": "archaic lower nidan verb",
    "v2m-s": "archaic lower nidan verb",
    "v2y-s": "archaic lower nidan verb",
    "v2r-s": "archaic lower nidan verb",
    "v2w-s": "archaic lower nidan verb",

    "v4k": "archaic yodan verb",
    "v4g": "archaic yodan verb",
    "v4s": "archaic yodan verb",
    "v4t": "archaic yodan verb",
    "v4n": "archaic yodan verb",
    "v4b": "archaic yodan verb",
    "v4m": "archaic yodan verb",
    "v4h": "archaic yodan verb",
    "v4r": "archaic yodan verb",
        
    "v5aru": "irregular godan verb",
    "v5b": "godan verb",
    "v5g": "godan verb",
    "v5k": "godan verb",
    "v5k-s": "irregular godan verb",
    "v5m": "godan verb",
    "v5n": "godan verb",
    "v5r": "godan verb",
    "v5r-i": "irregular godan verb",
    "v5s": "godan verb",
    "v5t": "godan verb",
    "v5u": "godan verb",
    "v5u-s": "irregular godan verb",

    "vi": "intransitive",
    "vt": "transitive",
    "vk": "kuru verb",
    "vs": "suru verb",
    "vs-i": "suru verb",
    "vs-s": "irregular suru verb",
    "vs-c": "archaic su verb",
    "vz": "irregular ichidan verb",
    "vr": "archaic ri verb",
    "vn": "archaic nu verb",
    "v5uru": "archaic uru verb",
    "v-unspec": "verb (unspecified class)",
    
    "v1contr": "contracted iru verb",
    "vmasu": "polite verb",
    "vmasuneg": "negative polite verb",
    "vte": "verb in conjunctive form",

    "surname": "surname",
    "place": "place name",
    "unclass": "person name (unclassified given/surname)",
    "char": "character name",
    "company": "company name",
    "creat": "creature name",
    "product": "product name",
    "work": "title of a piece of work",
    "leg": "legend",
    "fict": "fiction",
    "masc": "male given name",
    "fem": "female given name",
    "person": "full person name",
    "given": "given name (unclassified gender)",
    "station": "railway station name",
    "obj": "object name",
    "organization": "organization name",
}

/// Returns a user-friendly name for a part-of-speech tag.
export function nameForPartOfSpeechTag(
    tag: Api.Word.PartOfSpeechTag)
    : string
{
    return partOfSpeechDict[tag] ?? `[${ tag }]`
}


/// From https://www.edrdg.org/jmwsgi/edhelp.py?svc=jmdict&sid=#kw_misc
type MiscDict = {
    [tag in Api.Word.MiscTag]: string
}

const miscDict: Partial<MiscDict> = {
    "abbr": "abbreviation",
    "arch": "archaic",
    "char": "character name",
    "chn": "children's language",
    "col": "colloquialism",
    "company": "company name",
    "creat": "creature name",
    "dated": "dated term",
    "derog": "derogatory",
    "fam": "familiar language",
    "fem": "female language",
    "fict": "fiction",
    "hist": "historical term",
    "hon": "honorific (sonkeigo)",
    "hum": "humble (kenjōgo)",
    "id": "idiomatic",
    "joc": "humorous term",
    "leg": "legend",
    "m-sl": "manga slang",
    "male": "male language",
    "net-sl": "Internet slang",
    "obj": "object name",
    "obs": "obsolete",
    "on-mim": "onomatopoeic",
    "organization": "name of an organization",
    "proverb": "proverb",
    "product": "product name",
    "poet": "poetical term",
    "pol": "polite (teineigo)",
    "quote": "quotation",
    "rare": "rare term",
    "sens": "sensitive",
    "sl": "slang",
    "uk": "usually in plain kana",
    "vulg": "vulgar",
    "work": "title of a piece of work",
    "yoji": "yojijukugo",
}

export function nameForMiscTag(
    tag: Api.Word.MiscTag)
    : string
{
    return miscDict[tag] ?? `[${ tag }]`
}


/// From https://www.edrdg.org/jmwsgi/edhelp.py?svc=jmdict&sid=#kw_fld
type FieldDomainDict = {
    [tag in Api.Word.FieldDomainTag]: string
}

const fieldDomainDict: Partial<FieldDomainDict> = {
    "anat": "anatomical term",
    "archit": "Architecture",
    "art": "Art",
    "astron": "Astronomy",
    "baseb": "baseball term",
    "biol": "Biology",
    "bot": "Botany",
    "Buddh": "Buddhism",
    "chem": "Chemistry",
    "Christn": "Christianism",
    "comp": "Computing",
    "elec": "Electronics",
    "engr": "Engineering",
    "food": "food term",
    "geol": "Geology",
    "geom": "Geometry",
    "gramm": "Grammar",
    "hanaf": "hanafuda term",
    "law": "Law",
    "ling": "Linguistics",
    "MA": "martial arts term",
    "mahj": "mahjong term",
    "math": "Mathematics",
    "med": "Medicine",
    "mil": "Military",
    "music": "Music",
    "phil": "Philosophy",
    "physics": "Physics",
    "print": "printing term",
    "psy": "Psychiatry",
    "psyanal": "Psychoanalysis",
    "psych": "Psychology",
    "Shinto": "Shinto term",
    "shogi": "shogi term",
    "sports": "sports term",
    "sumo": "sumo term",
    "tradem": "trademark",
    "vidg": "videogame term",
    "zool": "Zoology",
}

export function nameForFieldDomainTag(
    tag: Api.Word.FieldDomainTag)
    : string
{
    return fieldDomainDict[tag] ?? `[${ tag }]`
}


/// From https://www.edrdg.org/jmwsgi/edhelp.py?svc=jmdict&sid=#kw_lang
type LanguageDict = {
    [tag in Api.Word.LanguageTag]: string
}

const languageDict: LanguageDict = {
    "eng": "English",
    "afr": "Afrikaans",
    "ain": "Ainu",
    "alg": "Algonquian language",
    "amh": "Amharic",
    "ara": "Arabic",
    "arn": "Mapuche",
    "bnt": "Bantu",
    "bre": "Breton",
    "bul": "Bulgarian",
    "bur": "Burmese",
    "chi": "Chinese",
    "chn": "Chinook jargon",
    "cze": "Czech",
    "dan": "Danish",
    "dut": "Dutch",
    "epo": "Esperanto",
    "est": "Estonian",
    "fil": "Filipino",
    "fin": "Finnish",
    "fre": "French",
    "geo": "Georgian",
    "ger": "German",
    "glg": "Galician",
    "grc": "Ancient Greek",
    "gre": "Modern Greek",
    "haw": "Hawaiian",
    "heb": "Hebrew",
    "hin": "Hindi",
    "hun": "Hungarian",
    "ice": "Icelandic",
    "ind": "Indonesian",
    "ita": "Italian",
    "khm": "Central Khmer",
    "kor": "Korean",
    "kur": "Kurdish",
    "lat": "Latin",
    "lit": "Lithuanian",
    "mal": "Malayalam",
    "mao": "Maori",
    "mas": "Masai",
    "may": "Malay",
    "mnc": "Manchu",
    "mol": "Moldavian",
    "mon": "Mongolian",
    "nor": "Norwegian",
    "per": "Persian",
    "pol": "Polish",
    "por": "Portuguese",
    "rum": "Romanian",
    "rus": "Russian",
    "san": "Sanskrit",
    "scr": "Croatian",
    "slo": "Slovak",
    "slv": "Slovenian",
    "som": "Somali",
    "spa": "Spanish",
    "swa": "Swahili",
    "swe": "Swedish",
    "tah": "Tahitian",
    "tam": "Tamil",
    "tgl": "Tagalog",
    "tha": "Thai",
    "tib": "Tibetan",
    "tur": "Turkish",
    "ukr": "Ukrainian",
    "urd": "Urdu",
    "vie": "Vietnamese",
    "yid": "Yiddish",
}

export function nameForLanguageTag(
    tag: Api.Word.LanguageTag)
    : string
{
    return languageDict[tag] ?? `[${ tag }]`
}


/// From https://www.edrdg.org/jmwsgi/edhelp.py?svc=jmdict&sid=#kw_dial
type DialectDict = {
    [tag in Api.Word.DialectTag]: string
}

const dialectDict: DialectDict = {
    "bra": "Brazilian dialect",
    "hob": "Hokkaido dialect",
    "ksb": "Kansai dialect",
    "ktb": "Kantou dialect",
    "kyb": "Kyoto dialect",
    "kyu": "Kyuushuu dialect",
    "nab": "Nagano dialect",
    "osb": "Osaka dialect",
    "rkb": "Ryuukyuu dialect",
    "std": "standard Tokyo dialect",
    "thb": "Touhoku dialect",
    "tsb": "Tosa dialect",
    "tsug": "Tsugaru dialect",
}

export function nameForDialectTag(
    tag: Api.Word.DialectTag)
    : string
{
    return dialectDict[tag] ?? `[${ tag }]`
}


type ExpandedTagsDict = {
    [tag in Api.Word.FilterTag]: Api.Word.FilterTag[]
}

const expandedTags: Partial<ExpandedTagsDict> = {
    "veryCommon": ["common"],

    "v1": ["v"],
    "v1-s": ["v", "v1"],

    "v5u": ["v", "v5"],
    "v5r": ["v", "v5"],
    "v5t": ["v", "v5"],
    "v5k": ["v", "v5"],
    "v5g": ["v", "v5"],
    "v5s": ["v", "v5"],
    "v5n": ["v", "v5"],
    "v5b": ["v", "v5"],
    "v5m": ["v", "v5"],
    
    "vmasu": ["v"],
    
    "vs":   ["v"],
    "vs-i": ["v", "vs", "virr"],
    "vs-s": ["v", "vs", "virr"],
    "vk":   ["v", "virr"],
    "vz":   ["v", "virr"],
    
    "v5aru": ["v", "v5", "virr"],
    "v5u-s": ["v", "v5", "virr"],
    "v5r-i": ["v", "v5", "virr"],
    "v5k-s": ["v", "v5", "virr"],
    
    "v5uru": ["v"],
    "vs-c": ["v"],
    "vn": ["v"],
    "vr": ["v"],
    
    "v-unspec": ["v"],

    "v2k-k": ["v", "v2", "v2-k"],
    "v2g-k": ["v", "v2", "v2-k"],
    "v2t-k": ["v", "v2", "v2-k"],
    "v2d-k": ["v", "v2", "v2-k"],
    "v2h-k": ["v", "v2", "v2-k"],
    "v2b-k": ["v", "v2", "v2-k"],
    "v2m-k": ["v", "v2", "v2-k"],
    "v2y-k": ["v", "v2", "v2-k"],
    "v2r-k": ["v", "v2", "v2-k"],

    "v2a-s": ["v", "v2", "v2-s"],
    "v2k-s": ["v", "v2", "v2-s"],
    "v2g-s": ["v", "v2", "v2-s"],
    "v2s-s": ["v", "v2", "v2-s"],
    "v2z-s": ["v", "v2", "v2-s"],
    "v2t-s": ["v", "v2", "v2-s"],
    "v2d-s": ["v", "v2", "v2-s"],
    "v2n-s": ["v", "v2", "v2-s"],
    "v2h-s": ["v", "v2", "v2-s"],
    "v2b-s": ["v", "v2", "v2-s"],
    "v2m-s": ["v", "v2", "v2-s"],
    "v2y-s": ["v", "v2", "v2-s"],
    "v2r-s": ["v", "v2", "v2-s"],
    "v2w-s": ["v", "v2", "v2-s"],

    "v4k": ["v", "v4"],
    "v4g": ["v", "v4"],
    "v4s": ["v", "v4"],
    "v4t": ["v", "v4"],
    "v4n": ["v", "v4"],
    "v4b": ["v", "v4"],
    "v4m": ["v", "v4"],
    "v4h": ["v", "v4"],
    "v4r": ["v", "v4"],
     
    "adj-i": ["adj"],
    "adj-ix": ["adj"],
    "adj-na": ["adj"],
    "adj-no": ["adj"],
    "adj-pn": ["adj"],
    "adj-t": ["adj"],
    "adj-f": ["adj"],
    "adj-kari": ["adj"],
    "adj-ku": ["adj"],
    "adj-shiku": ["adj"],
    "adj-nari": ["adj"],
    
    "adv-to": ["adv"],
}

export function expandFilterTags(
    tags: Api.Word.FilterTag[])
    : Api.Word.FilterTag[]
{
    const expanded = new Set<Api.Word.FilterTag>()
    for (const tag of tags)
    {
        expanded.add(tag)
        for (const expandedTag of expandedTags[tag] ?? [])
            expanded.add(expandedTag)
    }

    return [...expanded]
}