import * as Db from "../db/index.ts"
import * as Logging from "./logging.ts"
import * as Api from "common/api/index.ts"


export async function buildStandardLists(
    logger: Logging.Logger,
    db: Db.Interface)
{
    await logger.writeLn("building standard study lists...")

    await buildListByFilter(
        db,
        "0000n1",
        "JLPT N1 Words",
        ["n1"],
        ["n5", "n4", "n3", "n2"])

    await buildListByFilter(
        db,
        "0000n2",
        "JLPT N2 Words",
        ["n2"],
        ["n5", "n4", "n3"])

    await buildListByFilter(
        db,
        "0000n3",
        "JLPT N3 Words",
        ["n3"],
        ["n5", "n4"])

    await buildListByFilter(
        db,
        "0000n4",
        "JLPT N4 Words",
        ["n4"],
        ["n5"])

    await buildListByFilter(
        db,
        "0000n5",
        "JLPT N5 Words",
        ["n5"],
        [])
}


async function buildListByFilter(
    db: Db.Interface,
    studylistId: string,
    studylistName: string,
    tags: Api.Word.FilterTag[],
    inverseTags: Api.Word.FilterTag[])
{
    const words = await db.searchByTags({
        limit: 10000,
        tags: new Set(tags),
        inverseTags: new Set(inverseTags),
    })

    await db.importStandardStudylist(
        studylistId,
        studylistName,
        words.map(w => w.id))
}