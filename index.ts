import * as Importing from "./src/backend/importing/index.js"
import * as Db from "./src/backend/db/index.js"
import * as MongoDb from "./src/backend/db/mongodb/index.js"

const db = await Db.createDummy()// await MongoDb.connect()
await Importing.buildDatabase(db, true)