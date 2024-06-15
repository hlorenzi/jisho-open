import * as Importing from "../importing/index.ts"
import * as Db from "../db/index.ts"
import * as MongoDb from "../db/mongodb/index.ts"

console.log("migration start")

const db = await MongoDb.connect()

const dbOld = db.client.db("jisho")
const collStudylistsOld = dbOld.collection("vocablists")

for await (const entry of collStudylistsOld.find({}).stream())
{
    const _id = entry._id.toString()
    if (typeof _id !== "string")
        throw `invalid _id type`

    if (_id.startsWith("00"))
        continue

    const newEntry: MongoDb.DbStudyListEntry = {
        _id,
        name: entry.name,
        creatorId: entry.creatorId,
        public: entry.public,

        createDate: entry.createDate,
        modifyDate: new Date(Math.max(
            entry.modifyDate.getTime(),
            entry.activityDate.getTime())),

        editorIds: [],
        editorPassword: undefined,

        wordCount: entry.wordCount,
        words: entry.words,
    }

    console.log(`migrating studylist id ${ _id }`)

    await db.state.collStudylists.deleteOne({ _id })
    await db.state.collStudylists.insertOne(newEntry)
}

console.log("migration done")
process.exit(0)