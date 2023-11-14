import * as Solid from "solid-js"
import { styled } from "solid-styled-components"
import * as Framework from "../framework/index.ts"
import * as Api from "common/api/index.ts"
import * as Pages from "../pages.ts"


export function UserLabel(props: {
    user?: Api.MaybeUser,
})
{
    return <>
        <Framework.IconUser/>
        { " " }
        { props.user?.name }
        <Solid.Show when={ props.user?.tags?.some(tag => tag === "admin") }>
            <Framework.TextTag
                label="Admin"
            />
        </Solid.Show>
    </>
}


export function UserLink(props: {
    user?: Api.MaybeUser,
})
{
    return <Framework.Link
        href={ Pages.User.urlForUserId(props.user?.id ?? "") }
    >
        <UserLabel user={ props.user }/>
    </Framework.Link>
}