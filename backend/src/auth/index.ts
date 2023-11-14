import * as Api from "common/api/index.ts"


export interface Interface
{
    loginUrl: string
    accountUrl: string

    authenticate: (
        sessionBlob: string)
        => Promise<Api.Authenticate.Response>

    getUser: (
        userId: string)
        => Promise<Api.GetUser.Response>
}


export const loginCookieName = "lorenzis_account"


export function isAdmin(user: Api.MaybeUser)
{
    if (!user.id)
        return false

    if (!user.tags.some(tag => tag === "admin"))
        return false

    return true
}


export function canUserRead(user: Api.MaybeUser)
{
    if (!user.id)
        return false

    if (user.tags.some(tag => tag === "ban"))
        return false

    return true
}


export function canUserWrite(user: Api.MaybeUser)
{
    if (!user.id)
        return false

    if (user.tags.some(tag => tag === "ban" || tag === "restrict"))
        return false

    return true
}


export function createDummy(): Interface
{
    return {
        loginUrl: Api.Login.urlFrontendFake,
        accountUrl: "/",

        authenticate: async (sessionBlob) => {
            try
            {
                const json = JSON.parse(sessionBlob)
                const userId = json.userId

                return {
                    id: userId,
                    name: `fake:${userId}`,
                    tags: ["fake"],
                    createDate: 0,
                    modifyDate: 0,
                    activityDate: 0,
                    loginDate: 0,
                }
            }
            catch
            {
                return {}
            }
        },

        getUser: async (userId) => {
            return {
                user: {
                    id: userId,
                    name: `fake:${userId}`,
                    tags: ["fake"],
                    createDate: 0,
                    modifyDate: 0,
                    activityDate: 0,
                    loginDate: 0,
                },
            }
        },
    }
}