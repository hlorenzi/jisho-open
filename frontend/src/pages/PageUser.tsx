import * as Solid from "solid-js"
import { styled } from "solid-styled-components"
import * as Framework from "../framework/index.ts"
import * as App from "../app.tsx"
import { Page } from "../components/Page.tsx"
import { Searchbox } from "../components/Searchbox.tsx"
import { UserLabel } from "../components/User.tsx"


type StudyListOrFolder = App.Api.StudyList.Entry & {
    children?: App.Api.StudyList.Entry[]
}


export function PageUser(props: Framework.RouteProps)
{
    const userId = Solid.createMemo(
        () => props.routeMatch()?.matches[App.Pages.User.matchUserId] ?? "")

    const [data] = Solid.createResource(
        userId,
        async (userId) => {
            const authUser = await App.Api.authenticate()
            const { user } = await App.Api.getUser({ userId })
            const userIsSelf = authUser.id === userId
            const { studylists } = await App.Api.studylistGetAll({ userId })

            const studylistsToplevel: StudyListOrFolder[] = []
            for (const list of studylists)
            {
                const [folderName, listName] = App.Api.StudyList.getFolderName(list)
                if (!folderName)
                {
                    list.selfName = list.name
                    studylistsToplevel.push(list)
                    continue
                }

                list.folderName = folderName
                list.selfName = listName

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

            return {
                authUser,
                user,
                userIsSelf,
                studylistsToplevel,
            }
        })

    const listsOrdered = Solid.createMemo(() => {
        let lists = data()?.studylistsToplevel
        if (!lists)
            return undefined

        if (App.usePrefs().studylistOrdering === "name")
        {
            lists = [...lists.map(l => ({ ...l }))]
                .sort((a, b) => a.name.localeCompare(b.name))
            
            for (const list of lists)
            {
                if (list.children === undefined)
                    continue

                list.children = [...list.children]
                    .sort((a, b) => a.name.localeCompare(b.name))
            }
        }

        return lists
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
        App.analyticsEvent("studylistCreate")
        
        const res = await App.Api.studylistCreate()
        if (!res)
            return

        Framework.historyPush(App.Pages.Studylist.urlWith(res.studylistId))
    }

    const onDelete = async () => {

    }

    return <Page title={ data()?.user.name }>

        <Searchbox position="inline"/>
        <br/>

        <Solid.Show when={ data() }>

            <h1>
                <UserLabel user={ data()?.user }/>
                <Solid.Show when={ data()?.userIsSelf }>
                    { " " }
                    <Framework.Button
                        title="User settings"
                        label={ <Framework.IconPencil/> }
                        noBorder
                        href={ App.Api.Account.url }
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

            <div>
                <Framework.Select
                    label="Order"
                    value={ () => App.usePrefs().studylistOrdering }
                    onChange={ (value) => App.mergePrefs({ studylistOrdering: value }) }
                    options={ [
                        { label: "By recent activity", value: "activity" },
                        { label: "By name", value: "name" },
                    ]}
                />
                <Solid.Show when={ data()?.userIsSelf }>
                    <Framework.Button
                        label={ <><Framework.IconPlus/> Create</> }
                        accent
                        onClick={ onCreate }
                    />
                </Solid.Show>
            </div>

            <br/>

            <ListLayout>
                <Solid.For
                    each={ listsOrdered() }
                    fallback={ <Framework.Button disabled noBorder>Empty</Framework.Button> }
                >
                { (listOrFolder) =>
                    !listOrFolder.children ?
                        <Studylist
                            userId={ data()?.user.id }
                            studylist={ listOrFolder }
                            userIsSelf={ !!data()?.userIsSelf }
                            onDelete={ onDelete }
                        />
                        :
                        <Folder
                            userId={ data()?.user.id }
                            folder={ listOrFolder }
                            expandedFolders={ expandedFolders() }
                            onToggleFolder={ onToggleFolder }
                            userIsSelf={ !!data()?.userIsSelf }
                            onDelete={ onDelete }
                        />
                }
                </Solid.For>
            </ListLayout>
        </Solid.Show>
    </Page>
}


const ListLayout = styled.div`
    background-color: ${ Framework.themeVar("textStrongBkgColor") };
    border-radius: ${ Framework.themeVar("borderRadius") };
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
    userId?: string,
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
                    { Framework.dateElapsedToStr(props.folder.modifyDate) } ago
                </SmallInfo>
            </Framework.Button>
        </div>
        
        <Solid.Show when={ props.expandedFolders.has(props.folder.name) }>
            <FolderLevel>
                <Solid.For each={ props.folder.children }>
                    { (list) =>
                        <Studylist
                            userId={ props.userId }
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
    userId?: string,
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
            href={ App.Pages.Studylist.urlWith(props.studylist.id) }
        >
            <Framework.IconBook/>
            { " " }
            { props.studylist.selfName }
            <Solid.Show when={ !props.studylist.public }>
                { " " }
                <Framework.IconLock
                    title="Private"
                    color={ Framework.themeVar("iconBlueColor") }
                />
            </Solid.Show>
            <Solid.Show when={ props.studylist.creatorId !== props.userId }>
                { " " }
                <Framework.IconUser
                    title="You're an editor"
                    color={ Framework.themeVar("iconYellowColor") }
                />
            </Solid.Show>

            <SmallInfo>
                { props.studylist.wordCount }
                { " " }
                { Framework.formPlural(props.studylist.wordCount, "word", "s") }
            </SmallInfo>
            <SmallInfo>
                { Framework.dateElapsedToStr(props.studylist.modifyDate) } ago
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