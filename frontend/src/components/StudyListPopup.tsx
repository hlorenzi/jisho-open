import * as Solid from "solid-js"
import { styled } from "solid-styled-components"
import * as Framework from "../framework/index.ts"
import * as Api from "../api.ts"


export function StudyListPopup(props: {
    wordId: string,
    close?: () => void,
})
{
    const [studyLists] = Framework.createAsyncSignal(
        () => props.wordId,
        async (wordId) => {
            const authUser = await Api.authenticate()
            if (!authUser.id)
                return { studylists: [] } satisfies Api.StudylistGetAll.Response

            const studyLists = await Api.studylistGetAll({
                userId: authUser.id,
                markWordId: wordId,
            })

            return studyLists
        })


    const [adding, setAdding] = Solid.createSignal(false)


    const onClickList = async (studyListId: string, remove: boolean) => {
        setAdding(true)
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
            }
            else
            {
                await Api.studylistWordAdd({
                    studylistId: studyListId,
                    wordId: props.wordId,
                })
            }
        }
        finally
        {
            props.close?.()
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

        <Solid.Show when={ studyLists().loading || adding() }>
            <Framework.LoadingBar/>
        </Solid.Show>

        <Solid.Show when={ studyLists().latest }>
            <Framework.ScrollVerticalPopupPageWide
                height="10.5em"
                heightMobile="12em"
            >
                <Solid.For each={ studyLists().latest?.studylists }>
                { (list) =>
                    <Framework.ButtonPopupPageWide
                        label={ <>
                            { `📚 ${ list.name }` }
                            <Solid.Show when={ list.marked }>
                                <Framework.IconCheckmark
                                    color={ Framework.themeVar("iconGreenColor") }
                                />
                            </Solid.Show>
                            { /*!foldersWithWordSet.has(list.folderName) ? null :
                                <Framework.IconFolderCheckmark
                                    color={ theme.iconWarningColor }
                                />*/
                            }
                        </>}
                        onClick={ () => onClickList(list.id, !!list.marked) }
                        disabled={ adding() }
                    />
                }
                </Solid.For>
            </Framework.ScrollVerticalPopupPageWide>
        </Solid.Show>
    </>
}