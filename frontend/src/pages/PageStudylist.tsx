import * as Solid from "solid-js"
import { styled } from "solid-styled-components"
import * as Framework from "../framework/index.ts"
import * as App from "../app.tsx"
import * as JmdictTags from "common/jmdict_tags.ts"
import { Page } from "../components/Page.tsx"
import { Searchbox } from "../components/Searchbox.tsx"
import { UserLink } from "../components/User.tsx"
import { HeadingLabel } from "../components/EntryWord.tsx"
import * as StudylistExport from "./studylistExport.ts"


const collapsedLength = 20


export type StudyListWordEntry =
    App.Api.StudyList.WordEntry & { entry: App.Api.Word.Entry }


export function PageStudylist(props: Framework.RouteProps)
{
    const studylistId = Solid.createMemo(
        () => props.routeMatch()?.matches[App.Pages.Studylist.matchStudylistId] ?? "")

    const [data] = Solid.createResource(
        studylistId,
        async (studylistId) => {
            const authUser = await App.Api.authenticate()
            const { studylist } = await App.Api.studylistGet({ studylistId })
            const { entries } = await App.Api.studylistWordsGet({ studylistId })
            const { user } = await App.Api.getUser({ userId: studylist.creatorId })
            const userIsCreator =
                authUser.id === user.id ||
                authUser.tags?.some(tag => tag === "admin")

            const wordEntriesById = new Map<string, App.Api.Word.Entry>()
            entries.forEach(e => wordEntriesById.set(e.id, e))

            const words = studylist.words
                .map(w => ({ ...w, entry: wordEntriesById.get(w.id)! }))
                .reverse()

            return {
                authUser,
                user,
                userIsCreator,
                studylist,
                words,
            }
        })

    const wordsOrdered = Solid.createMemo(() => {
        let words = data()?.words
        if (!words)
            return undefined

        if (App.usePrefs().studylistWordOrdering === "kana")
        {
            words = [...words]
            words.sort((a, b) =>
                (a.entry.headings[0].reading ?? a.entry.headings[0].base)
                    ?.localeCompare(b.entry.headings[0].reading ?? b.entry.headings[0].base))
        }

        return words
    })

    const [expanded, setExpanded] =
        Framework.createHistorySignal("expanded", false)

    const [selected, setSelected] =
        Framework.createHistorySignal("selected", new Set<string>())

    const onRename = async () => {
        if (!await App.Api.studylistEditName(data()!.studylist))
            return
            
        Framework.historyReload()
    }

    const onDelete = async () => {
        if (!await App.Api.studylistDelete(data()!.studylist))
            return
            
        Framework.historyPush(App.Pages.User.urlForUserId(data()!.user.id ?? ""))
    }

    const onTogglePublic = async () => {
        if (!await App.Api.studylistEditPublic(data()!.studylist))
            return
            
        Framework.historyReload()
    }

    const onSelectWord = async (wordId: string, wordSelected: boolean) => {
        const newSet = new Set<string>([...selected()])

        if (wordSelected)
            newSet.add(wordId)
        else
            newSet.delete(wordId)

        setSelected(newSet)
    }

    const onRemoveSelected = async () => {
        const message =
            `Remove the ${ selected().size } selected ` +
            Framework.formPlural(selected().size, "word", "s") +
            `?\n\n` +
            `Type in that number to confirm.`

        const answer = window.prompt(message, "")

        if (!answer ||
            answer !== selected().size.toString())
            return

        await App.Api.studylistWordRemoveMany({
            studylistId: data()!.studylist.id,
            wordIds: [...selected()],
        })

        setSelected(new Set<string>())
        Framework.historyReload()
    }

    const exportPopup = Framework.makePopupPageWide({
        childrenFn: () => <ExportPopup
            studylist={ data()!.studylist }
            words={ data()!.words }
        />,
    })

        
    return <Page title={ data()?.studylist.name }>

        <Searchbox/>
        <br/>

        <Solid.Show when={ data() }>

            <h1>
                <Framework.IconBook/>
                { " " }
                { data()!.studylist.name }
                <Solid.Show when={ data()!.userIsCreator }>
                    { " " }
                    <Framework.Button
                        title="Edit name"
                        label={ <Framework.IconPencil/> }
                        noBorder
                        onClick={ onRename }
                    />
                    <Framework.Button
                        title="Delete study list"
                        label={ <Framework.IconTrash/> }
                        noBorder
                        onClick={ onDelete }
                    />
                </Solid.Show>
            </h1>

            <Framework.HorizontalBar/>
            <br/>

            <div>
                Created by
                { " " }
                <UserLink user={ data()!.user }/>
            </div>

            <SmallInfo>
                Created on
                { " " }
                { Framework.dateAndElapsedToStr(data()!.studylist.createDate ?? "") }
                <br/>
                Last activity on
                { " " }
                { Framework.dateAndElapsedToStr(data()!.studylist.modifyDate ?? "") }
            </SmallInfo>

            <br/>

            <Solid.Show when={ data()?.userIsCreator }>
                <Framework.Checkbox
                    label={ <>
                        Private
                        { " " }
                        <Solid.Show when={ !data()!.studylist.public }>
                            <Framework.IconLock color={ Framework.themeVar("iconBlueColor") }/>
                        </Solid.Show>
                    </> }
                    value={ () => !data()!.studylist.public }
                    onChange={ onTogglePublic }
                    style={{
                        color: !data()!.studylist.public ?
                            Framework.themeVar("iconBlueColor") :
                            undefined,
                    }}
                />
                <br/>
                <br/>
            </Solid.Show>

            <Framework.Button
                label="Export..."
                icon={ <Framework.IconDownload/> }
                onClick={ ev => exportPopup.open(ev.currentTarget) }
            />

            { exportPopup.rendered }

            <br/>
            <br/>

            <h2>
                Words — { data()?.studylist.wordCount }
            </h2>
            <Framework.HorizontalBar/>

            <div>
                <Framework.Select
                    label="Order"
                    value={ () => App.usePrefs().studylistWordOrdering }
                    onChange={ (value) => App.mergePrefs({ studylistWordOrdering: value }) }
                    options={ [
                        { label: "By date added", value: "date-added" },
                        { label: "By kana order", value: "kana" },
                    ]}
                />
                <Solid.Show when={ data()!.userIsCreator }>
                    <Framework.Button
                        icon={ <Framework.IconTrash/> }
                        label="Remove selected"
                        onClick={ onRemoveSelected }
                        disabled={ selected().size === 0 }
                    />
                </Solid.Show>
            </div>

            <br/>

            <WordTable>
                <Solid.For each={ !expanded() ?
                    wordsOrdered()?.slice(0, collapsedLength) :
                    wordsOrdered() }
                >
                { (word) =>
                    <>
                    <div>
                    <Solid.Show when={ data()!.userIsCreator }>
                        <Framework.Checkbox
                            initialValue={ selected().has(word.id) }
                            onChange={ (checked) => onSelectWord(word.id, checked) }
                        />
                    </Solid.Show>
                    </div>
                    <Framework.Button
                        href={ App.Pages.Search.urlForBaseReading(
                            word.entry!.headings[0].base,
                            word.entry!.headings[0].reading) }
                        noBorder
                        noPadding
                        style={{
                            width: "100%",
                            "padding-left": "0.25em",
                            "padding-right": "0.25em",
                            color: selected().has(word.id) ?
                                Framework.themeVar("focusOutlineColor") :
                                undefined,
                        }}
                    >
                        <HeadingLabel
                            heading={ word.entry!.headings[0] }
                        />
                    </Framework.Button>
                    <WordSense>
                        <WordPartOfSpeech>
                            { word.entry!.senses[0].pos
                                .map(pos => JmdictTags.nameForPartOfSpeechTag(pos))
                                .join(", ")
                            }
                        </WordPartOfSpeech>
                        { word.entry!.senses[0].gloss
                            .map(g => typeof g === "string" ? g : g.text)
                            .join("; ")
                        }
                    </WordSense>
                    <WordTableDivider/>
                    </>
                }
                </Solid.For>
            </WordTable>

            <Solid.Show when={ !expanded() && data()!.words.length > collapsedLength }>
                <ExpandSection>
                    <Framework.Link
                        label={ <>
                            <Framework.IconVerticalEllipsis/>
                            View all words
                        </> }
                        onClick={ () => setExpanded(true) }
                        noUnderline
                    />
                </ExpandSection>
            </Solid.Show>
            
        </Solid.Show>

    </Page>
}


const SmallInfo = styled.div`
    font-size: 0.8em;
    color: ${ Framework.themeVar("text3rdColor") };
    margin-top: 0.25em;
    margin-left: 1em;
`


const WordTable = styled.div`
    display: grid;
    grid-template: auto / auto fit-content(9em) 1fr;
    grid-column-gap: 0.25em;
    grid-row-gap: 0em;
    justify-items: start;
    align-items: center;
`


const WordSense = styled.div`
    font-size: 0.8em;
`


const WordPartOfSpeech = styled.span`
    display: inline-block;
    margin-right: 0.5em;
    font-size: 0.8em;
    color: ${ Framework.themeVar("iconGreenColor") };
`


const WordTableDivider = styled.hr`
    grid-column: 1 / -1;
    width: 100%;
    margin: 0;
    border: 0;
    border-bottom: 1px solid ${ Framework.themeVar("borderColor") };
`


const ExpandSection = styled.div`
    margin-top: 1em;
    color: ${ Framework.themeVar("text3rdColor") };
    font-style: italic;
`


export function ExportPopup(props: {
    studylist: App.Api.StudyList.Entry,
    words: StudyListWordEntry[],
})
{
    const prefs = App.usePrefs()

    const onExport = () => {
        const tsvText = StudylistExport.writeStudylistTsv(
            props.studylist,
            props.words)

        var element = document.createElement("a")
        element.style.display = "none"
        element.setAttribute("download", props.studylist.name + ".tsv")
        element.setAttribute(
            "href",
            `data:text/plain;charset=utf-8,${ encodeURIComponent(tsvText) }`)
    
        document.body.appendChild(element)
        element.click()
        document.body.removeChild(element)
    }

    return <ExportPopupLayout>
        <Framework.Checkbox
            label="Decorate with HTML/CSS"
            value={ () => App.usePrefs().studylistExportHtmlCss }
            onChange={ (value) => App.mergePrefs({ studylistExportHtmlCss: value }) }
        />

        <br/>

        <Framework.Checkbox
            label="Skip katakana-only words"
            value={ () => App.usePrefs().studylistExportSkipKatakana }
            onChange={ (value) => App.mergePrefs({ studylistExportSkipKatakana: value }) }
        />

        <br/>

        <Framework.Select
            label="Kanji spelling"
            value={ () => App.usePrefs().studylistExportKanjiLevel }
            onChange={ (value) => App.mergePrefs({ studylistExportKanjiLevel: value }) }
            options={ [
                { label: "Use common spelling, allow plain kana", value: "common" },
                //{ label: "Force kanji, allow up to jōyō", value: "jouyou" },
                { label: "Force kanji, allow up to uncommon", value: "uncommon" },
                { label: "Force kanji, allow up to rare", value: "rare" },
            ]}
        />

        <br/>
        <br/>

        <Framework.Button
            label="Export .tsv"
            icon={ <Framework.IconDownload/> }
            onClick={ onExport }
        />

    </ExportPopupLayout>
}


const ExportPopupLayout = styled.div`
    padding: 1em 0;
`