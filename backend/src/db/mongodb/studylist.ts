import * as MongoDriver from "mongodb"
import * as Db from "../index.ts"
import * as Auth from "../../auth/index.ts"
import * as DbMongo from "./index.ts"
import * as Api from "common/api/index.ts"
import * as Inflection from "common/inflection.ts"


export async function importStandardStudylist(
    state: DbMongo.State,
    studylistId: string,
    studylistName: string,
    wordIds: string[])
    : Promise<void>
{
    const now = new Date()

    const studylist: DbMongo.DbStudyListEntry = {
        _id: studylistId,
        creatorId: Auth.systemUserId,
        name: studylistName,
        public: true,
        editorIds: [],
        editorPassword: undefined,
        wordCount: wordIds.length,
        words: wordIds.reverse().map((w, i) => ({
            id: w,
            date: new Date(now.getTime() + i),
        })),
        createDate: now,
        modifyDate: now,
    }

    await state.collStudylists.deleteOne({ _id: studylistId })
    await state.collStudylists.insertOne(studylist)
}


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
    const isEditor = studylist.editorIds.some(id => id === authUser.id)

    if (!isAdmin && !isCreator)
        studylist.editorPassword = undefined

    if (!studylist.public)
    {
        if (!Auth.canUserRead(authUser))
            throw Api.Error.forbidden

        if (!isAdmin && !isCreator && !isEditor)
            throw Api.Error.forbidden
    }

    return DbMongo.translateStudyListDbToApi(studylist)
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
        .map(e => DbMongo.translateStudyListDbToApi(e))
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
        .map(e => DbMongo.translateStudyListDbToApi(e))
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

    if (!Api.userIsAdmin(authUser) &&
        studylist.creatorId !== authUser.id &&
        !studylist.editorIds.some(id => id === authUser.id))
        throw Api.Error.forbidden

    if (studylist.words.some(w => w.id === wordId))
        return

    if (studylist.words.length >= Api.StudyList.maxWordCount)
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
            $push: { words: { $each: [wordEntry], $slice: Api.StudyList.maxWordCount } },
            $inc: { wordCount: 1 },
            $set: { modifyDate: now },
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

    if (!Api.userIsAdmin(authUser) &&
        studylist.creatorId !== authUser.id &&
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
            },
        })
}


export async function studylistWordImport(
    state: DbMongo.State,
    authUser: Api.MaybeUser,
    studylistId: string,
    words: Api.StudylistWordImport.ImportWord[])
    : Promise<number[]>
{
    if (words.length > Api.StudylistWordImport.maxWords)
        throw Api.Error.malformed

    const studylist = await state.collStudylists
        .findOne({ _id: studylistId })
    
    if (!studylist)
        throw Api.Error.notFound

    if (!Auth.canUserWrite(authUser))
        throw Api.Error.forbidden

    if (!Api.userIsAdmin(authUser) &&
        studylist.creatorId !== authUser.id &&
        !studylist.editorIds.some(id => id === authUser.id))
        throw Api.Error.forbidden

    if (studylist.words.length + 1 >= Api.StudyList.maxWordCount)
        throw Api.Error.studylistCapacity

    const now = new Date()

    const importedWords: Api.StudyList.WordEntry[] = []
    const failedWordIndices: number[] = []
    for (let w = 0; w < words.length; w++)
    {
        const word = words[w]

        const dbFind = word.reading ?
            { $all: [word.base, word.reading] } :
            word.base

        const dbWords = await state.collWords
            .find({
                [DbMongo.fieldWordLookUpHeadingsText]: dbFind,
                [DbMongo.fieldWordLookUpTags]: { $nin: ["name"] },
            })
            .sort({ score: -1, _id: 1 })
            .toArray()

        if (dbWords.length < 1 ||
            studylist.words.length + importedWords.length >= Api.StudyList.maxWordCount)
        {
            failedWordIndices.push(w)
            continue
        }

        const wordId = dbWords[0]._id

        if (studylist.words.find(w => w.id === wordId))
            continue

        if (importedWords.find(w => w.id === wordId))
            continue

        importedWords.push({
            id: wordId,
            date: now,
        })
    }
    
    await state.collStudylists.updateOne(
        { _id: studylistId },
        {
            $push: { words: { $each: importedWords, $slice: Api.StudyList.maxWordCount } },
            $inc: { wordCount: importedWords.length },
            $set: { modifyDate: now },
        })

    return failedWordIndices
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

    const canSeePrivate =
        Api.userIsAdmin(authUser) ||
        studylist.creatorId === authUser.id ||
        studylist.editorIds.some(id => id === authUser.id)

    if (!studylist.public)
    {
        if (!canSeePrivate ||
            !Auth.canUserRead(authUser))
            throw Api.Error.forbidden
    }

    const wordIds = studylist.words.map(w => w.id)

    const wordEntries = await state.collWords
        .find({ _id: { $in: wordIds } })
        .toArray()

	return wordEntries
        .map(e => DbMongo.translateWordDbToApi(e))
}


export async function studylistCommunityGetRecent(
    state: DbMongo.State,
    authUser: Api.MaybeUser,
    limit: number)
    : Promise<Api.StudyList.Entry[]>
{
    type Projected = Omit<
        DbMongo.DbStudyListEntry,
        "editorPassword" | "words">

    let dbFind: any = { creatorId: { $ne: Auth.systemUserId } }

    if (!Api.userIsAdmin(authUser))
        dbFind = { ...dbFind, public: true }

    const studylists = await state.collStudylists
        .find(dbFind)
        .project<Projected>({ editorPassword: 0, words: 0 })
        .sort({ modifyDate: -1 })
        .limit(Math.min(limit, 100))
        .toArray()

    return studylists
        .map(e => ({ ...e, editorPassword: undefined, words: [] }))
        .map(e => DbMongo.translateStudyListDbToApi(e))
}