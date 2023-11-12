import * as Express from "express"
import * as Db from "../db/index.ts"
import * as Auth from "../auth/index.ts"
import * as Api from "common/api/index.ts"
import * as AuthRoutes from "./auth.ts"


export function init(
    app: Express.Application,
    db: Db.Interface,
    auth: Auth.Interface)
{
    app.post(Api.StudylistGetAll.url, async (req, res) => {
        const body = req.body as Api.StudylistGetAll.Request

        if (typeof body.userId !== "string")
        {
            res.sendStatus(400)
            return
        }

        if (typeof body.markWordId !== "string" &&
            typeof body.markWordId !== "undefined")
        {
            res.sendStatus(400)
            return
        }

        const studyLists = await db.getStudyLists(
            await AuthRoutes.authenticateRequest(auth, req),
            body.userId,
            body.markWordId)
        
        res.send({ studylists: studyLists } satisfies Api.StudylistGetAll.Response)
    })
    
    app.post(Api.StudylistWordAdd.url, async (req, res) => {
        const body = req.body as Api.StudylistWordAdd.Request

        if (typeof body.studylistId !== "string")
        {
            res.sendStatus(400)
            return
        }

        if (typeof body.wordId !== "string")
        {
            res.sendStatus(400)
            return
        }

        await db.studyListWordAdd(
            await AuthRoutes.authenticateRequest(auth, req),
            body.studylistId,
            body.wordId)

        res.send({} satisfies Api.StudylistWordAdd.Response)
    })
    
    app.post(Api.StudylistWordRemoveMany.url, async (req, res) => {
        const body = req.body as Api.StudylistWordRemoveMany.Request

        if (typeof body.studylistId !== "string")
        {
            res.sendStatus(400)
            return
        }

        if (!Array.isArray(body.wordIds) ||
            !body.wordIds.every(w => typeof w === "string"))
        {
            res.sendStatus(400)
            return
        }

        await db.studyListWordRemoveMany(
            await AuthRoutes.authenticateRequest(auth, req),
            body.studylistId,
            body.wordIds)

        res.send({} satisfies Api.StudylistWordRemoveMany.Response)
    })
}