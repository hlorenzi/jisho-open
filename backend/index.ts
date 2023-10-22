import * as Importing from "./src/importing/index.ts"
import * as Db from "./src/db/index.ts"
import * as MongoDb from "./src/db/mongodb/index.ts"

const db = await Db.createDummy()// await MongoDb.connect()
await Importing.buildDatabase(db, true)