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
            const { user } = await Api.getUser({ userId: studylist.creatorId })
            const userIsSelf = authUser.id === user.id

            return {
                authUser,
                user,
                userIsSelf,
                studylist,
            }
        })

        
    return <Page title={ data()?.studylist.name }>

        <Searchbox/>
        <br/>

        <h1>
            <Framework.IconBook/>
            { " " }
            { data()?.studylist.name }
            <Solid.Show when={ data()?.userIsSelf }>
                { " " }
                <Framework.Button
                    title="Edit name"
                    label={ <Framework.IconPencil/> }
                    noBorder
                />
                <Framework.Button
                    title="Delete study list"
                    label={ <Framework.IconTrash/> }
                    noBorder
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

        <br/>

        <div>
            Created on
            { " " }
            { Framework.dateAndElapsedToStr(data()?.studylist.createDate ?? "") }
        </div>
        <div>
            Last activity on
            { " " }
            { Framework.dateAndElapsedToStr(data()?.studylist.modifyDate ?? "") }
        </div>

    </Page>
}