import * as Framework from "../framework/index.ts"
import * as App from "../app.tsx"
import * as Kana from "common/kana.ts"
import * as JmdictTags from "common/jmdict_tags.ts"
import * as Furigana from "common/furigana.ts"
import * as Jouyou from "common/jouyou.ts"


export type StudyListWordEntry = App.Api.StudyList.WordEntry & {
    entry: App.Api.Word.Entry
    headingIndex?: number
}


export type StudylistStats = {
    kanjiCountJouyou: number
    kanjiPercentJouyou: number
    kanjiCountOther: number
}


export function getStudylistStats(
    studylist: App.Api.StudyList.Entry,
    words: StudyListWordEntry[])
    : StudylistStats
{
    const jouyouKanjiSet = Jouyou.getKanjiSet()

    const kanjiSetJouyou = new Set<string>()
    const kanjiSetOther = new Set<string>()

    for (const word of words)
    {
        const levels = analyzeHeadingKanjiLevel(word)

        const chosen =
            levels.fixed ??
            levels.jouyou ??
            levels.uncommon ??
            levels.rare ??
            word.entry.headings[0]

        const kanji = [...chosen.base]
            .filter(k => Kana.isKanji(k))

        kanji.forEach(k => {
            if (jouyouKanjiSet.has(k))
                kanjiSetJouyou.add(k)
            else
                kanjiSetOther.add(k)
        })
    }

    return {
        kanjiCountJouyou: kanjiSetJouyou.size,
        kanjiPercentJouyou: Math.floor(
            Math.min(1, kanjiSetJouyou.size / Jouyou.officialCount) * 100),
        
        kanjiCountOther: kanjiSetOther.size,
    }
}


type HeadingLevels = {
    fixed?: App.Api.Word.Heading
    jouyou?: App.Api.Word.Heading
    uncommon?: App.Api.Word.Heading
    rare?: App.Api.Word.Heading
}


function analyzeHeadingKanjiLevel(
    word: StudyListWordEntry)
    : HeadingLevels
{
    const headingFixed =
        word.headingIndex !== undefined ?
            word.entry.headings[word.headingIndex] :
            undefined

    let headingJouyou: App.Api.Word.Heading | undefined = undefined
    let headingUncommon: App.Api.Word.Heading | undefined = undefined
    let headingRare: App.Api.Word.Heading | undefined = undefined

    let kanjiJouyou: string[] = []
    let kanjiUncommon: string[] = []
    let kanjiRare: string[] = []
        
    const mainReading = Kana.toHiragana(word.entry.headings[0].reading!)

    for (let i = 0; i < word.entry.headings.length; i++)
    {
        const heading = word.entry.headings[i]
        
        if (Kana.toHiragana(heading.reading!) !== mainReading)
            continue

        if (heading.irregularKanji ||
            heading.irregularKana ||
            heading.irregularOkurigana ||
            heading.outdatedKanji ||
            heading.outdatedKana ||
            heading.searchOnlyKanji ||
            heading.searchOnlyKana)
            continue
    
        const kanji = [...heading.base]
            .filter(k => Kana.isKanji(k))

        if (Kana.hasKanji(heading.base) &&
            !heading.nonJouyouKanji &&
            !heading.rareKanji)
        {
            const noChangeInKanji = kanjiJouyou
                .every(k => kanji.some(kk => kk === k))

            if (headingJouyou === undefined ||
                noChangeInKanji)
            {
                headingJouyou = heading
                kanjiJouyou = kanji
            }
        }
            
        else if (heading.nonJouyouKanji &&
            !heading.rareKanji)
        {
            const noChangeInKanji = kanjiUncommon
                .every(k => kanji.some(kk => kk === k))
            
            if (headingUncommon === undefined ||
                noChangeInKanji)
            {
                headingUncommon = heading
                kanjiUncommon = kanji
            }
        }
            
        else if (heading.rareKanji)
        {
            const noChangeInKanji = kanjiRare
                .every(k => kanji.some(kk => kk === k))
            
            if (headingRare === undefined ||
                noChangeInKanji)
            {
                headingRare = heading
                kanjiRare = kanji
            }
        }
    }

    return {
        fixed: headingFixed,
        jouyou: headingJouyou,
        uncommon: headingUncommon,
        rare: headingRare,
    }
}


export function writeStudylistTsv(
    studylist: App.Api.StudyList.Entry,
    words: StudyListWordEntry[])
{
    const prefs = App.usePrefs()

    let result = ""
    result += `#separator:Tab\n`
    result += `#html:${ prefs.studylistExportHtmlCss ? "true" : "false" }\n`
    result += `#columns:ID\tWord\tReading\tPitch\tMeaning\n`
    
    for (const word of words)
    {
        const levels = analyzeHeadingKanjiLevel(word)

        let chosenHeading = word.entry.headings[0]
        switch (prefs.studylistExportKanjiLevel)
        {
            case "rare":
                chosenHeading =
                    levels.jouyou ??
                    levels.uncommon ??
                    levels.rare ??
                    chosenHeading
                break
            
            case "uncommon":
                chosenHeading =
                    levels.jouyou ??
                    levels.uncommon ??
                    chosenHeading
                break
            
            case "jouyou":
                chosenHeading =
                    levels.jouyou ??
                    chosenHeading
                break
        }

        if (levels.fixed)
            chosenHeading = levels.fixed

        if (prefs.studylistExportSkipKatakana &&
            Kana.isPureKatakana(chosenHeading.base))
            continue

        const reading = chosenHeading.reading ?? chosenHeading.base

        const pitchEntries = (word.entry.pitch ?? [])
            .map(p => p.text)
            .filter(p =>
                Kana.toHiragana(JmdictTags.extractPitchReading(p)) ===
                Kana.toHiragana(reading))
        
        const columns = []
        columns.push(word.id)

        if (prefs.studylistExportHtmlCss)
        {
            columns.push(chosenHeading.base)
    
            columns.push(renderFuriganaToHtmlString(chosenHeading.furigana))

            columns.push(pitchEntries
                .map(p => renderPitchGuideToHtmlString(p))
                .join(""))
        }
        else
        {
            columns.push(chosenHeading.base)

            columns.push(reading)
            
            columns.push(pitchEntries.join(" / "))
        }

        const senseTexts: string[] = []
        let currentPartOfSpeech: App.Api.Word.PartOfSpeechTag[] = []
        for (const sense of word.entry.senses)
        {
            const isNewPartOfSpeech =
                !sense.pos.every(pos => currentPartOfSpeech.some(pos2 => pos2 === pos)) ||
                !currentPartOfSpeech.every(pos => sense.pos.some(pos2 => pos2 === pos))

            currentPartOfSpeech = sense.pos

            if (prefs.studylistExportHtmlCss)
            {
                senseTexts.push(renderSenseToHtmlString(sense, isNewPartOfSpeech))
            }
            else
            {
                let text = !isNewPartOfSpeech ?
                    "" :
                    `[${ sense.pos
                        .map(p => JmdictTags.nameForPartOfSpeechTag(p))
                        .join(", ")
                    }] `

                text += sense.gloss
                    .map(g => typeof g === "string" ? g : g.text)
                    .join("; ")

                senseTexts.push(text)
            }
        }
        
        if (prefs.studylistExportHtmlCss)
            columns.push(senseTexts.join(""))
        else
            columns.push(senseTexts.join(" ・ "))


        result += columns.join("\t") + "\n"
    }

    return result
}


function renderFuriganaToHtmlString(encoded: string)
{
    let result = `<ruby>`

    const furigana = Furigana.decode(encoded)
    for (const part of furigana)
    {
        result += `<rb>${ part[0] ?? "&nbsp;" }</rb>`
        result += `<rt>${ part[1] ?? "" }</rt>`
    }
    
    result += `</ruby>`
    return result
}


function renderPitchGuideToHtmlString(str: string)
{
	let result = `<span style="`
    result += `margin-right: 1em;`
    result += `">`

	let c = 0
	let prevPitch = false
	let kanaIndex = 0
	while (c < str.length)
	{
		let curPitch: boolean = prevPitch

		if (str[c] == "ꜛ")
		{
			curPitch = true
			c++
		}
		else if (str[c] == "ꜜ")
		{
			curPitch = false
			c++
		}

		let letter = str[c]
		c++

		let nasal = false
		if (str[c] == "~")
		{
			nasal = true
			c++
		}

		let silent = false
		if (str[c] == "*")
		{
			silent = true
			c++
		}
			
		let nextPitch = curPitch
		if (c < str.length)
		{
			if (str[c] == "ꜛ")
			{
				nextPitch = true
			}
			else if (str[c] == "ꜜ")
			{
				nextPitch = false
			}
		}

        if (!letter)
            break

        result += `<span style="`
        result += curPitch ?
            "border-top: 2px solid currentColor;" : ""
        result += curPitch && !prevPitch && kanaIndex > 0 ?
            "border-left: 2px solid currentColor;" : ""
        result += curPitch && !nextPitch ?
            "border-right: 2px solid currentColor;" : ""
        result += `"><span style="`
        result += `border-radius: 50%;`
        result += silent ? "border: 2px dotted currentColor;" : ""
        result += nasal ? "`text-decoration: currentColor wavy underline;" : ""
        result += `">${ letter }</span></span>`

		prevPitch = curPitch
		kanaIndex++
	}

    result += `</span>`
	return result
}


function renderSenseToHtmlString(
    sense: App.Api.Word.Sense,
    showPartOfSpeech: boolean)
{
    let result = ""
    if (showPartOfSpeech)
    {
        result += `<span style="`
        result += `color: #0a0;`
        result += `font-size: 80%;`
        result += `">`
        result += sense.pos
            .map(p => JmdictTags.nameForPartOfSpeechTag(p))
            .join(", ")
        result += `</span><br/>`
    }

    result += `<span>`
    result += `• `

    const glossTexts: string[] = []
    for (const gloss of sense.gloss)
    {
        if (typeof gloss === "string")
        {
            glossTexts.push(gloss)
            continue
        }

        switch (gloss.type)
        {
            case "lit":
                glossTexts.push(`${ gloss.text }<sup>[lit.]</sup>`)
                break
            case "fig":
                glossTexts.push(`${ gloss.text }<sup>[fig.]</sup>`)
                break
            case "tm":
                glossTexts.push(`${ gloss.text }<span>™</span>`)
                break
            case "expl":
                glossTexts.push(`${ gloss.text }<sup>[expl.]</sup>`)
                break
            default:
                glossTexts.push(`${ gloss.text }<sup>[${ gloss.type }]</sup>`)
                break
        }
    }

    result += glossTexts.join("; ")

    const senseInfoStyle =
        `color: #666; ` +
        `font-size: 80%;`
    
    // Build field/domain tag text
    if (sense.field)
    {
        const text = sense.field
            .map(tag => JmdictTags.nameForFieldDomainTag(tag))
            .join(", ")

        result += `<span style="${ senseInfoStyle }"> — ${ text }</span>`
    }

    // Build misc tag text
    if (sense.misc)
    {
        const text = sense.misc
            .map(tag => JmdictTags.nameForMiscTag(tag))
            .join(", ")

        result += `<span style="${ senseInfoStyle }"> — ${ text }</span>`
    }

    // Build dialect text
    if (sense.dialect)
    {
        const text = sense.dialect
            .map(tag => JmdictTags.nameForDialectTag(tag))
            .join(", ")

        result += `<span style="${ senseInfoStyle }"> — ${ text }</span>`
    }

    // Build information text
    if (sense.info)
    {
        const text = sense.info.join(" — ")
        result += `<span style="${ senseInfoStyle }"> — ${ text }</span>`
    }

    // Build restriction text
    if (sense.restrict)
    {
        const text = sense.restrict.join(", ")
        result += `<span style="${ senseInfoStyle }"> — only applies to ${ text }</span>`
    }

    result += `</span><br/>`
    
    return result
}