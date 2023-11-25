import * as Express from "express"
import * as Db from "../db/index.ts"
import * as Auth from "../auth/index.ts"
import * as ServerAuth from "./auth.ts"
import * as Api from "common/api/index.ts"


export function init(
    app: Express.Application,
    db: Db.Interface,
    auth: Auth.Interface)
{
    app.post(Api.Log.url, async (req, res) => {
        const authUser = await ServerAuth.authenticateRequest(auth, req)
        if (!Api.userIsAdmin(authUser))
            throw Api.Error.forbidden

        const entries = await db.logGet()

        res.send({ entries } as Api.Log.Response)
    })
}