import * as Kanjidic from "./src/backend/dataentry/kanjidic.js"
import * as Jmdict from "./src/backend/dataentry/jmdict.js"

await Kanjidic.downloadAndParse()
//await Jmdict.downloadAndParse()