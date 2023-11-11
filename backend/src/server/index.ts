import * as Express from "express"
import * as BodyParser from "body-parser"
import * as Auth from "../auth/index.ts"
import * as AuthLorenzi from "../auth/lorenzi.ts"
import * as Db from "../db/index.ts"
import * as DbMongo from "../db/mongodb/index.ts"
import * as AuthRoutes from "./auth.ts"
import * as Search from "./search.ts"
import * as KanjiWords from "./kanji_words.ts"
import * as KanjiByComponents from "./kanji_by_components.ts"

const port = process.env.PORT || 80

const argDb =
    process.argv.some(arg => arg === "--db-mongo") ? "mongo" :
    process.argv.some(arg => arg === "--db-dummy") ? "dummy" :
    "mongo"

const argAuth =
    process.argv.some(arg => arg === "--auth-lorenzi") ? "lorenzi" :
    process.argv.some(arg => arg === "--auth-dummy") ? "dummy" :
    "lorenzi"

const db =
    argDb === "mongo" ? await DbMongo.connect() :
    Db.createDummy()

const auth =
    argAuth === "lorenzi" ? await AuthLorenzi.create() :
    Auth.createDummy()

const app = Express.default()

app.use("/api", BodyParser.default.json())

AuthRoutes.init(app, db, auth)
Search.init(app, db)
KanjiWords.init(app, db)
KanjiByComponents.init(app, db)

app.use("/", Express.static("../frontend/public"))
app.use("/.build/", Express.static("../frontend/.build"))
app.use("*", Express.static("../frontend/public/index.html"))

app.listen(port, () => {
    console.log("server listening...")
})