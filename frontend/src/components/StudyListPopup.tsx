import * as Solid from "solid-js"
import { styled } from "solid-styled-components"
import * as Framework from "../framework/index.ts"
import * as App from "../app.tsx"


export function StudyListPopup(props: {
    wordId: string,
    onFinished?: () => void,
})
{
    const data = Framework.createAsyncSignal(
        () => props.wordId,
        async (wordId) => {
            const authUser = await App.Api.authenticate()
            if (!authUser.id)
                return {
                    authUser,
                    studylists: [] as App.Api.StudyList.Entry[],
                    foldersWithWord: new Set<string>(),
                    presentInCount: 0,
                }

            const studylistsRes = await App.Api.studylistGetAllMarked({
                markWordId: wordId,
            })

            const studylists = studylistsRes.studylists
            studylists.forEach(s => {
                const [folderName, selfName] = App.Api.StudyList.getFolderName(s)
                s.folderName = folderName
                s.selfName = selfName
            })

            const foldersWithWord = new Set<string>()
            for (const studylist of studylists)
            {
                if (!studylist.folderName)
                    continue

                if (studylist.marked !== undefined)
                    foldersWithWord.add(studylist.folderName)
            }

            let presentInCount = 0
            for (const studylist of studylists)
            {
                if (studylist.marked !== undefined)
                    presentInCount += 1
            }

            return {
                authUser,
                studylists,
                foldersWithWord,
                presentInCount,
            }
        })


    const [working, setWorking] = Solid.createSignal(false)


    const onAddOrRemove = async (studyListId: string, remove: boolean) => {
        setWorking(true)
        try
        {
            if (remove)
            {
                if (!window.confirm("Remove this word from the list?"))
                    return

                App.analyticsEvent("studylistPopupRemove")

                await App.Api.studylistWordRemoveMany({
                    studylistId: studyListId,
                    wordIds: [props.wordId],
                })
                props.onFinished?.()
            }
            else
            {
                App.analyticsEvent(
                    props.wordId.includes(";") ?
                        "studylistPopupAddSpelling" :
                        "studylistPopupAdd")

                await App.Api.studylistWordAdd({
                    studylistId: studyListId,
                    wordId: props.wordId,
                })
                props.onFinished?.()
            }
        }
        finally
        {
            setWorking(false)
        }
    }

    const onCreateAndAdd = async () => {
        setWorking(true)
        try
        {
            App.analyticsEvent("studylistPopupCreateAndAdd")
            
            if (!await App.Api.studylistCreateAndAddWord(props.wordId))
                return
            
            props.onFinished?.()
        }
        finally
        {
            setWorking(false)
        }
    }


    return <>
        <div style={{
            "font-weight": "bold",
            margin: "0.25em 0",
        }}>
            Add this word to a study list
            <Solid.Show when={ data().latest && data().latest!.presentInCount !== 0 }>
                { " " }
                <span style={{ color: Framework.themeVar("iconGreenColor") }}>
                    (<Framework.IconCheckmark
                        color={ Framework.themeVar("iconGreenColor") }
                    />
                    { data().latest!.presentInCount })
                </span>
            </Solid.Show>
        </div>
        <Framework.HorizontalBar/>

        <Solid.Show when={ data().loading }>
            <Framework.LoadingBar/>
        </Solid.Show>

        <Solid.Show when={ data().latest && !data().latest?.authUser.id }>
            <Framework.ButtonPopupPageWide
                label="Log in to create study lists!"
                href={ App.Api.Login.urlForRedirect(window.location.href) }
                native
            />
        </Solid.Show>

        <Solid.Show when={ data().latest?.authUser.id }>

            <Solid.Show when={ working() }>
                <Framework.LoadingBar ignoreLayout/>
            </Solid.Show>

            <Solid.Show when={ data().latest }>
                <Framework.ScrollVerticalPopupPageWide
                    height="9.4em"
                    heightMobile="10em"
                >
                    <Solid.For each={ data().latest?.studylists }>
                    { (list) =>
                        <Framework.ButtonPopupPageWide
                            label={ <span
                                    style={{ color: list.marked === "exact" ? Framework.themeVar("iconGreenColor") : undefined }}
                                >
                                    <Framework.IconBook/>
                                    { ` ${ list.name }` }
                                    <Solid.Show when={ !list.public }>
                                        <Framework.IconLock
                                            title="This list is private."
                                            color={ Framework.themeVar("iconBlueColor") }
                                        />
                                    </Solid.Show>
                                    <Solid.Show when={ list.marked === "exact" }>
                                        <Framework.IconCheckmark
                                            title="Already present in this list."
                                            color={ Framework.themeVar("iconGreenColor") }
                                        />
                                    </Solid.Show>
                                    <Solid.Show when={ list.marked === "spelling" }>
                                        <Framework.IconPin
                                            title="Already present in this list with another spelling."
                                            color={ Framework.themeVar("iconYellowColor") }
                                        />
                                    </Solid.Show>
                                    <Solid.Show when={ data().latest!.foldersWithWord.has(list.folderName ?? "") }>
                                        <Framework.IconFolderCheckmark
                                            title="Already present in another list in the same folder."
                                            color={ Framework.themeVar("iconYellowColor") }
                                        />
                                    </Solid.Show>
                                </span>
                            }
                            onClick={ () => onAddOrRemove(list.id, list.marked === "exact") }
                            disabled={ working() }
                        />
                    }
                    </Solid.For>
                </Framework.ScrollVerticalPopupPageWide>

                <Framework.HorizontalBar/>

                <Framework.ButtonPopupPageWide
                    label={ <>
                        <Framework.IconPlus/> Create new list and add
                    </> }
                    disabled={ working() }
                    onClick={ onCreateAndAdd }
                />

                <Framework.ButtonPopupPageWide
                    label={ <>
                        View your lists
                    </> }
                    disabled={ working() }
                    href={ App.Pages.User.urlForUserId(data().latest!.authUser.id!) }
                />
            </Solid.Show>
        </Solid.Show>
    </>
}