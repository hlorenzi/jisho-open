import * as Express from "express"
import "express-async-errors"
import * as BodyParser from "body-parser"
import * as Importing from "./src/importing/index.ts"
import * as Auth from "./src/auth/index.ts"
import * as AuthLorenzi from "./src/auth/lorenzi.ts"
import * as Db from "./src/db/index.ts"
import * as DbMongo from "./src/db/mongodb/index.ts"
import * as ServerAuth from "./src/server/auth.ts"
import * as ServerAdmin from "./src/server/admin.ts"
import * as ServerSearch from "./src/server/search.ts"
import * as ServerKanjiWords from "./src/server/kanji_words.ts"
import * as ServerKanjiByComponents from "./src/server/kanji_by_components.ts"
import * as ServerStudylist from "./src/server/studylist.ts"

const port = process.env.PORT || 80

const argDb =
    process.argv.some(arg => arg === "--db-mongo") ? "mongo" :
    process.argv.some(arg => arg === "--db-dummy") ? "dummy" :
    "mongo"

const argAuth =
    process.argv.some(arg => arg === "--auth-lorenzi") ? "lorenzi" :
    process.argv.some(arg => arg === "--auth-dummy") ? "dummy" :
    "dummy"

const db =
    argDb === "mongo" ? await DbMongo.connect() :
    Db.createDummy()

const auth =
    argAuth === "lorenzi" ? await AuthLorenzi.create() :
    Auth.createDummy()

const app = Express.default()

app.use("/api", BodyParser.default.json())

ServerAuth.init(app, db, auth)
ServerAdmin.init(app, db, auth)
ServerSearch.init(app, db)
ServerKanjiWords.init(app, db)
ServerKanjiByComponents.init(app, db)
ServerStudylist.init(app, db, auth)
Importing.setupScheduledDatabaseBuild(db)

app.use("/", Express.static("../frontend/public"))
app.use("/.build/", Express.static("../frontend/.build"))
app.use("*", Express.static("../frontend/public/index.html"))

app.use((err: any, req: Express.Request, res: Express.Response, next: any) => {
    if (!err.statusCode || !err.statusMessage)
        console.error(err)

    if (res.headersSent)
        return next(err)

    if (err.statusCode && err.statusMessage)
    {
        res.status(err.statusCode)
        res.send(err.statusMessage)
        return
    }

    res.status(500).send(err)
})

app.listen(port, () => {
    console.log("server listening...")
})