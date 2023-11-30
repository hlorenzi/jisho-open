import * as Solid from "solid-js"
import { styled } from "solid-styled-components"
import * as Framework from "../framework/index.ts"
import * as App from "../app.tsx"
import { Page } from "../components/Page.tsx"


export function PageStudylistJoin(props: Framework.RouteProps)
{
    const studylistId = Solid.createMemo(
        () => props.routeMatch()?.matches[App.Pages.StudylistEditorJoin.matchStudylistId] ?? "")

    const password = Solid.createMemo(
        () => props.routeMatch()?.matches[App.Pages.StudylistEditorJoin.matchPassword] ?? "")
    
    Solid.createResource(
        () => [studylistId(), password()],
        async ([studylistId, password]) => {

            await App.Api.studylistEditorJoin({
                studylistId,
                password,
            })

            window.alert("Successfully joined as an editor!")

            Framework.historyReplace(App.Pages.Studylist.urlWith(studylistId))
            return null
        })

    return <Page/>
}