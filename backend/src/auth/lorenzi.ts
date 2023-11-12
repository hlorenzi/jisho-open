import * as Auth from "./index.ts"
import * as Api from "common/api/index.ts"
import fetch from "node-fetch"


const lorenziAuthUrl = "http://127.0.0.1:8888"


export function create() : Auth.Interface
{
    return {
        loginUrl: `${ lorenziAuthUrl }/login`,
        
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
            try
            {
                const res = await fetch(
                    `${ lorenziAuthUrl }/api/v1/user/${ userId }`,
                    {
                        method: "POST",
                    })
                
                const json = await res.json()
                return json as Api.MaybeUser
            }
            catch
            {
                return {} as Api.MaybeUser
            }
        },
    }
}