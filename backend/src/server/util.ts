import * as Express from "express"
import * as Api from "common/api/index.ts"


export async function wrapException<T>(
    res: Express.Response,
    func: (() => void) | (() => Promise<T>))
{
    try
    {
        func()
    }
    catch (err)
    {
        if (err === Api.Error.internal)
        {
            res.sendStatus(500)
            return
        }

        if (err === Api.Error.forbidden)
        {
            res.sendStatus(403)
            return
        }

        if (err === Api.Error.studylistCapacity ||
            err === Api.Error.studylistInvalidName)
        {
            res.sendStatus(400)
            return
        }

        res.sendStatus(500)
    }
}