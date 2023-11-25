import * as Auth from "./index.ts"
import * as Api from "common/api/index.ts"
import fetch from "node-fetch"


const lorenziAccountUrlDev = "http://127.0.0.1:8888"
const lorenziAccountUrl = "https://accounts.hlorenzi.com"
const lorenziAuthUrl = lorenziAccountUrlDev


export function create(dev: boolean) : Auth.Interface
{
    const accountUrl =
        dev ?
            lorenziAccountUrlDev :
            lorenziAccountUrl

    return {
        loginUrl: `${ accountUrl }/login`,
        logoutUrl: `${ accountUrl }/logout`,
        accountUrl: accountUrl,
        
        authenticate: async (sessionBlob: string) => {
            try
            {
                const res = await fetch(
                    `${ lorenziAuthUrl }/api/v1/authenticate`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json; charset=utf-8",
                        },
                        body: JSON.stringify({
                            sessionBlob: sessionBlob,
                        })
                    })

                const json = await res.json()
                return json as Api.MaybeUser
            }
            catch
            {
                return {} as Api.MaybeUser
            }
        },

        getUser: async (userId: string) => {
            if (userId === Auth.systemUserId)
            {
                return {
                    user: {
                        id: Auth.systemUserId,
                        name: Auth.systemUserName,
                        tags: Auth.systemUserTags,
                        createDate: 0,
                        modifyDate: 0,
                        activityDate: 0,
                        loginDate: 0,
                    }
                }
            }

            try
            {
                const res = await fetch(
                    `${ lorenziAuthUrl }/api/v1/user/${ userId }`,
                    {
                        method: "POST",
                    })
                
                const json = await res.json()
                return { user: json as Api.MaybeUser }
            }
            catch
            {
                return { user: {} as Api.MaybeUser }
            }
        },
    }
}