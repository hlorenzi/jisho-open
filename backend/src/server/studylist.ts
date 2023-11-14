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
    app.post(Api.StudylistCreate.url, async (req, res) => {
        const body = req.body as Api.StudylistCreate.Request

        if (typeof body.name !== "string")
            throw Api.Error.malformed

        const studylistId = await db.studylistCreate(
            await AuthRoutes.authenticateRequest(auth, req),
            body.name)
        
        res.send({ studylistId } satisfies Api.StudylistCreate.Response)
    })

    app.post(Api.StudylistDelete.url, async (req, res) => {
        const body = req.body as Api.StudylistDelete.Request

        if (typeof body.studylistId !== "string")
            throw Api.Error.malformed

        await db.studylistDelete(
            await AuthRoutes.authenticateRequest(auth, req),
            body.studylistId)
        
        res.send({} satisfies Api.StudylistDelete.Response)
    })

    app.post(Api.StudylistEdit.url, async (req, res) => {
        const body = req.body as Api.StudylistEdit.Request

        if (typeof body.studylistId !== "string")
            throw Api.Error.malformed

        await db.studylistEdit(
            await AuthRoutes.authenticateRequest(auth, req),
            body.studylistId,
            body.edit)
        
        res.send({} satisfies Api.StudylistEdit.Response)
    })
    
    app.post(Api.StudylistGet.url, async (req, res) => {
        const body = req.body as Api.StudylistGet.Request

        if (typeof body.studylistId !== "string")
            throw Api.Error.malformed

        const studylist = await db.studylistGet(
            await AuthRoutes.authenticateRequest(auth, req),
            body.studylistId)
        
        res.send({ studylist } satisfies Api.StudylistGet.Response)
    })
    
    app.post(Api.StudylistGetAll.url, async (req, res) => {
        const body = req.body as Api.StudylistGetAll.Request

        if (typeof body.userId !== "string")
            throw Api.Error.malformed

        const studylists = await db.studylistGetAll(
            await AuthRoutes.authenticateRequest(auth, req),
            body.userId)
        
        res.send({ studylists } satisfies Api.StudylistGetAll.Response)
    })
    
    app.post(Api.StudylistGetAllMarked.url, async (req, res) => {
        const body = req.body as Api.StudylistGetAllMarked.Request

        if (typeof body.markWordId !== "string" &&
            typeof body.markWordId !== "undefined")
            throw Api.Error.malformed

        const studylists = await db.studylistGetAllMarked(
            await AuthRoutes.authenticateRequest(auth, req),
            body.markWordId)
        
        res.send({ studylists } satisfies Api.StudylistGetAllMarked.Response)
    })
    
    app.post(Api.StudylistWordAdd.url, async (req, res) => {
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
    
    app.post(Api.StudylistWordRemoveMany.url, async (req, res) => {
        const body = req.body as Api.StudylistWordRemoveMany.Request

        if (typeof body.studylistId !== "string")
            throw Api.Error.malformed

        if (!Array.isArray(body.wordIds) ||
            !body.wordIds.every(w => typeof w === "string"))
            throw Api.Error.malformed

        await db.studylistWordRemoveMany(
            await AuthRoutes.authenticateRequest(auth, req),
            body.studylistId,
            body.wordIds)

        res.send({} satisfies Api.StudylistWordRemoveMany.Response)
    })
}