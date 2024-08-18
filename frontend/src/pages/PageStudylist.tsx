import * as Solid from "solid-js"
import { styled } from "solid-styled-components"
import * as Framework from "../framework/index.ts"
import * as App from "../app.tsx"
import * as JmdictTags from "common/jmdict_tags.ts"
import * as Furigana from "common/furigana.ts"
import { Page } from "../components/Page.tsx"
import { Searchbox } from "../components/Searchbox.tsx"
import { UserIdLink, UserLink } from "../components/User.tsx"
import { HeadingLabel } from "../components/EntryWord.tsx"
import * as StudylistUtils from "./studylistUtils.ts"


const collapsedLength = 20





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

            const userIsEditor =
                !userIsCreator &&
                studylist.editorIds.some(id => id === authUser.id)

            const wordEntriesById = new Map<string, App.Api.Word.Entry>()
            entries.forEach(e => wordEntriesById.set(e.id, e))

            const words: StudylistUtils.StudyListWordEntry[] = studylist.words
                .map(w => {
                    const [wordId, wordSpelling] =
                        App.Api.StudyList.decodeWordEntry(w.id)

                    const entry = wordEntriesById.get(wordId)
                    let headingIndex: number | undefined = undefined

                    if (entry !== undefined &&
                        wordSpelling !== undefined)
                    {
                        const furigana = Furigana.decode(wordSpelling)
                        const base = Furigana.extractBase(furigana)
                        const reading = Furigana.extractReading(furigana)

                        headingIndex = entry.headings
                            .findIndex(h => h.base === base && h.reading === reading)
                    
                        if (headingIndex < 0)
                            headingIndex = undefined
                    }
                    
                    return {
                        ...w,
                        entry: wordEntriesById.get(wordId)!,
                        headingIndex,
                    }
                })
                .filter(w => !!w.entry)
                .reverse()

            const stats = StudylistUtils.getStudylistStats(
                studylist,
                words)

            return {
                authUser,
                user,
                userIsCreator,
                userIsEditor,
                studylist,
                words,
                stats,
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

    const popupBusy = Framework.makePopupBusy()

    const onRename = () => popupBusy.run(async () => {
        App.analyticsEvent("studylistRename")

        if (!await App.Api.studylistEditName(data()!.studylist))
            return
            
        Framework.historyReload()
    })

    const onDelete = () => popupBusy.run(async () => {
        App.analyticsEvent("studylistDelete")

        if (!await App.Api.studylistDelete(data()!.studylist))
            return
            
        Framework.historyPush(App.Pages.User.urlForUserId(data()!.user.id ?? ""))
    })

    const onTogglePublic = () => popupBusy.run(async () => {
        App.analyticsEvent("studylistTogglePublic")

        if (!await App.Api.studylistEditPublic(data()!.studylist))
            return
            
        Framework.historyReload()
    })

    const onClone = () => popupBusy.run(async () => {
        const message = data()?.userIsCreator ?
            `Clone this study list?` :
            `Clone this study list for yourself?`

        if (!window.confirm(message))
            return

        const res = await App.Api.studylistClone({
            studylistId: data()!.studylist.id,
        })

        Framework.historyPush(App.Pages.Studylist.urlWith(res.studylistId))
    })

    const onResignAsEditor = () => popupBusy.run(async () => {
        const message =
            `Resign as editor of this list?\n\n` +
            `You'll need an invite link to join again.`

        if (!window.confirm(message))
            return

        await App.Api.studylistEditorLeave({
            studylistId: data()!.studylist.id,
        })

        if (!data()!.studylist.public)
            Framework.historyPush("/")
        else
            Framework.historyReload()
    })

    const onSelectWord = async (wordId: string, wordSelected: boolean) => {
        const newSet = new Set<string>([...selected()])

        if (wordSelected)
            newSet.add(wordId)
        else
            newSet.delete(wordId)

        setSelected(newSet)
    }

    const onToggleSelectAll = () => {
        if (selected().size > 0)
        {
            setSelected(new Set<string>())
        }
        else
        {
            const newSet = new Set<string>()
            for (const word of data()!.words)
                newSet.add(word.id)

            setSelected(newSet)
        }
    }

    const onRemoveSelected = () => popupBusy.run(async () => {
        const message =
            `Remove the ${ selected().size } selected ` +
            Framework.formPlural(selected().size, "word", "s") +
            `?\n\n` +
            `Type in that number to confirm.`

        const answer = window.prompt(message, "")

        if (!answer ||
            answer !== selected().size.toString())
            return
            
        App.analyticsEvent("studylistRemoveWords")

        await App.Api.studylistWordRemoveMany({
            studylistId: data()!.studylist.id,
            wordIds: [...selected()],
        })

        setSelected(new Set<string>())
        Framework.historyReload()
    })

    const exportPopup = Framework.makePopupPageWide({
        childrenFn: () => <ExportPopup
            studylist={ data()!.studylist }
            words={ data()!.words }
        />,
    })

    const importPopup = Framework.makePopupPageWide({
        childrenFn: () => <ImportPopup
            studylist={ data()!.studylist }
            popup={ importPopup }
        />,
    })

    const editorsPopup = Framework.makePopupPageWide({
        childrenFn: () => <EditorsPopup
            studylist={ data()!.studylist }
            popup={ importPopup }
        />,
    })

        
    return <Page title={ data()?.studylist.name }>

        <Searchbox position="inline"/>
        <br/>

        { popupBusy.rendered }

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
                <br/>
                <br/>
                Total kanji count:
                { " " }
                { data()!.stats.kanjiCountJouyou + data()!.stats.kanjiCountOther }
                <br/>
                Jōyō kanji count:
                { " " }
                { data()!.stats.kanjiCountJouyou }
                { " " }
                ({ data()!.stats.kanjiPercentJouyou }%)
            </SmallInfo>

            <Solid.Show when={ data()?.userIsEditor }>
                <br/>
                <Framework.Button
                    icon={ <Framework.IconX/> }
                    label="Resign as Editor"
                    onClick={ onResignAsEditor }
                />
                <br/>
            </Solid.Show>

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

            <Solid.Show when={ data()?.userIsCreator }>
                <Framework.Button
                    icon={ <Framework.IconUser/> }
                    label="Editors..."
                    onClick={ ev => editorsPopup.open(ev.currentTarget) }
                />
                <br/>
                <br/>
            </Solid.Show>

            <Solid.Show when={ data()?.authUser.id }>
                <Framework.Button
                    icon={ <Framework.IconSparkles/> }
                    label="Clone"
                    onClick={ onClone }
                />
            </Solid.Show>

            <Solid.Show when={ data()?.userIsCreator || data()?.userIsEditor }>
                <Framework.Button
                    icon={ <Framework.IconUpload/> }
                    label="Import..."
                    onClick={ ev => importPopup.open(ev.currentTarget) }
                />
            </Solid.Show>

            <Framework.Button
                icon={ <Framework.IconDownload/> }
                label="Export..."
                onClick={ ev => exportPopup.open(ev.currentTarget) }
            />

            { exportPopup.rendered }
            { importPopup.rendered }
            { editorsPopup.rendered }

            <br/>
            <br/>

            <h2>
                Words — { data()?.studylist.wordCount }
            </h2>
            <Framework.HorizontalBar/>

            <Solid.Show when={
                (data()!.userIsCreator || data()!.userIsEditor) &&
                data()!.words.length === 0
            }>
                <HelpInfo>
                    Use the <Framework.IconBookmark color={ Framework.themeVar("iconGreenColor") }/> button
                    displayed alongside the results of a search to add words to this study list!<br/>
                    Alternatively, use the Import button above to add words listed in a file.
                </HelpInfo>
            </Solid.Show>

            <Solid.Show when={
                data()!.words.length !== 0
            }>
                <div>
                    <Framework.Select
                        label="Order"
                        value={ () => App.usePrefs().studylistWordOrdering }
                        onChange={ (value) => App.mergePrefs({ studylistWordOrdering: value }) }
                        options={ [
                            { label: "By date added", value: "date-added" },
                            { label: "By kana", value: "kana" },
                        ]}
                    />
                    <Solid.Show when={ data()!.userIsCreator }>
                        <br/>
                        <Framework.Button
                            icon={ selected().size > 0 ?
                                <Framework.IconX/> :
                                <Framework.IconCheckmark/>
                            }
                            label={ selected().size > 0 ?
                                "Select none" :
                                "Select all"
                            }
                            onClick={ onToggleSelectAll }
                        />
                        <Framework.Button
                            icon={ <Framework.IconTrash/> }
                            label="Remove selected"
                            onClick={ onRemoveSelected }
                            disabled={ selected().size === 0 }
                        />
                    </Solid.Show>
                </div>
                <br/>
            </Solid.Show>

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
                            word.entry!.headings[word.headingIndex ?? 0].base,
                            word.entry!.headings[word.headingIndex ?? 0].reading) }
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
                            heading={ word.entry!.headings[word.headingIndex ?? 0] }
                        />
                        <Solid.Show when={ word.headingIndex !== undefined }>
                            <Framework.IconPin
                                title="The exact spelling was manually chosen."
                                color={ Framework.themeVar("iconYellowColor") }
                            />
                        </Solid.Show>
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


const HelpInfo = styled.div`
    color: ${ Framework.themeVar("text3rdColor") };
    font-style: italic;
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
    words: StudylistUtils.StudyListWordEntry[],
})
{
    const onExport = () => {
        App.analyticsEvent("studylistExport")

        const tsvText = StudylistUtils.writeStudylistTsv(
            props.studylist,
            props.words)

        var element = document.createElement("a")
        element.style.display = "none"
        element.setAttribute("download", `${ props.studylist.name }.tsv`)
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
                { label: "Force kanji, allow up to jōyō", value: "jouyou" },
                { label: "Force kanji, allow up to uncommon", value: "uncommon" },
                { label: "Force kanji, allow up to rare", value: "rare" },
                { label: "Include all spellings", value: "all" },
            ]}
        />

        <br/>
        <br/>

        <Framework.Checkbox
            label="Include raw JSON data as a new column"
            value={ () => App.usePrefs().studylistExportJsonColumn }
            onChange={ (value) => App.mergePrefs({ studylistExportJsonColumn: value }) }
        />

        <br/>
        <br/>

        <Framework.Link
            label="🎴 Anki Import and Card Styling"
            href={ App.Pages.HelpAnki.url }
        />
        
        <br/>
        <br/>

        <Framework.Button
            label="Download .tsv"
            icon={ <Framework.IconDownload/> }
            onClick={ onExport }
        />

    </ExportPopupLayout>
}


const ExportPopupLayout = styled.div`
    padding: 1em 0;
`


function ImportPopup(props: {
    studylist: App.Api.StudyList.Entry,
    popup: Framework.PopupPageWideData,
})
{
    type ImportFormat =
        | "txt"
        | "txt2"
        | "tsv1w"
        | "tsv1w2r"
        | "tsv2w"
        | "tsv2w3r"
        | "csv1w"
        | "csv1w2r"
    

    const [importText, setImportText] =
        Solid.createSignal("")
    
    const [importFormat, setImportFormat] =
        Solid.createSignal<ImportFormat>("txt")
    

    const loadFile = (
        elem: HTMLInputElement,
        callback: (filename: string, contents: string) => void) =>
    {
        if (elem.files?.length !== 1)
            return
        
        let reader = new FileReader()
        reader.readAsText(elem.files[0])
        reader.onload = () => 
        {
            callback(elem.value, reader.result as string)
        }
    }


    const handleInputFile = (filename: string, contents: string) =>
    {
        App.analyticsEvent("studylistImportPreview")
        setImportText(contents)

        if (filename.endsWith(".txt"))
            setImportFormat("txt")
        else if (filename.endsWith(".tsv"))
            setImportFormat("tsv1w")
        else if (filename.endsWith(".csv"))
            setImportFormat("csv1w")
    }


    type ImportEntry = {
        base: string
        reading?: string
    }


    const importWords = Solid.createMemo<ImportEntry[]>(() =>
    {
        if (importText() === "")
            return []

        const lines = importText()
            .split("\n")
            .map(l => l.trim())
            .filter(l => !!l)

        try
        {
            if (importFormat() === "txt")
                return lines.map(l => ({ base: l.trim() }))

            else if (importFormat() === "txt2")
            {
                return lines.map(l => ({ base: l
                    .split(".")[0]
                    .split(",")[0]
                    .split(":")[0]
                    .split(";")[0]
                    .split("(")[0]
                    .split("[")[0]
                    .split("{")[0]
                    .split("．")[0]
                    .split("，")[0]
                    .split("（")[0]
                    .split("「")[0]
                    .split("『")[0]
                    .split("【")[0]
                    .split("〖")[0]
                    .split(" ")[0]
                    .split("\u3000")[0]
                    .split("\t")[0]
                    .trim()
                }))
            }

            else if (importFormat().startsWith("tsv"))
            {
                const rows = lines.map(l => l.split("\t").map(r => r.trim()))
                if (importFormat() === "tsv1w")
                    return rows.map(r => ({ base: r[0] || "" }))
                else if (importFormat() === "tsv2w")
                    return rows.map(r => ({ base: r[1] || "" }))
                else if (importFormat() === "tsv1w2r")
                    return rows.map(r => ({ base: r[0] || "", reading: r[1] || "" }))
                else if (importFormat() === "tsv2w3r")
                    return rows.map(r => ({ base: r[1] || "", reading: r[2] || "" }))
            }

            else if (importFormat().startsWith("csv"))
            {
                const rows = lines.map(l => l.split(",").map(r => r.trim()))
                if (importFormat() === "csv1w")
                    return rows.map(r => ({ base: r[0] || "" }))
                else if (importFormat() === "csv1w2r")
                    return rows.map(r => ({ base: r[0] || "", reading: r[1] || "" }))
            }
        }
        catch
        {

        }

        return []
    })


    const popupLongOper = Framework.makePopupLongOperation({
        title: "Importing words..."
    })


    const doImport = () => {
        popupLongOper.run(async (setProgress) =>
        {
            const words = importWords()

			try
			{
                await Framework.waitMs(500)
                App.analyticsEvent("studylistImport")

                const packLen = App.Api.StudylistWordImport.maxWords
                const failedWords = []
                for (let i = 0; i < words.length; i += packLen)
                {
                    const res = await App.Api.studylistWordImport({
                        studylistId: props.studylist.id,
                        attemptDeinflection: App.usePrefs().studylistImportAttemptDeinflection,
                        words: words.slice(i, i + packLen),
                    })

                    for (const failedIndex of res.failedWordIndices)
                        failedWords.push(i + failedIndex)

                    setProgress(i / words.length * 100)
                }

                setProgress(100)
                await Framework.waitMs(500)

                if (failedWords.length > 0)
                {
                    let text =
                        "" + failedWords.length + " word(s) (out of " + words.length + ") failed to be imported:\n"

                    for (const w of failedWords)
                    {
                        text += "#" + (w + 1) + ": " +
                            words[w].base +
                            (words[w].reading ? " 【" + words[w].reading + "】" : "") +
                            "\n"
                    }

                    console.error(text)
                    alert(text)
                }
                else
                {
                    alert("Successfully imported " + words.length + " word(s).")
                }
                
                props.popup.close()
                Framework.historyReload()
			}
			catch (e)
			{
                alert("There was an unexpected error while importing!")
                throw e
			}
        })
    }


    return <ImportPopupLayout>

            <input
                type="file"
                onChange={ (ev) => loadFile(ev.target, handleInputFile) }
            />

            <Solid.Show when={ importText() !== "" }>
                <br/>
                <br/>
                <Framework.Select<ImportFormat>
                    label="File format"
                    value={ importFormat }
                    onChange={ setImportFormat }
                    options={[
                        { value: "txt", label: ".txt (one word per line, full line match)" },
                        { value: "txt2", label: ".txt (one word per line, ignore after space/punctuation)" },
                        { value: "tsv1w", label: ".tsv (1st column word)" },
                        { value: "tsv1w2r", label: ".tsv (1st column word, 2nd column reading)" },
                        { value: "tsv2w", label: ".tsv (2nd column word)" },
                        { value: "tsv2w3r", label: ".tsv (2nd column word, 3rd column reading)" },
                        { value: "csv1w", label: ".csv (1st column word)" },
                        { value: "csv1w2r", label: ".csv (1st column word, 2nd column reading)" },
                ]}/>
            <br/>
            <br/>

            <h2>
                Import preview
                { " — " }
                { `${ importWords().length } word(s) found in total` }
            </h2>
            <div>
                Check that your words appear correctly:
            </div>
            <br/>

            <ImportWordGrid>
                <Solid.For each={ importWords().slice(0, 5) }>
                { (word) =>
                    <>
                        <ImportWordBase>
                            { word.base }
                        </ImportWordBase>
                        <ImportWordReading>
                            { !word.reading ? null :
                                "【" + word.reading + "】"
                            }
                        </ImportWordReading>
                    </>
                }
                </Solid.For>
            </ImportWordGrid>

            <br/>

            <Framework.Checkbox
                label="Attempt de-inflection"
                value={ () => App.usePrefs().studylistImportAttemptDeinflection }
                onChange={ (value) => App.mergePrefs({ studylistImportAttemptDeinflection: value }) }
            />

            <br/>
            <br/>

            <Framework.Button
                icon={ <Framework.IconUpload/> }
                label="Import"
                onClick={ doImport }
                disabled={ importText() === "" }
            />
        </Solid.Show>

        { popupLongOper.rendered }

    </ImportPopupLayout>
}


const ImportPopupLayout = styled.div`
    padding: 1em 0;
`


const ImportWordGrid = styled.div`
    display: grid;
    grid-template: auto / auto 1fr;
    grid-column-gap: 0.5em;
    grid-row-gap: 0.25em;
    justify-items: start;
    align-items: baseline;
    background-color: ${ Framework.themeVar("textStrongBkgColor") };
    border-radius: ${ Framework.themeVar("borderRadius") };
    padding: 0.5em;
    overflow-x: hidden;
`


const ImportWordBase = styled.div`
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 50%;
`


const ImportWordReading = styled.div`
    color: ${ Framework.themeVar("text2ndColor") };
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 50%;
`


function EditorsPopup(props: {
    studylist: App.Api.StudyList.Entry,
    popup: Framework.PopupPageWideData,
})
{
    const popupBusy = Framework.makePopupBusy()

    const [password, setPassword] =
        Solid.createSignal(props.studylist.editorPassword)

    const [editorIds, setEditorIds] =
        Solid.createSignal(props.studylist.editorIds)

    const onGeneratePassword = () => popupBusy.run(async () => {
        const password = Math.floor(Math.random() * 999_999_999_999)
            .toString()
            .padStart(3 * 4)

        await App.Api.studylistEdit({
            studylistId: props.studylist.id,
            edit: {
                type: "editorPassword",
                value: password,
            }
        })

        props.studylist.editorPassword = password
        setPassword(password)
    })

    const onRemovePassword = () => popupBusy.run(async () => {
        if (!window.confirm("Revoke this invite link?"))
            return

        await App.Api.studylistEdit({
            studylistId: props.studylist.id,
            edit: {
                type: "editorPassword",
                value: undefined,
            }
        })

        props.studylist.editorPassword = undefined
        setPassword(undefined)
    })

    const onRemoveAllEditors = () => popupBusy.run(async () => {
        const message =
            `Remove all ${ editorIds().length } editor(s)?\n\n` +
            `They can each join again through an invite link.\n\n` +
            `Type in that number to confirm.`

        const answer = window.prompt(message, "")
        
        if (!answer ||
            answer !== editorIds().length.toString())
            return

        const newEditorIds: string[] = []

        await App.Api.studylistEdit({
            studylistId: props.studylist.id,
            edit: {
                type: "editorIds",
                value: newEditorIds,
            }
        })

        props.studylist.editorIds = newEditorIds
        setEditorIds(newEditorIds)
    })

    const onRemoveEditor = (editorId: string) => popupBusy.run(async () => {
        if (!window.confirm("Remove this editor?\n\nThey can join again through an invite link."))
            return

        const newEditorIds = [...editorIds()]
            .filter(id => id !== editorId)

        await App.Api.studylistEdit({
            studylistId: props.studylist.id,
            edit: {
                type: "editorIds",
                value: newEditorIds,
            }
        })

        props.studylist.editorIds = newEditorIds
        setEditorIds(newEditorIds)
    })

    const makeInviteLink = () => {
        return window.location.protocol + "//" +
            window.location.host +
            App.Pages.StudylistEditorJoin.urlWith(
                props.studylist.id, password() ?? "")
    }

    return <EditorsPopupLayout>

        Other people can use an invite link to join as editors!<br/>
        Editors can add and remove words on your behalf.
        <br/>

        <Solid.Show when={ !password() }>
            <Framework.Button
                icon={ <Framework.IconSparkles/> }
                label="Generate invite link"
                onClick={ onGeneratePassword }
            />
        </Solid.Show>

        <Solid.Show when={ password() }>
            <Framework.InputText
                id="inviteLink"
                initialValue={ makeInviteLink() }
                disabled
                style={{ width: "100%" }}
            />

            <br/>
            
            <Framework.Button
                label="Copy invite link"
                onClick={ () => Framework.copyToClipboard(makeInviteLink()) }
            />
            
            <Framework.Button
                icon={ <Framework.IconTrash/> }
                label="Revoke"
                onClick={ onRemovePassword }
            />
        </Solid.Show>

        <Solid.Show when={ editorIds().length !== 0 }>
            <br/>
            <br/>

            <h2>Current Editors — { editorIds().length }</h2>
            <Framework.HorizontalBar/>

            <Framework.Button
                icon={ <Framework.IconX/> }
                label="Remove all editors"
                onClick={ onRemoveAllEditors }
            />
            <br/>

            <Solid.For each={ editorIds() }>
            { (editorId) =>
                <>
                <Framework.Button
                    icon={ <Framework.IconX/> }
                    title="Remove this editor"
                    onClick={ () => onRemoveEditor(editorId) }
                />
                <Solid.Suspense>
                    <UserIdLink
                        userId={ editorId }
                    />
                </Solid.Suspense>
                <br/>
                </>
            }
            </Solid.For>
        </Solid.Show>

        { popupBusy.rendered }

    </EditorsPopupLayout>
}


const EditorsPopupLayout = styled.div`
    padding: 1em 0;
`