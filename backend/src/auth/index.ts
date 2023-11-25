import * as Api from "common/api/index.ts"


export interface Interface
{
    loginUrl: string
    logoutUrl: string
    accountUrl: string

    authenticate: (
        sessionBlob: string)
        => Promise<Api.Authenticate.Response>

    getUser: (
        userId: string)
        => Promise<Api.GetUser.Response>
}


export const loginCookieName = "lorenzis_account"
export const systemUserId = "000000"
export const systemUserName = "Kenshiro"
export const systemUserTags = ["system"]


export function canUserRead(user: Api.MaybeUser)
{
    if (!user.id)
        return false

    if (user.tags?.some(tag => tag === "ban"))
        return false

    return true
}


export function canUserWrite(user: Api.MaybeUser)
{
    if (!user.id)
        return false

    if (user.tags?.some(tag => tag === "ban" || tag === "restrict"))
        return false

    return true
}


export function createDummy(): Interface
{
    return {
        loginUrl: Api.Login.urlFrontendFake,
        logoutUrl: "/",
        accountUrl: "/",

        authenticate: async (sessionBlob) => {
            try
            {
                const json = JSON.parse(sessionBlob)
                const userId = json.userId as string

                const tags = ["fake"]
                if (userId.startsWith("admin"))
                    tags.push("admin")

                return {
                    id: userId,
                    name: `fake:${userId}`,
                    tags,
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
            if (userId === systemUserId)
            {
                return {
                    user: {
                        id: systemUserId,
                        name: systemUserName,
                        tags: systemUserTags,
                        createDate: 0,
                        modifyDate: 0,
                        activityDate: 0,
                        loginDate: 0,
                    }
                }
            }
            
            const tags = ["fake"]
            if (userId.startsWith("admin"))
                tags.push("admin")

            return {
                user: {
                    id: userId,
                    name: `fake:${userId}`,
                    tags,
                    createDate: 0,
                    modifyDate: 0,
                    activityDate: 0,
                    loginDate: 0,
                },
            }
        },
    }
}