import * as Solid from "solid-js"
import { styled } from "solid-styled-components"
import * as Framework from "../framework/index.ts"
import * as Api from "common/api/index.ts"
import * as Pages from "../pages.ts"


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


export function UserLabel(props: {
    user?: Api.MaybeUser,
})
{
    const isSystem = Api.userIsSystem(props.user ?? {})
    const isAdmin = Api.userIsAdmin(props.user ?? {})
    const isVip = Api.userIsVip(props.user ?? {})

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