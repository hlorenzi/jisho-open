import * as Kana from "./kana.ts"
import { raw } from "./inflection.raw.ts"


export const table = compile(raw)


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
    invalid: boolean
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

        if (!source[1].startsWith("*") &&
            source[1] !== "!")
            throw `invalid source pattern: ${source[1]}`

        if (!target[1].startsWith("*"))
            throw `invalid target pattern: ${source[1]}`

        const invalid = source[1] === "!"
        const removeFromEnd = source[1].substring("*".length)
        const addToEnd = target[1].substring("*".length)

        const targetCategory = target[0]

        const sourceCategory = source[0]
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
                    invalid,
                    sourceCategory: sourceRule.sourceCategory,
                    removeFromEnd: sourceRule.removeFromEnd + removeFromEnd,
                    addToEnd: sourceRule.addToEnd + addToEnd,
                    targetCategory,
                })
            
            rules.set(currentGroupId, ruleList)
            continue
        }

        const rule: Rule = {
            id: currentGroupId,
            invalid,
            sourceCategory,
            removeFromEnd,
            targetCategory,
            addToEnd,
        }

        let ruleList = rules.get(currentGroupId) ?? []
        ruleList = ruleList.filter(r =>
            r.id !== currentGroupId ||
            r.sourceCategory !== sourceCategory ||
            r.removeFromEnd !== removeFromEnd)
        ruleList.push(rule)
        rules.set(currentGroupId, ruleList)

        const endingsSet = endings.get(sourceCategory) ?? new Set()
        endingsSet.add(removeFromEnd)
        endings.set(sourceCategory, endingsSet)
    }

    return {
        endingsByCategory: endings,
        groups,
        rules: [...rules.values()].flat().filter(r => !r.invalid),
    }
}


export function breakdown(
    targetTerm: string,
    category?: string)
    : Breakdown
{
    const steps: BreakdownStep[] = []

    for (const rule of table.rules)
    {
        if (rule.targetCategory !== "*" &&
            category &&
            category !== rule.targetCategory)
            continue

        if (!targetTerm.endsWith(rule.addToEnd))
            continue

        if (table.groups.get(rule.id)!.hidden)
            continue
        
        const sourceTerm =
            targetTerm.slice(0, targetTerm.length - rule.addToEnd.length) +
            rule.removeFromEnd

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

        steps.push(step)
    }

    const paths: BreakdownPath[] = []

    for (const step of steps)
    {
        const prevBreakdown = breakdown(
            step.sourceTerm,
            step.sourceCategory)

        for (const prevPath of prevBreakdown)
        {
            paths.push([...prevPath, step])
        }

        if (prevBreakdown.length === 0)
            paths.push([step])
    }

    return paths
}


export function getRuleGroup(
    id: string)
    : Group | undefined
{
    return table.groups.get(id)
}


export function getRules(
    id: string)
    : Rule[]
{
    return table.rules.filter(r => r.id === id)
}


export function test()
{
    console.dir(table)
    console.dir(breakdown("たべまして"))
    console.dir(breakdown("たべません"))
    console.dir(breakdown("たべらず"))
    console.dir(breakdown("たべてない"))
    console.dir(breakdown("たべてず"))
}