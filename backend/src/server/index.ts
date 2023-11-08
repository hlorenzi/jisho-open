import * as Express from "express"
import * as BodyParser from "body-parser"
import * as MongoDb from "../db/mongodb/index.ts"
import * as Search from "./search.ts"
import * as KanjiWords from "./kanji_words.ts"


const db = await MongoDb.connect()

const app = Express.default()

app.use("/api", BodyParser.default.json())

Search.init(app, db)
KanjiWords.init(app, db)

app.use("/", Express.static("../frontend/public"))
app.use("/.build/", Express.static("../frontend/.build"))
app.use("*", Express.static("../frontend/public/index.html"))

app.listen(80, () => {
    console.log("server listening...")
})