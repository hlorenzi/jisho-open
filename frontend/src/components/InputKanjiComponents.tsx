import * as Solid from "solid-js"
import { styled, css } from "solid-styled-components"
import * as Framework from "../framework/index.ts"
import * as App from "../app.tsx"
import * as KanjiComponents from "common/kanji_components.ts"
import { Searchbox } from "./Searchbox.tsx"


export function InputKanjiComponents(props: {
    textSignal: Solid.Signal<string>,
    close: () => void,
})
{
    const [selected, setSelected] =
        Solid.createSignal(new Set<string>())

    const initialText = props.textSignal[0]()
    if (initialText.indexOf("#c") >= 0)
    {
        const kanjiComponentsSet = new Set<string>(
            KanjiComponents.kanjiComponents.map(c => c[0]))

        const newSet = new Set<string>([...selected()])
        
        for (const component of initialText)
        {
            if (kanjiComponentsSet.has(component))
                newSet.add(component)
        }

        setSelected(newSet)
    }

    const [onlyCommon, setOnlyCommon] =
        Solid.createSignal(true)

    const response = Framework.createAsyncSignal(
        () => [selected(), onlyCommon()] as const,
        async (data) => {
            if (data[0].size === 0)
                return undefined

            const components = [...data[0]]
                .sort((a, b) => a.codePointAt(0)! - b.codePointAt(0)!)

            const res = await App.Api.getKanjiByComponents({
                components: components.join(""),
                onlyCommon: data[1],
            })

            const availableComponents = new Set<string>()
            for (const kanji of res.kanji)
                for (const comp of kanji.components)
                    availableComponents.add(comp)

            return {
                components: data[0],
                kanji: res.kanji,
                availableComponents,
            }
        })

    const onClearSelection = () => {
        setSelected(new Set<string>())
    }

    const onToggle = (component: string) => {
        const newSet = new Set<string>([...selected()])

        if (selected().has(component))
            newSet.delete(component)
        else
            newSet.add(component)

        setSelected(newSet)
    }

	const onInsert = (kanji: string) => {
		App.analyticsEvent("searchInsertKanji")
		props.textSignal[1](t => t + kanji)
	}

    return <Layout>

        <Searchbox
            textSignal={ props.textSignal }
            onSearch={ props.close }
            noInputButton
        />

        <div>
            <Framework.Checkbox
                label="Only common kanji"
                value={ onlyCommon }
                onChange={ setOnlyCommon }
            />

            <div style={{
                "display": "inline-block",
                "margin-left": "1em",
                "font-size": "0.8em",
                "color": Framework.themeVar("text3rdColor"),
            }}>
                <Framework.Link
                    label={ <><Framework.IconMagnifyingGlass/> Perform a component search</> }
                    href={ selected().size === 0 ?
                        undefined :                        
                        App.Pages.Search.urlForComponentsQuery([...selected()].join(""))
                    }
                />
            </div>
        </div>

        <LayoutResults>

            <Solid.Show when={ response().loading }>
                <Framework.LoadingBar ignoreLayout/>
            </Solid.Show>

            { mapWithInlinedCounts(
                response().latest?.kanji ?? [],
                (entry) => entry.strokeCount,
                (entry) =>
                    <Framework.Button
                        label={ entry.id }
                        onClick={ () => onInsert(entry.id) }
                        noBorder
                        style={{
                            margin: 0,
                            padding: 0,
                            "text-align": "center",
                            width: "2em",
                            height: "2em",
                        }}
                    >
                        <KanjiLabel>
                            { entry.id }
                        </KanjiLabel>
                    </Framework.Button>,
                (count) => <StrokeCountSlot>
                    <StrokeCountLabel>
                        { count }
                    </StrokeCountLabel>
                </StrokeCountSlot>
            )}
        </LayoutResults>

        <LayoutComponents>
            <Framework.Button
                onClick={ onClearSelection }
                noBorder
                style={{
                    margin: 0,
                    padding: 0,
                    "text-align": "center",
                    width: "2em",
                    height: "2em",
                }}
            >
                <KanjiLabel>
                    <span style={{ "font-size": "0.8em" }}>
                    <Framework.IconTrash/>
                    </span>
                </KanjiLabel>
            </Framework.Button>

            { mapWithInlinedCounts(
                KanjiComponents.kanjiComponents,
                (entry) => entry[1],
                (entry) =>
                    <Framework.Button
                        onClick={ () => onToggle(entry[0]) }
                        noBorder
                        toggled={ selected().has(entry[0]) }
                        unavailable={
                            response().latest !== undefined &&
                            response().latest!.components.size !== 0 &&
                            !response().latest!.availableComponents.has(entry[0])
                        }
                        style={{
                            margin: 0,
                            padding: 0,
                            "text-align": "center",
                            width: "2em",
                            height: "2em",
                        }}
                    >
                        <KanjiLabel>
                            { entry[0] }
                        </KanjiLabel>
                    </Framework.Button>,
                (count) => <StrokeCountSlot>
                    <StrokeCountLabel>
                        { count }
                    </StrokeCountLabel>
                </StrokeCountSlot>
            )}
        </LayoutComponents>

    </Layout>
}


const Layout = styled.div`
    display: grid;
    grid-template: auto auto auto / auto;
    grid-row-gap: 0.5em;
    overflow: hidden;
    text-align: left;
    color: ${ Framework.themeVar("textColor") };
`


const LayoutResults = styled.div`
    width: 100%;
    height: 7.25em;
    max-height: 20vh;
    overflow-x: hidden;
    overflow-y: auto;
    background-color: ${ Framework.themeVar("textStrongBkgColor") };
    border-radius: ${ Framework.themeVar("borderRadius") };
`


const LayoutComponents = styled.div`
    width: 100%;
    max-height: 50vh;
    overflow-x: hidden;
    overflow-y: auto;
`


const KanjiLabel = styled.span`
    font-size: 1.4em;
    font-weight: ${ App.cssVarJapaneseFontWeight };
`


const StrokeCountSlot = styled.div`
    display: inline-block;
    width: 2em;
    height: 1.5em; /* FIXME: Can't get the height to play nice with the rest of the layout. */
    line-height: 1em;
    color: ${ Framework.themeVar("pageBkgColor") };
    background-color: ${ Framework.themeVar("text2ndColor") };
    border-radius: ${ Framework.themeVar("borderRadius") };
    user-select: none;
`


const StrokeCountLabel = styled.div`
    display: flex;
    justify-items: center;
    align-items: center;
    justify-content: center;
    align-content: center;
    width: 100%;
    height: 100%;
    font-size: 1.15em;
    font-weight: bold;
`


function mapWithInlinedCounts<T>(
    array: T[],
    countFn: (item: T) => number,
    renderItem: (item: T) => Solid.JSX.Element,
    renderCount: (count: number) => Solid.JSX.Element)
{
    let currentCount = 0

    const rendered: Solid.JSX.Element[] = []

    for (let i = 0; i < array.length; i++)
    {
        const count = countFn(array[i])
        if (count !== currentCount)
        {
            rendered.push(renderCount(count))
            currentCount = count
        }

        rendered.push(renderItem(array[i]))
    }

    return rendered
}