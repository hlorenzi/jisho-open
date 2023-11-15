import * as Solid from "solid-js"
import * as Framework from "../framework/index.ts"
import * as Api from "common/api/index.ts"


export function PageLoginFake(props: Framework.RouteProps)
{
    const fakeUserId = window.prompt(
        "Fake your login with what ID?",
        "user1")

    const redirectUrl = props.routeMatch()?.query.redirect ?? "/"
    
    if (!fakeUserId)
    {
        window.location.assign(redirectUrl)
        return <></>
    }

    window.location.assign(
        Api.Login.urlFakeForUserId(fakeUserId, redirectUrl))
    
    return <></>
}