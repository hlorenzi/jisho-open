import * as Express from "express"
import * as ChildProcess from "child_process"
import * as Db from "../db/index.ts"
import * as Auth from "../auth/index.ts"
import * as ServerAuth from "./auth.ts"
import * as Api from "common/api/index.ts"
import * as Importing from "../importing/index.ts"


export function init(
    app: Express.Application,
    db: Db.Interface,
    auth: Auth.Interface,
    version: string)
{
    app.post(Api.VersionGet.url, async (req, res) => {
        res.send({ version } as Api.VersionGet.Response)
    })

    app.post(Api.Log.url, async (req, res) => {
        const authUser = await ServerAuth.authenticateRequest(auth, req)
        if (!Api.userIsAdmin(authUser))
            throw Api.Error.forbidden

        const entries = await db.logGet()

        res.send({ entries } as Api.Log.Response)
    })

    app.post(Api.Analytics.url, async (req, res) => {
        const results = await db.analyticsDailyGet()

        res.send(results as Api.Analytics.Response)
    })

    app.get(Api.AdminDbRefresh.url, async (req, res) => {
        const authUser = await ServerAuth.authenticateRequest(auth, req)
        if (!Api.userIsAdmin(authUser))
            throw Api.Error.forbidden

        await db.log("admin: db refresh")
        
        Importing.buildDatabase(db, false)
        res.redirect("/")
    })

    app.get(Api.AdminGitUpdate.url, async (req, res) => {
        const authUser = await ServerAuth.authenticateRequest(auth, req)
        if (!Api.userIsAdmin(authUser))
            throw Api.Error.forbidden

        await db.log("admin: git update")

        const child = ChildProcess.spawn(
            "sh",
            ["./update.sh"],
            {
                detached: true,
                stdio: [ "ignore", "ignore", "ignore" ]
            })

        child.unref()
        res.redirect("/")
    })
}