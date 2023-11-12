import * as MongoDriver from "mongodb"
import * as Db from "../index.ts"
import * as Auth from "../../auth/index.ts"
import * as DbMongo from "./index.ts"
import * as Api from "common/api/index.ts"
import * as Inflection from "common/inflection.ts"


function validateName(name: string): string
{
    name = name.trim()

    if (name.length === 0 || name.length > 100)
        throw Api.Error.studylistInvalidName

    return name
}


export async function studylistCreate(
    state: DbMongo.State,
    authUser: Api.MaybeUser,
    name: string)
    : Promise<string>
{
    if (!authUser.id ||
        !Auth.canUserWrite(authUser))
        throw Api.Error.forbidden

    const validatedName = validateName(name)

    const now = new Date()

    const studylist: DbMongo.DbStudyListEntry = {
        _id: undefined!,
        creatorId: authUser.id,
        name: validatedName,
        public: false,
        editorIds: [],
        editorPassword: undefined,
        wordCount: 0,
        words: [],
        createDate: now,
        modifyDate: now,
        activityDate: now,
    }

    const id = await DbMongo.insertWithNewId(
        state.collStudyLists,
        studylist)
    
    return id
}


export async function studylistDelete(
    state: DbMongo.State,
    authUser: Api.MaybeUser,
    studylistId: string)
    : Promise<void>
{
    if (!authUser.id ||
        !Auth.canUserWrite(authUser))
        throw Api.Error.forbidden

    const res = await state.collStudyLists
        .deleteOne({ _id: studylistId })
    
    if (!res.acknowledged ||
        res.deletedCount !== 1)
        throw Api.Error.forbidden
}


export async function studylistEdit(
    state: DbMongo.State,
    authUser: Api.MaybeUser,
    studylistId: string,
    edit: Api.StudylistEdit.Request["edit"])
    : Promise<void>
{
    if (!authUser.id ||
        !Auth.canUserWrite(authUser))
        throw Api.Error.forbidden
}


export async function studylistGetAll(
    state: DbMongo.State,
    authUser: Api.MaybeUser,
    userId: string,
    markWordId: string | undefined)
    : Promise<Api.StudyList.Entry[]>
{
    const seePrivate =
        Auth.canUserRead(authUser) &&
        authUser.id === userId

    const findQuery: MongoDriver.Filter<DbMongo.DbStudyListEntry> =
        seePrivate ?
        {
            $or: [
                { creatorId: userId },
                { editorIds: authUser.id },
            ]
        }
        :
        { creatorId: userId, public: true }

    const studylists = await state.collStudyLists
        .find(findQuery)
        .sort({ modifyDate: -1 })
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
        .map(e => DbMongo.translateDbStudyListToApi(e))
}


export async function studyListWordAdd(
    state: DbMongo.State,
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
        throw Api.Error.studylistCapacity

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
            $set: {
                modifyDate: now,
                activityDate: now,
            },
        })
}


export async function studyListWordRemoveMany(
    state: DbMongo.State,
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

    const now = new Date()

    await state.collStudyLists.updateOne(
        { _id: studylistId },
        {
            $set: {
                wordCount: newWords.length,
                words: newWords,
                modifyDate: now,
                activityDate: now,
            },
        })
}