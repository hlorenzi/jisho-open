import * as Importing from "./src/importing/index.ts"
import * as Db from "./src/db/index.ts"
import * as MongoDb from "./src/db/mongodb/index.ts"

const db = await MongoDb.connect()
await Importing.buildDatabase(db, true)
process.exit(0)