import * as Solid from "solid-js"
import { styled } from "solid-styled-components"
import * as Framework from "../framework/index.ts"
import * as App from "../app.tsx"
import * as Inflection from "common/inflection.ts"
import * as JmdictTags from "common/jmdict_tags.ts"


const isIchidanVerb = (p: App.Api.Word.PartOfSpeechTag) =>
{
    if (p == "v1")
        return true

    return false
}

const isGodanVerb = (p: App.Api.Word.PartOfSpeechTag) =>
{
    if (p == "v5u" || p == "v5r" || p == "v5t" || p == "v5k" ||
        p == "v5g" || p == "v5s" || p == "v5b" || p == "v5m" ||
        p == "v5n")
        return true

    return false
}

const isIrregularVerb = (p: App.Api.Word.PartOfSpeechTag) =>
{
    if (p == "v1-s" ||
        p == "vs" || p == "vs-i" || p == "vs-s" ||
        p == "vk" || p == "v5k-s" || p == "v5aru" ||
        p == "v5u-s" ||
        p == "v5r-i" || p == "vz")
        return true

    return false
}

const isVerb = (p: App.Api.Word.PartOfSpeechTag) =>
{
    return isIchidanVerb(p) || isGodanVerb(p) || isIrregularVerb(p)
}

const getRegularCounterpart = (p: App.Api.Word.PartOfSpeechTag | undefined) =>
{
    if (p === undefined)
        return undefined

    type Dict = {
        [key in App.Api.Word.PartOfSpeechTag]: App.Api.Word.PartOfSpeechTag
    }

    const regular: Partial<Dict> = {
        "v1-s": "v1",
        "v5k-s": "v5k",
        "v5aru": "v5r",
        "v5u-s": "v5u",
        "v5r-i": "v5r",
        "vz": "v1",
    }

    return regular[p] ?? p
}


export const hasTable = (pos: App.Api.Word.PartOfSpeechTag[]) =>
{
    return pos.some(p =>
        isVerb(p) ||
        p == "adj-i" || p == "adj-ix" ||
        p == "adj-na" ||
        p == "n")
}


export function InflectionTable(props: {
    term: string,
    partOfSpeechTags: App.Api.Word.PartOfSpeechTag[],
})
{
    let nounPos = props.partOfSpeechTags.find(p => p === "n")
    let adjNaPos = props.partOfSpeechTags.find(p => p == "adj-na")
    let adjIPos = props.partOfSpeechTags.find(p => p == "adj-i" || p == "adj-ix")
    let verbPos = props.partOfSpeechTags.find(p => isVerb(p))
    
    let verbTerm = props.term
    if (props.partOfSpeechTags.some(p => p == "vs"))
    {
        verbTerm += "する"
        verbPos = "vs-i"
    }

    return <div>
        <Solid.Show when={ nounPos && !adjNaPos }>
            <NounTable
                term={ props.term }
                partOfSpeech={ nounPos! }
            />
        </Solid.Show>
        
        <Solid.Show when={ adjNaPos }>
            <AdjNaTable
                term={ props.term }
                partOfSpeech={ adjNaPos! }
            />
        </Solid.Show>
        
        <Solid.Show when={ adjIPos }>
            <AdjITable
                term={ props.term }
                partOfSpeech={ adjIPos! }
            />
        </Solid.Show>
        
        <Solid.Show when={ verbPos }>
            <VerbTable
                term={ verbTerm }
                partOfSpeech={ verbPos! }
            />
        </Solid.Show>
    </div>
}


function Table(props: {
    children: Solid.JSX.Element,
    term: string,
    partOfSpeech: App.Api.Word.PartOfSpeechTag,
})
{
    return <TableLayout>
        <TableTerm>
            { props.term }
            { " " }
            <TablePartOfSpeech>
                { JmdictTags.nameForPartOfSpeechTag(props.partOfSpeech) }
            </TablePartOfSpeech>
        </TableTerm>
        <div/>
        <TableColumnHeader>
            Plain
        </TableColumnHeader>
        <TableColumnHeader>
            Polite
        </TableColumnHeader>
        { props.children }
    </TableLayout>
}


const TableLayout = styled.div`
    display: grid;
    grid-template: auto / 1fr auto auto;
    grid-column-gap: 0.5em;
    grid-row-gap: 0.5em;
    font-size: 1em;
    align-items: center;
    color: ${ Framework.themeVar("textColor") };
    margin-bottom: 1em;
`


const TableTerm = styled.div`
    grid-column: 1 / -1;
    justify-self: center;
    padding: 0.1em 0.5em;
    background-color: ${ Framework.themeVar("textStrongBkgColor") };
    border-radius: ${ Framework.themeVar("borderRadius") };
    text-align: center;
`


const TablePartOfSpeech = styled.span`
    color: ${ Framework.themeVar("iconGreenColor") };
    font-size: 0.8em;
`


const TableColumnHeader = styled.div`
    color: ${ Framework.themeVar("text2ndColor") };
    font-style: italic;
    font-size: 0.8em;
    align-self: end;
`


const TableRowHeader = styled.div`
    color: ${ Framework.themeVar("text2ndColor") };
    font-style: italic;
    font-size: 0.8em;
    justify-self: end;
    text-align: right;
`


const TableCell = styled.div`
    margin-right: 0.5em;
    display: inline-block;
    line-height: 1em;
`


const TableRowSeparator = styled.hr`
    grid-column: 1 / -1;

    border: 0;
    border-bottom: 1px solid ${ Framework.themeVar("borderColor") };

    margin: 0;
    padding: 0;
`


function splitAtInfl(base: string, inflected: string)
{
    let matchIndex = 0
    while (matchIndex < base.length &&
        matchIndex < inflected.length &&
        base[matchIndex] == inflected[matchIndex])
        matchIndex++

    return [inflected.slice(0, matchIndex), inflected.slice(matchIndex)]
}


function Row(props: {
    label: string,
    term: string,
    partOfSpeech: App.Api.Word.PartOfSpeechTag,
    plain?: string,
    plainInfl?: string[],
    plainInfl2?: string[],
    polite?: string,
    politeInfl?: string[],
    politeInfl2?: string[],
    politeSuffix?: string,
})
{
    let plainTerms: string[] = []
    if (props.plain)
        plainTerms = [props.plain]
    else if (props.plainInfl)
        plainTerms = Inflection
            .inflect(props.term, props.partOfSpeech, props.plainInfl)
            .flatMap(i => i.term)
            
    if (props.plainInfl2)
        plainTerms.push(...Inflection
            .inflect(props.term, props.partOfSpeech, props.plainInfl2)
            .flatMap(i => i.term))

    let politeTerms: string[] = []
    if (props.polite)
        politeTerms = [props.polite]
    else if (props.politeInfl)
        politeTerms = Inflection
            .inflect(props.term, props.partOfSpeech, props.politeInfl)
            .flatMap(i => i.term + (props.politeSuffix ?? ""))
    
    if (props.politeInfl2)
        politeTerms.push(...Inflection
            .inflect(props.term, props.partOfSpeech, props.politeInfl2)
            .flatMap(i => i.term + (props.politeSuffix ?? "")))

    const basicSplit = plainTerms
        .map(t => splitAtInfl(props.term, t))

    const politeSplit = politeTerms
        .map(t => splitAtInfl(props.term, t))

    return <>
        <TableRowHeader>
            { props.label }
        </TableRowHeader>
        <TableCell>
            <Solid.For each={ basicSplit }>
            { split => <>
                    <span>{ split[0] }</span>
                    <span style={{ "font-weight": "bold" }}>{ split[1] }</span>
                    <br/>
                </>
            }
            </Solid.For>
        </TableCell>
        <TableCell>
            <Solid.For each={ politeSplit }>
            { split => <>
                    <span>{ split[0] }</span>
                    <span style={{ "font-weight": "bold" }}>{ split[1] }</span>
                    <br/>
                </>
            }
            </Solid.For>
        </TableCell>
    </>
}


function NounTable(props: {
    term: string,
    partOfSpeech: App.Api.Word.PartOfSpeechTag,
})
{
    return <Table
        term={ props.term }
        partOfSpeech={ props.partOfSpeech }
    >
        <Row
            label="Base form"
            term={ props.term }
            partOfSpeech={ props.partOfSpeech }
            plain={ props.term + "（だ）" }
            polite={ props.term + "です" }
        />
        <Row
            label="Past"
            term={ props.term }
            partOfSpeech={ props.partOfSpeech }
            plainInfl={ ["past"] }
            polite={ props.term + "でした" }
        />
        <Row
            label="Negative"
            term={ props.term }
            partOfSpeech={ props.partOfSpeech }
            plainInfl={ ["negative"] }
            politeInfl={ ["negative"] }
            politeSuffix={ "です" }
        />
        <Row
            label="Past-Negative"
            term={ props.term }
            partOfSpeech={ props.partOfSpeech }
            plainInfl={ ["negative", "past"] }
            politeInfl={ ["negative", "past"] }
            politeSuffix={ "です" }
        />
    </Table>
}


function AdjNaTable(props: {
    term: string,
    partOfSpeech: App.Api.Word.PartOfSpeechTag,
})
{
    return <Table
        term={ props.term }
        partOfSpeech={ props.partOfSpeech }
    >
        <Row
            label="Base form"
            term={ props.term }
            partOfSpeech={ props.partOfSpeech }
            plain={ props.term + "（だ）" }
            polite={ props.term + "です" }
        />
        <Row
            label="Past"
            term={ props.term }
            partOfSpeech={ props.partOfSpeech }
            plainInfl={ ["past"] }
            polite={ props.term + "でした" }
        />
        <Row
            label="Negative"
            term={ props.term }
            partOfSpeech={ props.partOfSpeech }
            plainInfl={ ["negative"] }
            politeInfl={ ["negative"] }
            politeSuffix={ "です" }
        />
        <Row
            label="Past-Negative"
            term={ props.term }
            partOfSpeech={ props.partOfSpeech }
            plainInfl={ ["negative", "past"] }
            politeInfl={ ["negative", "past"] }
            politeSuffix={ "です" }
        />
        <TableRowSeparator/>
        <Row
            label="Conjunctive"
            term={ props.term }
            partOfSpeech={ props.partOfSpeech }
            plainInfl={ ["conjunctive"] }
        />
        <Row
            label="Adverbial"
            term={ props.term }
            partOfSpeech={ props.partOfSpeech }
            plainInfl={ ["adverbial"] }
        />
        <Row
            label="Nominal"
            term={ props.term }
            partOfSpeech={ props.partOfSpeech }
            plainInfl={ ["nominal"] }
        />
        <TableRowSeparator/>
        <Row
            label="Conditional"
            term={ props.term }
            partOfSpeech={ props.partOfSpeech }
            plainInfl={ ["conditional"] }
        />
        <Row
            label="Provisional"
            term={ props.term }
            partOfSpeech={ props.partOfSpeech }
            plainInfl={ ["provisional"] }
        />
        <TableRowSeparator/>
        <Row
            label="Aux. そう"
            term={ props.term }
            partOfSpeech={ props.partOfSpeech }
            plainInfl={ ["aux-sou"] }
        />
        <Row
            label="Aux. すぎる"
            term={ props.term }
            partOfSpeech={ props.partOfSpeech }
            plainInfl={ ["aux-sugiru"] }
        />
    </Table>
}


function AdjITable(props: {
    term: string,
    partOfSpeech: App.Api.Word.PartOfSpeechTag,
})
{
    return <Table
        term={ props.term }
        partOfSpeech={ props.partOfSpeech }
    >
        <Row
            label="Base form"
            term={ props.term }
            partOfSpeech={ props.partOfSpeech }
            plain={ props.term }
            polite={ props.term + "です" }
        />
        <Row
            label="Past"
            term={ props.term }
            partOfSpeech={ props.partOfSpeech }
            plainInfl={ ["past"] }
            politeInfl={ ["past"] }
            politeSuffix={ "です" }
        />
        <Row
            label="Negative"
            term={ props.term }
            partOfSpeech={ props.partOfSpeech }
            plainInfl={ ["negative"] }
            politeInfl={ ["negative"] }
            politeSuffix={ "です" }
        />
        <Row
            label="Past-Negative"
            term={ props.term }
            partOfSpeech={ props.partOfSpeech }
            plainInfl={ ["negative", "past"] }
            politeInfl={ ["negative", "past"] }
            politeSuffix={ "です" }
        />
        <TableRowSeparator/>
        <Row
            label="Conjunctive"
            term={ props.term }
            partOfSpeech={ props.partOfSpeech }
            plainInfl={ ["conjunctive"] }
        />
        <Row
            label="Adverbial"
            term={ props.term }
            partOfSpeech={ props.partOfSpeech }
            plainInfl={ ["adverbial"] }
        />
        <Row
            label="Nominal"
            term={ props.term }
            partOfSpeech={ props.partOfSpeech }
            plainInfl={ ["nominal"] }
        />
        <TableRowSeparator/>
        <Row
            label="Conditional"
            term={ props.term }
            partOfSpeech={ props.partOfSpeech }
            plainInfl={ ["conditional"] }
        />
        <Row
            label="Provisional"
            term={ props.term }
            partOfSpeech={ props.partOfSpeech }
            plainInfl={ ["provisional"] }
        />
        <TableRowSeparator/>
        <Row
            label="Aux. そう"
            term={ props.term }
            partOfSpeech={ props.partOfSpeech }
            plainInfl={ ["aux-sou"] }
        />
        <Row
            label="Aux. すぎる"
            term={ props.term }
            partOfSpeech={ props.partOfSpeech }
            plainInfl={ ["aux-sugiru"] }
        />
    </Table>
}


function VerbTable(props: {
    term: string,
    partOfSpeech: App.Api.Word.PartOfSpeechTag,
})
{
    const showPotentialIrregualr =
        props.partOfSpeech === "v1" ||
        props.partOfSpeech === "vk"

    return <Table
        term={ props.term }
        partOfSpeech={ props.partOfSpeech }
    >
        <Row
            label="Base form"
            term={ props.term }
            partOfSpeech={ props.partOfSpeech }
            plain={ props.term }
            politeInfl={ ["polite"] }
        />
        <Row
            label="Past"
            term={ props.term }
            partOfSpeech={ props.partOfSpeech }
            plainInfl={ ["past"] }
            politeInfl={ ["polite", "past"] }
        />
        <Row
            label="Negative"
            term={ props.term }
            partOfSpeech={ props.partOfSpeech }
            plainInfl={ ["negative"] }
            politeInfl={ ["polite", "negative"] }
        />
        <Row
            label="Past-Negative"
            term={ props.term }
            partOfSpeech={ props.partOfSpeech }
            plainInfl={ ["negative", "past"] }
            politeInfl={ ["polite", "negative", "past"] }
        />
        <TableRowSeparator/>
        <Row
            label="Continuative"
            term={ props.term }
            partOfSpeech={ props.partOfSpeech }
            plainInfl={ ["continuative"] }
        />
        <Row
            label="Conjunctive"
            term={ props.term }
            partOfSpeech={ props.partOfSpeech }
            plainInfl={ ["conjunctive"] }
        />
        <Row
            label="Volitional"
            term={ props.term }
            partOfSpeech={ props.partOfSpeech }
            plainInfl={ ["volitional"] }
            politeInfl={ ["polite", "volitional"] }
        />
        <Row
            label="Imperative"
            term={ props.term }
            partOfSpeech={ props.partOfSpeech }
            plainInfl={ ["imperative"] }
        />
        <TableRowSeparator/>
        <Solid.Show when={ props.partOfSpeech !== "vs-s" }>
            <Row
                label="Potential"
                term={ props.term }
                partOfSpeech={ props.partOfSpeech }
                plainInfl={ ["potential"] }
                politeInfl={ ["potential", "polite"] }
            />
        </Solid.Show>
        <Solid.Show when={ props.partOfSpeech === "vs-s" }>
            <Row
                label="Potential"
                term={ props.term }
                partOfSpeech={ props.partOfSpeech }
                plainInfl={ ["potential"] }
                plainInfl2={ ["potential-eru"] }
                politeInfl={ ["potential", "polite"] }
                politeInfl2={ ["potential-eru", "polite"] }
            />
        </Solid.Show>
        <Solid.Show when={ showPotentialIrregualr }>
            <Row
                label="Potential (irregular)"
                term={ props.term }
                partOfSpeech={ props.partOfSpeech }
                plainInfl={ ["potential-irregular"] }
                politeInfl={ ["potential-irregular", "polite"] }
            />
        </Solid.Show>
        <Row
            label="Passive"
            term={ props.term }
            partOfSpeech={ props.partOfSpeech }
            plainInfl={ ["passive"] }
            politeInfl={ ["passive", "polite"] }
        />
        <Row
            label="Causative"
            term={ props.term }
            partOfSpeech={ props.partOfSpeech }
            plainInfl={ ["causative"] }
            politeInfl={ ["causative", "polite"] }
        />
        <Row
            label="Causative-Passive"
            term={ props.term }
            partOfSpeech={ props.partOfSpeech }
            plainInfl={ ["causative", "passive"] }
            politeInfl={ ["causative", "passive", "polite"] }
        />
        <TableRowSeparator/>
        <Row
            label="Alternative"
            term={ props.term }
            partOfSpeech={ props.partOfSpeech }
            plainInfl={ ["alternative"] }
        />
        <Row
            label="Conditional"
            term={ props.term }
            partOfSpeech={ props.partOfSpeech }
            plainInfl={ ["conditional"] }
        />
        <Row
            label="Provisional"
            term={ props.term }
            partOfSpeech={ props.partOfSpeech }
            plainInfl={ ["provisional"] }
        />
        <Row
            label="Want-to-do"
            term={ props.term }
            partOfSpeech={ props.partOfSpeech }
            plainInfl={ ["want-to-do"] }
        />
        <TableRowSeparator/>
        <Row
            label="Classical Negative"
            term={ props.term }
            partOfSpeech={ props.partOfSpeech }
            plainInfl={ ["negative-classical"] }
        />
        <Row
            label="Negative Continuative"
            term={ props.term }
            partOfSpeech={ props.partOfSpeech }
            plainInfl={ ["negative-continuative"] }
        />
    </Table>
}