import * as Api from "./api/index.ts"
import * as Kana from "./kana.ts"
import { raw } from "./inflection.raw.ts"


let tableCache: Table | null = null


export function getTable(): Table
{
    if (tableCache)
        return tableCache

    tableCache = compile(raw)
    return tableCache
}


export type Table = {
    endingsByCategory: Map<string, Set<string>>
    groups: Map<string, Group>
    rules: Rule[]
}


export type Group = {
    display: string
    hidden: boolean
    refs: string[]
}


export type Rule = {
    id: string
    sourceCategory: string
    removeFromEnd: string
    targetCategory: string
    addToEnd: string
}


export type Breakdown = BreakdownPath[]


export type BreakdownPath = BreakdownStep[]


export type BreakdownStep = {
    ruleId: string
    sourceTerm: string
    sourceCategory: string
    targetTerm: string
    targetCategory: string
}


export function compile(raw: string): Table
{
    const rules = new Map<string, Rule[]>()
    const groups = new Map<string, Group>()
    const endings = new Map<string, Set<string>>()

    let currentGroupId: string | null = null
    let currentGroupHidden = false

    for (const line of raw.split("\n").map(l => l.trim()))
    {
        if (line.startsWith("#") ||
            line.length === 0)
            continue

        if (line.startsWith("@"))
        {
            const entry = line.substring("@".length).trim()

            let colonIndex = entry.indexOf(":")
            if (colonIndex < 0)
                colonIndex = entry.length

            const directive = entry.substring(0, colonIndex).trim()
            const value = entry.substring(colonIndex + 1).trim()

            if (directive === "id")
            {
                currentGroupId = value

                if (groups.get(currentGroupId))
                    throw `duplicate group id: ${currentGroupId}`

                const group: Group = {
                    display: value,
                    hidden: false,
                    refs: [],
                }
                groups.set(currentGroupId, group)
                continue
            }

            if (currentGroupId === null)
                throw `missing inflections group id`

            const group = groups.get(currentGroupId)!

            switch (directive)
            {
                case "hidden":
                    group.hidden = true
                    break
                case "display":
                    group.display = value
                    break
                case "ref":
                    group.refs.push(value)
                    break
                default:
                    throw `invalid directive: ${directive}`
            }
            continue
        }

        if (currentGroupId === null)
            throw `missing inflections group id`

        const sides = line.split("->").map(s => s.trim())
        const source = sides[0].split(";").map(s => s.trim())
        const target = sides[1].split(";").map(s => s.trim())
        const invalid = sides[1].trim() === "!"

        if (!source[1].startsWith("*"))
            throw `invalid source pattern: ${source[1]}`

        if (!invalid &&
            !target[1].startsWith("*"))
            throw `invalid target pattern: ${source[1]}`

        const removeFromEnd = source[1].substring("*".length)
        const addToEnd = (target[1] ?? "").substring("*".length)

        const targetCategory = target[0]
        const sourceCategory = source[0]

        // Extend a previous rule, but remove the intermediate step
        if (sourceCategory.startsWith("%"))
        {
            const sourceGroupId = sourceCategory.substring("%".length).trim()
            const sourceGroup = rules.get(sourceGroupId)
            if (sourceGroup === undefined)
                throw `unknown inflections source group id: ${sourceGroupId}`
            
            const ruleList = rules.get(currentGroupId) ?? []
            for (const sourceRule of sourceGroup)
                ruleList.push({
                    id: currentGroupId,
                    sourceCategory: sourceRule.sourceCategory,
                    removeFromEnd: sourceRule.removeFromEnd + removeFromEnd,
                    addToEnd: sourceRule.addToEnd + addToEnd,
                    targetCategory,
                })
            
            rules.set(currentGroupId, ruleList)
            continue
        }

        // Extend a previous rule, but keep the intermediate step
        if (sourceCategory.startsWith("~"))
        {
            const sourceGroupId = sourceCategory.substring("~".length).trim()
            const sourceGroup = rules.get(sourceGroupId)
            if (sourceGroup === undefined)
                throw `unknown inflections source group id: ${sourceGroupId}`
            
            const ruleList = rules.get(currentGroupId) ?? []
            for (const sourceRule of sourceGroup)
            {
                if (sourceRule.targetCategory === "unc")
                    continue

                if (!sourceRule.addToEnd.endsWith(removeFromEnd))
                    continue

                ruleList.push({
                    id: currentGroupId,
                    sourceCategory: sourceRule.targetCategory,
                    removeFromEnd: removeFromEnd,
                    addToEnd: addToEnd,
                    targetCategory,
                })
            }
            
            rules.set(currentGroupId, ruleList)
            continue
        }

        const rule: Rule = {
            id: currentGroupId,
            sourceCategory,
            removeFromEnd,
            targetCategory,
            addToEnd,
        }

        let ruleList = rules.get(currentGroupId) ?? []

        if (invalid)
        {
            ruleList = ruleList.filter(r =>
                r.id !== currentGroupId ||
                r.sourceCategory !== sourceCategory ||
                r.removeFromEnd !== removeFromEnd)
        }
        else
            ruleList.push(rule)

        rules.set(currentGroupId, ruleList)

        const endingsSet = endings.get(sourceCategory) ?? new Set()
        endingsSet.add(removeFromEnd)
        endings.set(sourceCategory, endingsSet)
    }

    return {
        endingsByCategory: endings,
        groups,
        rules: [...rules.values()].flat(),
    }
}


const inflectionalKanjiReadings: { [k: string]: string[] } = {
    "為": ["さ", "し", "す", "せ"],
    "来": ["き", "く", "こ"],
    "來": ["き", "く", "こ"],
    "有": ["あ"],
    "在": ["あ"],
    "得": ["え", "う"],
    "良": ["い", "よ"],
    //"乍": ["なが"], // won't work; dependent algorithms expect a single kana
}


export function endsWith(
    term: string,
    ending: string)
    : boolean
{
    if (term.length < ending.length)
        return false

    for (let i = 0; i < ending.length; i++)
    {
        const cEnding = ending[ending.length - 1 - i]
        const cTerm = term[term.length - 1 - i]

        if (cTerm === cEnding)
            continue

        const readings = inflectionalKanjiReadings[cTerm]
        if (readings !== undefined &&
            readings.some(r => r === cEnding))
            continue

        if (Kana.toHiragana(cTerm) === cEnding)
            continue
        
        return false
    }

    return true
}


export function canInflect(
    category: Api.Word.PartOfSpeechTag)
{
    if (category === "n")
        return true

    const table = getTable()

    for (const rule of table.rules)
    {
        if (rule.sourceCategory === category)
            return true
    }

    return false
}


export type Inflected = {
    term: string
    category: string
}


export function inflect(
    sourceTerm: string,
    category: Api.Word.PartOfSpeechTag,
    applyRuleIds: string[])
    : Inflected[]
{
    const table = getTable()

    let inflected: Inflected[] = [{
        term: sourceTerm,
        category: category,
    }]

    for (const ruleId of applyRuleIds)
    {
        const prevInflected = inflected
        inflected = []

        for (const infl of prevInflected)
        {
            for (const rule of table.rules)
            {
                if (rule.id !== ruleId)
                    continue

                if (rule.sourceCategory !== infl.category)
                    continue

                if (!endsWith(infl.term, rule.removeFromEnd))
                    continue

                const targetTerm =
                    infl.term.slice(0, infl.term.length - rule.removeFromEnd.length) +
                    rule.addToEnd

                if (inflected.some(i => i.term === targetTerm))
                    continue

                inflected.push({
                    term: targetTerm,
                    category: rule.targetCategory,
                })
            }
        }
    }

    return inflected
}


export function breakdown(
    targetTerm: string,
    category?: string)
    : Breakdown
{
    if (targetTerm.length > 25)
        return []

    const steps: BreakdownStep[] = []
    const table = getTable()
    const stepsSeen = new Set<string>()

    for (const rule of table.rules)
    {
        if (rule.targetCategory !== "*" &&
            category &&
            category !== rule.targetCategory)
            continue

        if (!endsWith(targetTerm, rule.addToEnd))
            continue

        if (table.groups.get(rule.id)!.hidden)
            continue
        
        const sourceTerm =
            targetTerm.slice(0, targetTerm.length - rule.addToEnd.length) +
            rule.removeFromEnd

        if (sourceTerm.length === 0)
            continue

        const endings = table.endingsByCategory.get(rule.sourceCategory)
        if (endings)
        {
            let acceptable = false
            for (const ending of endings)
                acceptable = acceptable || sourceTerm.endsWith(ending)

            if (rule.sourceCategory === "v1" ||
                rule.sourceCategory === "v1-s")
            {
                const charBeforeLast = sourceTerm[sourceTerm.length - 2]
                const vowel = Kana.vowelOf(charBeforeLast)
                if (vowel !== "i" && vowel !== "e")
                    acceptable = false
            }

            if (!acceptable)
                continue
        }

        const step: BreakdownStep = {
            ruleId: rule.id,
            sourceTerm,
            sourceCategory: rule.sourceCategory,
            targetTerm,
            targetCategory: rule.targetCategory,
        }

        const key = `${ step.ruleId };${ step.sourceCategory };${ step.sourceTerm };${ step.targetCategory };${ step.targetTerm }`
        if (stepsSeen.has(key))
            continue

        stepsSeen.add(key)
        steps.push(step)
    }

    const paths: BreakdownPath[] = []

    for (const step of steps)
    {
        const prevBreakdown = breakdown(
            step.sourceTerm,
            step.sourceCategory)

        for (const prevPath of prevBreakdown)
            paths.push([...prevPath, step])

        if (prevBreakdown.length === 0)
            paths.push([step])
    }

    return paths
}


export function flattenBreakdown(
    inflectionBreakdown: Breakdown)
    : Inflected[]
{
    const inflectionOf: Inflected[] = []
    const seenInflections = new Set<string>()
    for (const step of inflectionBreakdown.flat())
    {
        const key = `${ step.sourceTerm };${ step.sourceCategory }`
        if (seenInflections.has(key))
            continue

        seenInflections.add(key)
        inflectionOf.push({
            term: step.sourceTerm,
            category: step.sourceCategory,
        })
    }

    return inflectionOf
}


export function getRuleGroup(
    id: string)
    : Group | undefined
{
    const table = getTable()
    return table.groups.get(id)
}


export function getRules(
    id: string)
    : Rule[]
{
    const table = getTable()
    return table.rules.filter(r => r.id === id)
}


export function test()
{
    const table = getTable()
    console.dir(table)
    console.dir(breakdown("たべまして"))
    console.dir(breakdown("たべません"))
    console.dir(breakdown("たべらず"))
    console.dir(breakdown("たべてない"))
    console.dir(breakdown("たべてず"))
}