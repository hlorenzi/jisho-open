import * as Api from "./api/index.ts"


export function getCommonness(
    heading: Api.Word.Heading)
    : Api.Word.CommonnessTag | null
{
    if (heading.outdatedKanji ||
        heading.outdatedKana ||
        heading.rareKanji)
        return null

    if (heading.rankIchi === 1 ||
        heading.rankNews === 1 ||
        heading.rankGai === 1 ||
        heading.rankSpec === 1 ||
        heading.jlpt !== undefined)
        return "veryCommon"

    if (heading.rankIchi === 2 ||
        heading.rankNews === 2 ||
        heading.rankGai === 2 ||
        heading.rankSpec === 2)
        return "common"

    return null
}


/// Returns a user-friendly name for a part-of-speech tag.
/// From: https://www.edrdg.org/jmwsgi/edhelp.py?svc=jmdict&sid=#kw_pos
export function getPosName(
    pos: Api.Word.PartOfSpeechTag)
    : string
{
    type PosDict = {
        [pos in Api.Word.PartOfSpeechTag]: string
    }

    const posNames: Partial<PosDict> = {
        "adj-i": "i-adjective",
        "adj-f": "prenominal modifier",
        "adj-ix": "irregular i-adjective",
        "adj-na": "na-adjective",
        "adj-no": "no-adjective",
        "adj-pn": "pre-noun adjectival",
        "adj-t": "taru-adjective",
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
        "vs-s": "suru verb",
        "vz": "irregular ichidan verb",
        "vs-c": "archaic su verb",
        "vr": "archaic ri verb",
        "vn": "archaic nu verb",
        "v5uru": "archaic uru verb",
        "v-unspec": "verb (unspecified class)",
        
        "vmasu": "polite verb",

        "surname": "surname",
        "place": "place name",
        "unclass": "person name (unclassified given/surname)",
        "company": "company name",
        "product": "product name",
        "work": "name of a piece of work",
        "masc": "male given name",
        "fem": "female given name",
        "person": "full person name",
        "given": "given name (unclassified gender)",
        "station": "railway station name",
        "organization": "organization name",
    }


    return posNames[pos] ?? `[${ pos }]`
}


export function getMiscName(misc: string): string
{
    type MiscDict = {
        [misc: string]: string
    }

    const miscNames: MiscDict = {
        "abbr": "abbreviation",
        "anat": "anatomical term",
        "arch": "archaic",
        "archit": "Architecture",
        "astron": "Astronomy",
        "baseb": "baseball term",
        "biol": "Biology",
        "bot": "Botany",
        "Buddh": "Buddhism",
        "chem": "Chemistry",
        "chn": "children's language",
        "Christn": "Christianism",
        "col": "colloquialism",
        "comp": "Computing",
        "dated": "dated term",
        "derog": "derogatory",
        "elec": "Electronics",
        "engr": "Engineering",
        "fam": "familiar language",
        "fem": "female language",
        "food": "food term",
        "geol": "Geology",
        "geom": "Geometry",
        "hist": "historical term",
        "hon": "honorific (sonkeigo)",
        "hum": "humble (kenjōgo)",
        "id": "idiomatic",
        "joc": "humorous term",
        "law": "Law",
        "ling": "Linguistics",
        "lit": "formal",
        "litf": "formal",
        "MA": "martial arts term",
        "m-sl": "manga slang",
        "mahj": "mahjong term",
        "male": "male language",
        "male-s": "male language",
        "math": "Mathematics",
        "med": "Medicine",
        "mil": "Military",
        "music": "Music",
        "net-sl": "Internet slang",
        "on-mim": "onomatopoeic",
        "obs": "obsolete",
        "obsc": "obscure",
        "proverb": "proverb",
        "poet": "poetical term",
        "pol": "polite (teineigo)",
        "physics": "Physics",
        "quote": "quotation",
        "rare": "rare term",
        "sens": "sensitive",
        "Shinto": "Shinto term",
        "shogi": "shogi term",
        "sl": "slang",
        "sports": "sports term",
        "sumo": "sumo term",
        "uk": "usually in plain kana",
        "vulg": "vulgar",
        "yoji": "yojijukugo",
        "zool": "Zoology",
    }

    return miscNames[misc] ?? `[${ misc }]`
}


export function getLanguageName(lang: string): string
{
    type LangDict = {
        [lang: string]: string
    }

    const langNames: LangDict = {
        "eng": "English",
        "afr": "Afrikaans",
        "ain": "Ainu",
        "alg": "Algonquian",
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
        "tha": "Thai",
        "tib": "Tibetan",
        "tur": "Turkish",
        "urd": "Urdu",
        "vie": "Vietnamese",
        "yid": "Yiddish",
    }

    return langNames[lang] ?? `[${ lang }]`
}


export function expandFilterTags(
    tags: Api.Word.FilterTag[])
    : Api.Word.FilterTag[]
{
    type LangDict = {
        [tag: string]: string[]
    }

    const expandedTags: LangDict = {
        "veryCommon": ["common"],

        "jlpt1": ["n1", "jlpt"],
        "jlpt2": ["n2", "jlpt"],
        "jlpt3": ["n3", "jlpt"],
        "jlpt4": ["n4", "jlpt"],
        "jlpt5": ["n5", "jlpt"],

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

        "lang-wasei": ["wasei"],
    }

    const expanded = new Set<string>()
    for (const tag of tags)
    {
        expanded.add(tag.toLowerCase())
        for (const expandedTag of expandedTags[tag] ?? [])
            expanded.add(expandedTag.toLowerCase())
    }

    return [...expanded]
}