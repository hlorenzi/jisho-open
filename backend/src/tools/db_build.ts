import * as Importing from "../importing/index.ts"
import * as Db from "../db/index.ts"
import * as MongoDb from "../db/mongodb/index.ts"

const db = await MongoDb.connect()
await Importing.buildDatabase(db, true)
process.exit(0)