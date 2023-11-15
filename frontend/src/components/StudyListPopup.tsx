import * as Solid from "solid-js"
import { styled } from "solid-styled-components"
import * as Framework from "../framework/index.ts"
import * as Api from "../api.ts"


export function StudyListPopup(props: {
    wordId: string,
    close?: () => void,
})
{
    const [data] = Framework.createAsyncSignal(
        () => props.wordId,
        async (wordId) => {
            const authUser = await Api.authenticate()
            if (!authUser.id)
                return {
                    authUser,
                    studylists: [] as Api.StudyList.Entry[],
                    foldersWithWord: new Set<string>(),
                }

            const studylistsRes = await Api.studylistGetAllMarked({
                markWordId: wordId,
            })

            const studylists = studylistsRes.studylists
            studylists.forEach(s => {
                const [folderName, selfName] = Api.StudyList.getFolderName(s)
                s.folderName = folderName
                s.selfName = selfName
            })

            const foldersWithWord = new Set<string>()
            for (const studylist of studylists)
            {
                if (!studylist.folderName)
                    continue

                if (studylist.marked)
                    foldersWithWord.add(studylist.folderName)
            }

            return {
                authUser,
                studylists,
                foldersWithWord,
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

                await Api.studylistWordRemoveMany({
                    studylistId: studyListId,
                    wordIds: [props.wordId],
                })
                props.close?.()
            }
            else
            {
                await Api.studylistWordAdd({
                    studylistId: studyListId,
                    wordId: props.wordId,
                })
                props.close?.()
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
            if (!await Api.studylistCreateAndAddWord(props.wordId))
                return
            
            props.close?.()
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
        </div>

        <Framework.HorizontalBar/>

        <Solid.Show when={ data().loading }>
            <Framework.LoadingBar/>
        </Solid.Show>

        <Solid.Show when={ data().latest && !data().latest?.authUser.id }>
            <Framework.ButtonPopupPageWide
                label="Log in to create study lists!"
                href={ Api.Login.urlForRedirect(window.location.href) }
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
                                    style={{ color: list.marked ? Framework.themeVar("iconGreenColor") : undefined }}
                                >
                                    <Framework.IconBook/>
                                    { ` ${ list.name }` }
                                    <Solid.Show when={ list.marked }>
                                        <Framework.IconCheckmark
                                            color={ Framework.themeVar("iconGreenColor") }
                                        />
                                    </Solid.Show>
                                    <Solid.Show when={ data().latest!.foldersWithWord.has(list.folderName ?? "") }>
                                        <Framework.IconFolderCheckmark
                                            color={ Framework.themeVar("iconYellowColor") }
                                        />
                                    </Solid.Show>
                                </span>
                            }
                            onClick={ () => onAddOrRemove(list.id, !!list.marked) }
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
            </Solid.Show>
        </Solid.Show>
    </>
}