import * as Express from "express"
import * as BodyParser from "body-parser"
import * as Search from "./search.ts"


const app = Express.default()

app.use("/api", BodyParser.default.json())

Search.init(app)

app.use("/", Express.static("../frontend/public"))
app.use("/.build/", Express.static("../frontend/.build"))
app.use("*", Express.static("../frontend/public/index.html"))

app.listen(80, () => {
    console.log("server listening...")
})