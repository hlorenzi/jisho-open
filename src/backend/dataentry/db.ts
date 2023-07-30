import * as MongoDb from "mongodb"


export const dbUrl = "mongodb://localhost:27017"
export const dbDatabase = "jisho2"


export async function connect(): Promise<MongoDb.Db>
{
    const client = await MongoDb.MongoClient.connect(dbUrl)
    const db = client.db(dbDatabase)
    return db
}