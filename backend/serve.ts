import * as Express from "express"
import "express-async-errors"
import child_process from "child_process"
// @ts-expect-error
import * as Compression from "compression"
import * as BodyParser from "body-parser"
import * as Api from "common/api/index.ts"
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
    process.argv.some(arg => arg === "--auth-lorenzi-dev") ? "lorenzi-dev" :
    process.argv.some(arg => arg === "--auth-lorenzi") ? "lorenzi" :
    process.argv.some(arg => arg === "--auth-dummy") ? "dummy" :
    "dummy"

console.log("starting db...")
const db =
    argDb === "mongo" ? await DbMongo.connect() :
    Db.createDummy()

console.log("starting auth...")
const auth =
    argAuth === "lorenzi-dev" ? await AuthLorenzi.create(true) :
    argAuth === "lorenzi" ? await AuthLorenzi.create(false) :
    Auth.createDummy()


let version = "v?.?-??????"
try
{
    version = child_process.execSync("git describe --tags --match v*")
        .toString()
        .trim()
        .replace("-", ".")
}
finally {}

console.log(`starting server ${version}...`)
const app = Express.default()

app.use("/api", BodyParser.default.json())
app.use(Api.StudylistWordsGet.url, Compression.default())
app.use(Api.KanjiWords.url, Compression.default())

ServerAuth.init(app, db, auth)
ServerAdmin.init(app, db, auth, version)
ServerSearch.init(app, db)
ServerKanjiWords.init(app, db)
ServerKanjiByComponents.init(app, db)
ServerStudylist.init(app, db, auth)
Importing.setupScheduledDatabaseBuild(db)

app.use("/.build/", serveGzippedJs)

app.use("/", Express.static("../frontend/public"))
app.use("/.build/", Express.static("../frontend/.build"))
app.use("/furigana.txt", Express.static("./furigana.txt"))
app.use("*", Express.static("../frontend/public/index.html"))

app.use(async (err: any, req: Express.Request, res: Express.Response, next: any) => {
    if (!err.statusCode || !err.statusMessage)
    {
        await db.log(`internal error: ${ err }`)
        console.error(err)
    }

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
    db.log(`server started on port ${ port }!`)
    console.log(`server listening on port ${ port }...`)
})



function serveGzippedJs(
    req: Express.Request,
    res: Express.Response,
    next: () => void)
{
	if (!req.url.endsWith(".js"))
	{
		next()
		return
	}

	const acceptEncoding = req.headers["accept-encoding"]
	if (acceptEncoding &&
        acceptEncoding.indexOf("gzip") < 0)
	{
		next()
		return
	}

	req.url = req.url + ".gz"
	res.set("Content-Encoding", "gzip")
	res.set("Content-Type", "text/javascript")
	next()
}