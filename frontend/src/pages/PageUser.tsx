import * as Solid from "solid-js"
import { styled } from "solid-styled-components"
import * as Framework from "../framework/index.ts"
import * as Api from "../api.ts"
import * as Pages from "../pages.ts"
import { Page } from "../components/Page.tsx"
import { Searchbox } from "../components/Searchbox.tsx"
import { UserLabel } from "../components/User.tsx"


type StudyListOrFolder = Api.StudyList.Entry & {
    children?: Api.StudyList.Entry[]
}


export function PageUser(props: Framework.RouteProps)
{
    const userId = Solid.createMemo(
        () => props.routeMatch()?.matches[Pages.User.matchUserId] ?? "")

    const [data] = Solid.createResource(
        userId,
        async (userId) => {
            const authUser = await Api.authenticate()
            const { user } = await Api.getUser({ userId })
            const userIsSelf = authUser.id === userId
            const { studylists } = await Api.studylistGetAll({ userId })

            const studylistsToplevel: StudyListOrFolder[] = []
            for (const list of studylists)
            {
                const [folderName, listName] = Api.StudyList.getFolderName(list)
                if (!folderName)
                {
                    studylistsToplevel.push(list)
                    continue
                }

                list.folderName = folderName
                list.name = listName

                let toplevelFolder = studylistsToplevel
                    .find(f => f.children && f.name == list.folderName)
                
                if (!toplevelFolder)
                {
                    toplevelFolder = {
                        ...list,
                        name: list.folderName,
                        children: [],
                    }
                    studylistsToplevel.push(toplevelFolder)
                }

                toplevelFolder.modifyDate = Framework.dateMax(
                    toplevelFolder.modifyDate,
                    list.modifyDate)
                
                toplevelFolder.children!.push(list)
            }

            /*if (app.prefs.listOrdering == "name")
            {
                toplevel.sort((a, b) => a.name.localeCompare(b.name))
                for (const folder of toplevel)
                {
                    if (folder.isFolder)
                        folder.children.sort((a, b) => a.name.localeCompare(b.name))
                }
            }*/

            return {
                authUser,
                user,
                userIsSelf,
                studylistsToplevel,
            }
        })

    const [expandedFolders, setExpandedFolders] =
        Framework.createHistorySignal("expandedFolders", new Set<string>())

    const onToggleFolder = (folderName: string) => {
        const newSet = new Set<string>([...expandedFolders()])

        if (expandedFolders().has(folderName))
        {
            newSet.delete(folderName)
            setExpandedFolders(newSet)
        }
        else
        {
            newSet.add(folderName)
            setExpandedFolders(newSet)
        }
    }

    const onCreate = async () => {
        const res = await Api.studylistCreate()
        if (!res)
            return

        Framework.historyPush(Pages.Studylist.urlWith(res.studylistId))
    }

    const onDelete = async (studylist: StudyListOrFolder) => {

    }

    return <Page title={ data()?.user.name }>

        <Searchbox/>
        <br/>

        <h1>
            <UserLabel user={ data()?.user }/>
            <Solid.Show when={ data()?.userIsSelf }>
                { " " }
                <Framework.Button
                    title="User settings"
                    label={ <Framework.IconPencil/> }
                    noBorder
                    href={ Api.Account.url }
                    native
                />
            </Solid.Show>
        </h1>

        <Framework.HorizontalBar/>
        <br/>

        <h2>
            <Framework.IconBook/>
            { " " }
            <Solid.Show when={ data()?.userIsSelf }>
                My study lists
            </Solid.Show>
            <Solid.Show when={ data()?.userIsSelf === false }>
                Public study lists
            </Solid.Show>
        </h2>

        <br/>

        <Solid.Show when={ data()?.userIsSelf }>
            <Framework.Button
                label={ <><Framework.IconPlus/> Create</> }
                accent
                onClick={ onCreate }
            />
            <br/>
            <br/>
        </Solid.Show>

        <ListLayout>
            <Solid.For
                each={ data()?.studylistsToplevel }
                fallback={ <Framework.Button disabled noBorder>Empty</Framework.Button> }
            >
            { (listOrFolder) =>
                !listOrFolder.children ?
                    <Studylist
                        studylist={ listOrFolder }
                        userIsSelf={ !!data()?.userIsSelf }
                        onDelete={ onDelete }
                    />
                    :
                    <Folder
                        folder={ listOrFolder }
                        expandedFolders={ expandedFolders() }
                        onToggleFolder={ onToggleFolder }
                        userIsSelf={ !!data()?.userIsSelf }
                        onDelete={ onDelete }
                    />
            }
            </Solid.For>
        </ListLayout>
    </Page>
}


const ListLayout = styled.div`
    background-color: ${ Framework.themeVar("textStrongBkgColor") };
    border-radius: 0.25rem;
    display: grid;
    grid-template: auto / auto;
    width: 100%;
    align-items: center;
    justify-items: start;
    grid-column-gap: 0.25em;
`


const FolderLevel = styled.div`
    margin-left: 1.4em;
    border-left: 2px solid ${ Framework.themeVar("borderColor") };
    padding-left: 1em;
`


function Folder(props: {
    folder: StudyListOrFolder,
    expandedFolders: Set<string>,
    onToggleFolder: (folderName: string) => void,
    userIsSelf: boolean,
    onDelete: (studylist: StudyListOrFolder) => Promise<void>,
})
{
    return <>
        <div>
            <Framework.Button
                noBorder
                onClick={ () => props.onToggleFolder(props.folder.name) }
            >
                { props.expandedFolders.has(props.folder.name) ?
                    <Framework.IconFolderOpen color={ Framework.themeVar("iconYellowColor") }/> :
                    <Framework.IconFolder color={ Framework.themeVar("iconYellowColor") }/>
                }
                { " " }
                { props.folder.name }
                { " " }

                <SmallInfo>
                    { props.folder.children?.length }
                    { " " }
                    { Framework.formPlural(props.folder.children?.length ?? 0, "list", "s") }
                </SmallInfo>

                <SmallInfo>
                    { Framework.dateElapsedToStr(props.folder.modifyDate) }
                </SmallInfo>
            </Framework.Button>
        </div>
        
        <Solid.Show when={ props.expandedFolders.has(props.folder.name) }>
            <FolderLevel>
                <Solid.For each={ props.folder.children }>
                    { (list) =>
                        <Studylist
                            studylist={ list }
                            userIsSelf={ props.userIsSelf }
                            onDelete={ props.onDelete }
                        />
                    }
                </Solid.For>
            </FolderLevel>
        </Solid.Show>
    </>
}


function Studylist(props: {
    studylist: StudyListOrFolder,
    userIsSelf: boolean,
    onDelete: (studylist: StudyListOrFolder) => Promise<void>,
})
{
    return <div>
        { /*<Solid.Show when={ props.userIsSelf }>
            <Framework.Button
                title="Delete list"
                label={ <Framework.IconTrash/> }
                noBorder
                onClick={ () => props.onDelete(props.studylist) }
            />
        </Solid.Show>*/ }

        <Framework.Button
            noBorder
            href={ Pages.Studylist.urlWith(props.studylist.id) }
        >
            <Framework.IconBook/>
            { " " }
            { props.studylist.name }
            <Solid.Show when={ !props.studylist.public }>
                { " " }
                <Framework.IconLock color={ Framework.themeVar("iconBlueColor") }/>
            </Solid.Show>

            <SmallInfo>
                { props.studylist.wordCount }
                { " " }
                { Framework.formPlural(props.studylist.wordCount, "word", "s") }
            </SmallInfo>
            <SmallInfo>
                { Framework.dateElapsedToStr(props.studylist.modifyDate) }
            </SmallInfo>
        </Framework.Button>
    </div>
}


const SmallInfo = styled.span`
    display: inline-block;
    margin-left: 0.75em;
    color: ${ Framework.themeVar("text3rdColor") };
    font-size: 0.8em;
`