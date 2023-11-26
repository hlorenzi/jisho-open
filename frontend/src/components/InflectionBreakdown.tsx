import * as Solid from "solid-js"
import { styled } from "solid-styled-components"
import * as Framework from "../framework/index.ts"
import * as Inflection from "common/inflection.ts"
import * as JmdictTags from "common/jmdict_tags.ts"


export function InflectionBreakdown(props: {
    breakdown?: Inflection.Breakdown,
})
{
    return <Solid.Show when={ props.breakdown }>
        <InflectionBreakdownSection>
            <Solid.For each={ props.breakdown }>{ (path) =>
                <InflectionPath path={ path }/>
            }
            </Solid.For>
        </InflectionBreakdownSection>
    </Solid.Show>
}


const InflectionBreakdownSection = styled.ol`
    margin: 0;
    margin-bottom: 0.25em;
    padding-left: 1.75em;

    & li::marker {
        color: ${ Framework.themeVar("text3rdColor") };
        content: " 🡆 ";
        padding-right: 0.25em;
    }

    & li {
        counter-increment: item;
    }
    
	@media (max-width: ${ Framework.pageSmallWidthThreshold })
	{
        margin-left: -0.5em;
    }
`


function InflectionPath(props: {
    path: Inflection.BreakdownPath,
})
{
    const steps: Solid.JSX.Element[] = []

    steps.push(
        <InflectionTerm first={ true }>
            { props.path[0].sourceTerm }
        </InflectionTerm>
    )

    for (let i = 0; i < props.path.length; i++)
    {
        const step = props.path[i]
        const ruleDisplay = Inflection.getTable().groups.get(step.ruleId)!.display

        const [termStart, termMid, termEnd] = splitAtChangedChars(
            step.sourceTerm,
            step.targetTerm)

        const popupRefs = Framework.makePopupPageWide({
            childrenFn: () => <InflectionRulePopup
                ruleId={ step.ruleId }
                sourceCategory={ step.sourceCategory }
                sourceTerm={ step.sourceTerm }
                targetTerm={ step.targetTerm }
            />
        })

        steps.push(
            <InflectionStep>
                <InflectionRule>
                    <Framework.Link
                        label={ <>{ ruleDisplay } 🡆</> }
                        onClick={ ev => popupRefs.open(ev.currentTarget) }
                        noUnderline
                    />
                </InflectionRule>
                <InflectionTerm first={ false }>
                    <InflectionTermChanged>
                        { termStart }
                    </InflectionTermChanged>
                    { termMid }
                    <InflectionTermChanged>
                        { termEnd }
                    </InflectionTermChanged>
                </InflectionTerm>
                { popupRefs.rendered }
            </InflectionStep>
        )
    }

    return <InflectionRow>{ steps }</InflectionRow>
}


function splitAtChangedChars(
    source: string,
    target: string)
    : [string, string, string]
{
    let sameStart = 0
    while (sameStart < target.length &&
        target[sameStart] === source[sameStart])
        sameStart += 1

    const termMid = target.substring(0, sameStart)
    const termEnd = target.substring(sameStart)

    return ["", termMid, termEnd]
}


const InflectionRow = styled.li`
    margin-top: 0.4em;
`


const InflectionStep = styled.div`
    display: inline-block;
`


const InflectionTerm = styled.span<{
    first: boolean,
}>`
    padding: 0.1em 0.4em;
    border-radius: ${ Framework.themeVar("borderRadius") };

    ${ props => props.first ? `
        color: ${ Framework.themeVar("textColor") };
        background-color: ${ Framework.themeVar("textStrongBkgColor") };
    ` : `
        color: ${ Framework.themeVar("text3rdColor") };
        border: 2px solid ${ Framework.themeVar("textStrongBkgColor") };
    ` }
`


const InflectionTermChanged = styled.span`
    color: ${ Framework.themeVar("textColor") };
    font-weight: bold;
`


const InflectionRule = styled.span`
    position: relative;
    top: -0.5em;
    color: ${ Framework.themeVar("text2ndColor") };
    border-bottom: 2px dotted ${ Framework.themeVar("text3rdColor") };
    font-size: 0.75em;
    padding: 0 0.25em;
    margin: 0 0.5em;
`


function InflectionRulePopup(props: {
    ruleId: string,
    sourceCategory: string,
    sourceTerm: string,
    targetTerm: string,
})
{
    const ruleGroup = Inflection.getRuleGroup(props.ruleId)
    const rules = Inflection.getRules(props.ruleId)

    const rulesSeen = new Set<string>()
    const rulesDedup: Inflection.Rule[] = []
    for (const rule of rules)
    {
        const key = `${ rule.sourceCategory };${ rule.removeFromEnd };${ rule.addToEnd }`
        if (rulesSeen.has(key))
            continue

        rulesSeen.add(key)
        rulesDedup.push(rule)
    }

    const rulesForCategory = rulesDedup.filter(r =>
        r.sourceCategory === props.sourceCategory &&
        Inflection.endsWith(props.sourceTerm, r.removeFromEnd) &&
        Inflection.endsWith(props.targetTerm, r.addToEnd))

    const [rulesExpanded, setRulesExpanded] = Solid.createSignal(false)


    return <InflectionPopupWrapper>
        <Solid.Show when={ rulesDedup.length !== 0 }>
            <h2>
                Derivation for <CategoryName>{ ruleGroup!.display }</CategoryName>
            </h2>
            <InflectionTableSection>
                <InflectionTable expanded={ rulesExpanded() }>
                    <Solid.For each={ rulesExpanded() ? rulesDedup : rulesForCategory }>{ (rule) =>
                        <>
                        <InflectionTablePartOfSpeech>
                            { JmdictTags.nameForPartOfSpeechTag(rule.sourceCategory as any) }
                        </InflectionTablePartOfSpeech>
                        <InflectionTablePattern>
                            〇〇
                            <InflectionTablePatternChange>
                                { rule.removeFromEnd }
                            </InflectionTablePatternChange>
                        </InflectionTablePattern>
                        <div>
                            { " ➞ " }
                        </div>
                        <InflectionTablePattern>
                            〇〇
                            <InflectionTablePatternChange>
                                { rule.addToEnd }
                            </InflectionTablePatternChange>
                        </InflectionTablePattern>
                        </>
                    }
                    </Solid.For>
                </InflectionTable>
                <span style={{
                    "color": Framework.themeVar("text3rdColor"),
                    "font-size": "0.8em",
                }}>
                    <Framework.Link
                        label={ !rulesExpanded() ?
                            <><Framework.IconVerticalEllipsis/> View for all categories</> :
                            <><Framework.IconTriangleUp/> Collapse</>
                        }
                        onClick={ () => setRulesExpanded(!rulesExpanded()) }
                    />
                </span>
            </InflectionTableSection>
        </Solid.Show>
        
        <Solid.Show when={ ruleGroup?.refs.length !== 0 }>
            <h2>
                Resources
            </h2>
            <ResourcesList>
                <Solid.For each={ ruleGroup!.refs }>{ (ref) =>
                    <li>
                        <Framework.Link
                            href={ ref }
                            label={ ref }
                        />
                    </li>
                }
                </Solid.For>
            </ResourcesList>
        </Solid.Show>
    </InflectionPopupWrapper>
}


const InflectionPopupWrapper = styled.div`
    margin: 1em 0;
`


const CategoryName = styled.span`
    display: inline-block;
    padding: 0.2em 0.4em;
    margin-bottom: 0.2em;
    background-color: ${ Framework.themeVar("textStrongBkgColor") };
    border-radius: 0.25em;
`


const InflectionTableSection = styled.section`
    margin-left: 1em;
    margin-bottom: 1em;
`


const InflectionTable = styled.div<{
    expanded: boolean,
}>`
    display: grid;
    grid-template: auto / auto auto auto auto;
    justify-content: start;
    justify-items: start;
    align-content: start;
    align-items: baseline;
    grid-column-gap: 0.5em;
`


const InflectionTablePartOfSpeech = styled.span`
    color: ${ Framework.themeVar("iconGreenColor") };
    font-size: 0.8em;
    justify-self: end;
`


const InflectionTablePattern = styled.span`
    color: ${ Framework.themeVar("text3rdColor") };
`


const InflectionTablePatternChange = styled.span`
    color: ${ Framework.themeVar("textColor") };
    font-weight: bold;
`


const ResourcesList = styled.ul`
    margin: 0;
    padding-left: 1em;
    word-wrap: break-word;

    & li::marker {
        color: ${ Framework.themeVar("text4thColor") };
        content: "• ";
        padding-right: 0.25em;
    }
`