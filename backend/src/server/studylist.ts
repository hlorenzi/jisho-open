import * as Express from "express"
import * as Db from "../db/index.ts"
import * as Auth from "../auth/index.ts"
import * as Api from "common/api/index.ts"
import * as ServerAuth from "./auth.ts"


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
            await ServerAuth.authenticateRequest(auth, req),
            body.name)
        
        res.send({ studylistId } satisfies Api.StudylistCreate.Response)
    })

    app.post(Api.StudylistClone.url, async (req, res) => {
        const body = req.body as Api.StudylistClone.Request

        if (typeof body.studylistId !== "string")
            throw Api.Error.malformed

        const newId = await db.studylistClone(
            await ServerAuth.authenticateRequest(auth, req),
            body.studylistId)
        
        res.send({ studylistId: newId } satisfies Api.StudylistClone.Response)
    })

    app.post(Api.StudylistDelete.url, async (req, res) => {
        const body = req.body as Api.StudylistDelete.Request

        if (typeof body.studylistId !== "string")
            throw Api.Error.malformed

        await db.studylistDelete(
            await ServerAuth.authenticateRequest(auth, req),
            body.studylistId)
        
        res.send({} satisfies Api.StudylistDelete.Response)
    })

    app.post(Api.StudylistEdit.url, async (req, res) => {
        const body = req.body as Api.StudylistEdit.Request

        if (typeof body.studylistId !== "string")
            throw Api.Error.malformed

        if (typeof body.edit !== "object")
            throw Api.Error.malformed

        if (typeof body.edit.type !== "string")
            throw Api.Error.malformed

        switch (body.edit.type)
        {
            case "name":
                if (typeof body.edit.value !== "string")
                    throw Api.Error.malformed
                break
            case "public":
                if (typeof body.edit.value !== "boolean")
                    throw Api.Error.malformed
                break
            case "editorPassword":
                if (typeof body.edit.value !== "string" &&
                    typeof body.edit.value !== "undefined")
                    throw Api.Error.malformed
                break
            case "editorIds":
                if (!Array.isArray(body.edit.value))
                    throw Api.Error.malformed
            
                if (!body.edit.value.every(id => typeof id === "string"))
                    throw Api.Error.malformed
                break
            default:
                throw Api.Error.malformed
        }

        await db.studylistEdit(
            await ServerAuth.authenticateRequest(auth, req),
            body.studylistId,
            body.edit)
        
        res.send({} satisfies Api.StudylistEdit.Response)
    })

    app.post(Api.StudylistEditorJoin.url, async (req, res) => {
        const body = req.body as Api.StudylistEditorJoin.Request

        if (typeof body.studylistId !== "string")
            throw Api.Error.malformed

        if (typeof body.password !== "string")
            throw Api.Error.malformed

        await db.studylistEditorJoin(
            await ServerAuth.authenticateRequest(auth, req),
            body.studylistId,
            body.password)
        
        res.send({} satisfies Api.StudylistEditorJoin.Response)
    })

    app.post(Api.StudylistEditorLeave.url, async (req, res) => {
        const body = req.body as Api.StudylistEditorLeave.Request

        if (typeof body.studylistId !== "string")
            throw Api.Error.malformed

        await db.studylistEditorLeave(
            await ServerAuth.authenticateRequest(auth, req),
            body.studylistId)
        
        res.send({} satisfies Api.StudylistEditorLeave.Response)
    })
    
    app.post(Api.StudylistGet.url, async (req, res) => {
        const body = req.body as Api.StudylistGet.Request

        if (typeof body.studylistId !== "string")
            throw Api.Error.malformed

        const studylist = await db.studylistGet(
            await ServerAuth.authenticateRequest(auth, req),
            body.studylistId)
        
        res.send({ studylist } satisfies Api.StudylistGet.Response)
    })
    
    app.post(Api.StudylistGetAll.url, async (req, res) => {
        const body = req.body as Api.StudylistGetAll.Request

        if (typeof body.userId !== "string")
            throw Api.Error.malformed

        const studylists = await db.studylistGetAll(
            await ServerAuth.authenticateRequest(auth, req),
            body.userId)
        
        res.send({ studylists } satisfies Api.StudylistGetAll.Response)
    })
    
    app.post(Api.StudylistGetAllMarked.url, async (req, res) => {
        const body = req.body as Api.StudylistGetAllMarked.Request

        if (typeof body.markWordId !== "string" &&
            typeof body.markWordId !== "undefined")
            throw Api.Error.malformed

        const studylists = await db.studylistGetAllMarked(
            await ServerAuth.authenticateRequest(auth, req),
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
            await ServerAuth.authenticateRequest(auth, req),
            body.studylistId,
            body.wordId)

        res.send({} satisfies Api.StudylistWordAdd.Response)
        db.analyticsAddSet("studylistId", body.studylistId)
        db.analyticsAdd("studylistWordAdd", 1)
    })
    
    app.post(Api.StudylistWordRemoveMany.url, async (req, res) => {
        const body = req.body as Api.StudylistWordRemoveMany.Request

        if (typeof body.studylistId !== "string")
            throw Api.Error.malformed

        if (!Array.isArray(body.wordIds) ||
            !body.wordIds.every(w => typeof w === "string"))
            throw Api.Error.malformed

        await db.studylistWordRemoveMany(
            await ServerAuth.authenticateRequest(auth, req),
            body.studylistId,
            body.wordIds)

        res.send({} satisfies Api.StudylistWordRemoveMany.Response)
    })
    
    app.post(Api.StudylistWordImport.url, async (req, res) => {
        const body = req.body as Api.StudylistWordImport.Request

        if (typeof body.studylistId !== "string")
            throw Api.Error.malformed

        if (typeof body.attemptDeinflection !== "boolean")
            throw Api.Error.malformed

        if (!Array.isArray(body.words) ||
            !body.words.every(w =>
                typeof w.base === "string" &&
                (typeof w.reading === "string" || w.reading === undefined)))
            throw Api.Error.malformed

        const failedWordIndices = await db.studylistWordImport(
            await ServerAuth.authenticateRequest(auth, req),
            body.studylistId,
            body.attemptDeinflection,
            body.words)

        res.send({ failedWordIndices } satisfies Api.StudylistWordImport.Response)
    })
    
    app.post(Api.StudylistWordsGet.url, async (req, res) => {
        const body = req.body as Api.StudylistWordsGet.Request

        if (typeof body.studylistId !== "string")
            throw Api.Error.malformed

        const entries = await db.studylistWordsGet(
            await ServerAuth.authenticateRequest(auth, req),
            body.studylistId)

        res.send({ entries } satisfies Api.StudylistWordsGet.Response)
    })
    
    app.post(Api.StudylistStandardGetAll.url, async (req, res) => {
        const body = req.body as Api.StudylistStandardGetAll.Request

        const studylists = await db.studylistGetAll(
            await ServerAuth.authenticateRequest(auth, req),
            Auth.systemUserId)

        res.send({ studylists } satisfies Api.StudylistStandardGetAll.Response)
    })
    
    app.post(Api.StudylistCommunityGetRecent.url, async (req, res) => {
        const body = req.body as Api.StudylistCommunityGetRecent.Request

        if (typeof body.limit !== "number")
            throw Api.Error.malformed

        const studylists = await db.studylistCommunityGetRecent(
            await ServerAuth.authenticateRequest(auth, req),
            body.limit)

        res.send({ studylists } satisfies Api.StudylistCommunityGetRecent.Response)
    })
}