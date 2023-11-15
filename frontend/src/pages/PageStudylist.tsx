import * as Solid from "solid-js"
import { styled } from "solid-styled-components"
import * as Framework from "../framework/index.ts"
import * as Api from "../api.ts"
import * as Pages from "../pages.ts"
import { Page } from "../components/Page.tsx"
import { Searchbox } from "../components/Searchbox.tsx"
import { UserLink } from "../components/User.tsx"


export function PageStudylist(props: Framework.RouteProps)
{
    const studylistId = Solid.createMemo(
        () => props.routeMatch()?.matches[Pages.Studylist.matchStudylistId] ?? "")

    const [data] = Solid.createResource(
        studylistId,
        async (studylistId) => {
            const authUser = await Api.authenticate()
            const { studylist } = await Api.studylistGet({ studylistId })
            const { entries } = await Api.studylistWordsGet({ studylistId })
            const { user } = await Api.getUser({ userId: studylist.creatorId })
            const userIsCreator =
                authUser.id === user.id ||
                authUser.tags?.some(tag => tag === "admin")

            const wordEntriesById = new Map<string, Api.Word.Entry>()
            entries.forEach(e => wordEntriesById.set(e.id, e))

            const words = studylist.words
                .map(w => ({ ...w, entry: wordEntriesById.get(w.id) }))

            return {
                authUser,
                user,
                userIsCreator,
                studylist,
                words,
            }
        })

    const onRename = async () => {
        if (!await Api.studylistEditName(data()!.studylist))
            return
            
        Framework.historyReload()
    }

    const onDelete = async () => {
        if (!await Api.studylistDelete(data()!.studylist))
            return
            
        Framework.historyPush(Pages.User.urlForUserId(data()!.user.id ?? ""))
    }

    const onTogglePublic = async () => {
        if (!await Api.studylistEditPublic(data()!.studylist))
            return
            
        Framework.historyReload()
    }

        
    return <Page title={ data()?.studylist.name }>

        <Searchbox/>
        <br/>

        <Solid.Show when={ data() }>

            <h1>
                <Framework.IconBook/>
                { " " }
                { data()?.studylist.name }
                <Solid.Show when={ data()?.userIsCreator }>
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
                <UserLink user={ data()?.user }/>
            </div>

            <SmallInfo>
                Created on
                { " " }
                { Framework.dateAndElapsedToStr(data()?.studylist.createDate ?? "") }
                <br/>
                Last activity on
                { " " }
                { Framework.dateAndElapsedToStr(data()?.studylist.modifyDate ?? "") }
            </SmallInfo>

            <br/>

            <Solid.Show when={ data()?.userIsCreator }>
                <Framework.Checkbox
                    label={ <>
                        Private
                        { " " }
                        <Solid.Show when={ !data()?.studylist.public }>
                            <Framework.IconLock color={ Framework.themeVar("iconBlueColor") }/>
                        </Solid.Show>
                    </> }
                    value={ () => !data()?.studylist.public }
                    onChange={ onTogglePublic }
                    style={{
                        color: !data()?.studylist.public ?
                            Framework.themeVar("iconBlueColor") :
                            undefined,
                    }}
                />
                <br/>
                <br/>
            </Solid.Show>

            <br/>

            <h2>
                Words — { data()?.studylist.wordCount }
            </h2>
            <Framework.HorizontalBar/>

            <Solid.For each={ data()?.words.reverse() }>
            { (word) =>
                <div>
                    { word.entry?.headings[0].base } /
                    { word.entry?.headings[0].reading } /
                    { word.entry?.senses[0].gloss.join("; ") }
                </div>
            }
            </Solid.For>
            
        </Solid.Show>

    </Page>
}


const SmallInfo = styled.div`
    font-size: 0.8em;
    color: ${ Framework.themeVar("text3rdColor") };
    margin-top: 0.25em;
    margin-left: 1em;
`