import * as Express from "express"
import * as Db from "../db/index.ts"
import * as Auth from "../auth/index.ts"
import * as Api from "common/api/index.ts"
import * as AuthRoutes from "./auth.ts"
import * as Util from "./util.ts"


export function init(
    app: Express.Application,
    db: Db.Interface,
    auth: Auth.Interface)
{
    app.post(Api.StudylistCreate.url, async (req, res) => {
        Util.wrapException(res, async () => {
            const body = req.body as Api.StudylistCreate.Request

            if (typeof body.name !== "string")
                throw Api.Error.malformed

            const studylistId = await db.studylistCreate(
                await AuthRoutes.authenticateRequest(auth, req),
                body.name)
            
            res.send({ studylistId } satisfies Api.StudylistCreate.Response)
        })
    })

    app.post(Api.StudylistDelete.url, async (req, res) => {
        const body = req.body as Api.StudylistDelete.Request

        if (typeof body.studylistId !== "string")
        {
            res.sendStatus(400)
            return
        }

        await db.studylistDelete(
            await AuthRoutes.authenticateRequest(auth, req),
            body.studylistId)
        
        res.send({} satisfies Api.StudylistDelete.Response)
    })

    app.post(Api.StudylistEdit.url, async (req, res) => {
        const body = req.body as Api.StudylistEdit.Request

        if (typeof body.studylistId !== "string")
        {
            res.sendStatus(400)
            return
        }

        await db.studylistEdit(
            await AuthRoutes.authenticateRequest(auth, req),
            body.studylistId,
            body.edit)
        
        res.send({} satisfies Api.StudylistEdit.Response)
    })
    
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

        const studyLists = await db.studylistGetAll(
            await AuthRoutes.authenticateRequest(auth, req),
            body.userId,
            body.markWordId)
        
        res.send({ studylists: studyLists } satisfies Api.StudylistGetAll.Response)
    })
    
    app.post(Api.StudylistWordAdd.url, async (req, res) => {
        Util.wrapException(res, async () => {
            const body = req.body as Api.StudylistWordAdd.Request

            if (typeof body.studylistId !== "string")
                throw Api.Error.malformed

            if (typeof body.wordId !== "string")
                throw Api.Error.malformed

            await db.studylistWordAdd(
                await AuthRoutes.authenticateRequest(auth, req),
                body.studylistId,
                body.wordId)

            res.send({} satisfies Api.StudylistWordAdd.Response)
        })
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

        await db.studylistWordRemoveMany(
            await AuthRoutes.authenticateRequest(auth, req),
            body.studylistId,
            body.wordIds)

        res.send({} satisfies Api.StudylistWordRemoveMany.Response)
    })
}