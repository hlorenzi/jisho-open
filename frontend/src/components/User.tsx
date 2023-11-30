import * as Solid from "solid-js"
import { styled } from "solid-styled-components"
import * as Framework from "../framework/index.ts"
import * as App from "../app.tsx"
import * as Pages from "../pages.ts"


export function UserLink(props: {
    user?: App.Api.MaybeUser,
})
{
    return <Framework.Link
        href={ Pages.User.urlForUserId(props.user?.id ?? "") }
    >
        <UserLabel user={ props.user }/>
    </Framework.Link>
}


export function UserIdLink(props: {
    userId: string,
})
{
    const user = Framework.createAsyncSignal(
        () => props.userId,
        async (userId) => {
            const user = await App.Api.getUser({ userId })
            return user.user
        })


    return <Solid.Show
        when={ !user().loading }
        fallback={ <>...</> }
    >
        <UserLink user={ user().latest }/>
    </Solid.Show>
}


export function UserLabel(props: {
    user?: App.Api.MaybeUser,
})
{
    const isSystem = App.Api.userIsSystem(props.user ?? {})
    const isAdmin = App.Api.userIsAdmin(props.user ?? {})
    const isVip = App.Api.userIsVip(props.user ?? {})

    return <span>
        <Framework.IconUser/>
        { props.user?.name }
        <Solid.Show when={ isSystem }>
            <UserLabelSup>
                <Framework.TextTag
                    label="System"
                    bkgColor={ Framework.themeVar("focusOutlineColor") }
                />
            </UserLabelSup>
        </Solid.Show>
        <Solid.Show when={ isAdmin }>
            <UserLabelSup>
                <Framework.TextTag
                    label="Admin"
                    bkgColor={ Framework.themeVar("iconBlueColor") }
                />
            </UserLabelSup>
        </Solid.Show>
        <Solid.Show when={ isVip }>
            <UserLabelSup>
                <Framework.TextTag
                    label="VIP"
                    bkgColor={ Framework.themeVar("iconGreenColor") }
                />
            </UserLabelSup>
        </Solid.Show>
    </span>
}


const UserLabelSup = styled.sup`
    font-size: 0.8em;
`