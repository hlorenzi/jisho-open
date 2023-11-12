import * as Db from "../index.ts"
import * as Auth from "../../auth/index.ts"
import * as MongoDb from "./index.ts"
import * as Api from "common/api/index.ts"
import * as Inflection from "common/inflection.ts"


export async function getStudyLists(
    state: MongoDb.State,
    authUser: Api.MaybeUser,
    userId: string,
    markWordId: string | undefined)
    : Promise<Api.StudyList.Entry[]>
{
    const seePrivate =
        Auth.canUserRead(authUser) &&
        authUser.id === userId

    const dbFind: Record<string, any>[] = [
        {
            creatorId: userId,
            public: (!seePrivate ? true : undefined),
        }
    ]

    if (seePrivate)
        dbFind.push({ editorIds: authUser.id })

    const studylists = await state.collStudyLists
        .find({ $or: dbFind })
        .toArray()

    if (markWordId !== undefined)
    {
        studylists.forEach(list => {
            if (list.words.some(w => w.id === markWordId))
                list.marked = true
        })
    }

    return studylists
        .map(e => ({ ...e, editorPassword: undefined, words: [] }))
        .map(e => MongoDb.translateDbStudyListToApi(e))
}


export async function studyListWordAdd(
    state: MongoDb.State,
    authUser: Api.MaybeUser,
    studylistId: string,
    wordId: string)
    : Promise<void>
{
    const studylist = await state.collStudyLists
        .findOne({ _id: studylistId })
    
    if (!studylist)
        throw Api.Error.forbidden

    if (!Auth.canUserWrite(authUser))
        throw Api.Error.forbidden

    if (authUser.id !== studylist.creatorId &&
        !studylist.editorIds.some(id => id === authUser.id))
        throw Api.Error.forbidden

    if (studylist.words.some(w => w.id === wordId))
        return

    if (studylist.words.length >= Api.StudyList.wordCountMax)
        throw Api.Error.studyListCapacity

    const word = await state.collWords.findOne({ _id: wordId })
    if (!word)
        throw Api.Error.forbidden
    
    const now = new Date()
    const wordEntry: Api.StudyList.WordEntry = {
        id: wordId,
        date: now,
    }

    await state.collStudyLists.updateOne(
        { _id: studylistId },
        {
            $push: { words: wordEntry },
            $inc: { wordCount: 1 },
            $set: { activityDate: now },
        })
}


export async function studyListWordRemoveMany(
    state: MongoDb.State,
    authUser: Api.MaybeUser,
    studylistId: string,
    wordIds: string[])
    : Promise<void>
{
    const studylist = await state.collStudyLists
        .findOne({ _id: studylistId })
    
    if (!studylist)
        throw Api.Error.forbidden

    if (!Auth.canUserWrite(authUser))
        throw Api.Error.forbidden

    if (authUser.id !== studylist.creatorId &&
        !studylist.editorIds.some(id => id === authUser.id))
        throw Api.Error.forbidden

    const wordIdSet = new Set(wordIds)
    if (wordIdSet.size === 0)
        return

    const newWords = studylist.words
        .filter(w => !wordIdSet.has(w.id))

    if (newWords.length === studylist.words.length)
        return

    await state.collStudyLists.updateOne(
        { _id: studylistId },
        {
            $set: {
                wordCount: newWords.length,
                words: newWords,
                activityDate: new Date(),
            },
        })
}