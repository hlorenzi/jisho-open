import * as Express from "express"
import * as Db from "../db/index.ts"
import * as Auth from "../auth/index.ts"
import * as Api from "common/api/index.ts"
// @ts-expect-error
import * as CookieParser from "cookie-parser"


export function init(
    app: Express.Application,
    db: Db.Interface,
    auth: Auth.Interface)
{
    app.use(CookieParser.default())


    app.get(Api.Login.url, async (req, res) => {
        let url = auth.loginUrl
        const redirect = req.query.redirect as (string | undefined)
        if (redirect)
            url += "?redirect=" + encodeURIComponent(decodeURIComponent(redirect))

        res.redirect(url)
    })


    app.get(Api.Login.urlFake, async (req, res) => {
        let url = "/"
        const redirect = req.query.redirect as (string | undefined)
        if (redirect)
            url = decodeURIComponent(redirect)
            
        res.cookie(
            Auth.loginCookieName,
            JSON.stringify({ userId: req.params.userId }),
            {
                maxAge: 1000 * 60 * 60,
                httpOnly: true,
                domain: undefined,
                secure: false,
                signed: false,
                sameSite: "strict",
            })

        res.redirect(url)
    })


    app.get(Api.Logout.url, async (req, res) => {
        let url = auth.logoutUrl
        const redirect = req.query.redirect as (string | undefined)
        if (redirect)
            url += "?redirect=" + encodeURIComponent(decodeURIComponent(redirect))
            
        res.clearCookie(Auth.loginCookieName)
        res.redirect(url)
    })


    app.get(Api.Account.url, async (req, res) => {
        res.redirect(auth.accountUrl)
    })


    app.post(Api.Authenticate.url, async (req, res) => {
        res.send(await authenticateRequest(auth, req))
    })


    app.post(Api.GetUser.url, async (req, res) => {
        const body = req.body as Api.GetUser.Request

        if (typeof body.userId !== "string")
            throw Api.Error.malformed
    
        res.send(await auth.getUser(req.body.userId))
    })
}


export async function authenticateRequest(
    auth: Auth.Interface,
    req: Express.Request)
{
    const blob =
        req.signedCookies[Auth.loginCookieName] ??
        req.cookies[Auth.loginCookieName]

    return await auth.authenticate(blob)
}