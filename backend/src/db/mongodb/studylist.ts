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
    }

    const id = await DbMongo.insertWithNewId(
        state.collStudylists,
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

    const studylist = await state.collStudylists
        .findOne({ _id: studylistId })

    if (!studylist)
        throw Api.Error.notFound

    const isAdmin = Api.userIsAdmin(authUser)
    const isCreator = authUser.id === studylist.creatorId
    if (!isAdmin && !isCreator)
        throw Api.Error.forbidden
    
    const res = await state.collStudylists
        .deleteOne({ _id: studylistId })
    
    if (!res.acknowledged ||
        res.deletedCount !== 1)
        throw Api.Error.internal
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

    const studylist = await state.collStudylists
        .findOne({ _id: studylistId })

    if (!studylist)
        throw Api.Error.notFound

    const isAdmin = Api.userIsAdmin(authUser)
    const isCreator = authUser.id === studylist.creatorId
    if (!isAdmin && !isCreator)
        throw Api.Error.forbidden
        
    switch (edit.type)
    {
        case "name":
        {
            const validatedName = validateName(edit.value)
            await state.collStudylists.updateOne(
                { _id: studylistId },
                { $set: { name: validatedName }})
            break
        }
        case "public":
        {
            await state.collStudylists.updateOne(
                { _id: studylistId },
                { $set: { public: edit.value }})
            break
        }
        case "editorPassword":
        {
            await state.collStudylists.updateOne(
                { _id: studylistId },
                { $set: { editorPassword: edit.value }})
            break
        }
        default:
            throw Api.Error.malformed
    }
}


export async function studylistGet(
    state: DbMongo.State,
    authUser: Api.MaybeUser,
    studylistId: string)
    : Promise<Api.StudyList.Entry>
{
    const studylist = await state.collStudylists
        .findOne({ _id: studylistId })

    if (!studylist)
        throw Api.Error.notFound

    const isAdmin = Api.userIsAdmin(authUser)
    const isCreator = authUser.id === studylist.creatorId
    const isEditor = studylist.editorIds.some(id => authUser.id === id)

    if (!isAdmin && !isCreator)
        studylist.editorPassword = undefined

    if (!studylist.public)
    {
        if (!Auth.canUserRead(authUser))
            throw Api.Error.forbidden

        if (!isAdmin && !isCreator && !isEditor)
            throw Api.Error.forbidden
    }

    return DbMongo.translateDbStudyListToApi(studylist)
}


export async function studylistGetAll(
    state: DbMongo.State,
    authUser: Api.MaybeUser,
    userId: string)
    : Promise<Api.StudyList.Entry[]>
{
    type Projected = Omit<
        DbMongo.DbStudyListEntry,
        "editorPassword" | "words">

    const canSeePrivate =
        authUser.id === userId ||
        Api.userIsAdmin(authUser)

    const studylists = await state.collStudylists
        .find(canSeePrivate ?
            {
                $or: [
                    { creatorId: userId },
                    { editorIds: userId },
                ],
            }
            :
            {
                creatorId: userId,
                public: true,
            })
        .project<Projected>({ editorPassword: 0, words: 0 })
        .sort({ modifyDate: -1 })
        .toArray()

    return studylists
        .map(e => ({ ...e, editorPassword: undefined, words: [] }))
        .map(e => DbMongo.translateDbStudyListToApi(e))
}


export async function studylistGetAllMarked(
    state: DbMongo.State,
    authUser: Api.MaybeUser,
    markWordId: string | undefined)
    : Promise<Api.StudyList.Entry[]>
{
    if (!authUser.id ||
        !Auth.canUserRead(authUser))
        throw Api.Error.forbidden

    type Projected = Omit<
        DbMongo.DbStudyListEntry,
        "editorPassword" | "words">

    const queryWithWord: MongoDriver.Filter<DbMongo.DbStudyListEntry> =
        markWordId ?
            { "words.id": markWordId } :
            {}

    const queryWithoutWord: MongoDriver.Filter<DbMongo.DbStudyListEntry> =
        markWordId ?
            { "words.id": { $ne: markWordId } } :
            {}

    const studylistsWithWord = await state.collStudylists
        .find({
            $or: [
                { creatorId: authUser.id },
                { editorIds: authUser.id },
            ],
            ...queryWithWord,
        })
        .project<Projected>({ editorPassword: 0, words: 0 })
        .sort({ modifyDate: -1 })
        .toArray()

    const studylistsWithoutWord = await state.collStudylists
        .find({
            $or: [
                { creatorId: authUser.id },
                { editorIds: authUser.id },
            ],
            ...queryWithoutWord,
        })
        .project<Projected>({ editorPassword: 0, words: 0 })
        .sort({ modifyDate: -1 })
        .toArray()

    studylistsWithWord.forEach(list => { list.marked = true })

    const studylists = [
        ...studylistsWithWord,
        ...studylistsWithoutWord,
    ]

    return studylists
        .sort((a, b) => b.modifyDate.getTime() - a.modifyDate.getTime())
        .map(e => ({ ...e, editorPassword: undefined, words: [] }))
        .map(e => DbMongo.translateDbStudyListToApi(e))
}


export async function studylistWordAdd(
    state: DbMongo.State,
    authUser: Api.MaybeUser,
    studylistId: string,
    wordId: string)
    : Promise<void>
{
    const studylist = await state.collStudylists
        .findOne({ _id: studylistId })
    
    if (!studylist)
        throw Api.Error.notFound

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

    await state.collStudylists.updateOne(
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


export async function studylistWordRemoveMany(
    state: DbMongo.State,
    authUser: Api.MaybeUser,
    studylistId: string,
    wordIds: string[])
    : Promise<void>
{
    const studylist = await state.collStudylists
        .findOne({ _id: studylistId })
    
    if (!studylist)
        throw Api.Error.notFound

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

    await state.collStudylists.updateOne(
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


export async function studylistWordsGet(
    state: DbMongo.State,
    authUser: Api.MaybeUser,
    studylistId: string)
    : Promise<Api.Word.Entry[]>
{
    const studylist = await state.collStudylists
        .findOne({ _id: studylistId })
    
    if (!studylist)
        throw Api.Error.notFound

    if (!Auth.canUserRead(authUser))
        throw Api.Error.forbidden

    const canSeePrivate =
        authUser.id === studylist.creatorId ||
        Api.userIsAdmin(authUser)

    if (!studylist.public &&
        !canSeePrivate)
        throw Api.Error.forbidden

    const wordIds = studylist.words.map(w => w.id)

    const wordEntries = await state.collWords
        .find({ _id: { $in: wordIds } })
        .toArray()

	return wordEntries
        .map(e => DbMongo.translateDbWordToApiWord(e))
}