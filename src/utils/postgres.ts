const { Client } = require('pg')
import { config } from "../config/config";

export async function connect(database: string) {
    let client = new Client({
        user: config.postgres.user,
        password: config.postgres.password,
        host: config.postgres.host,
        port: config.postgres.port,
        database: database
    })
    await client.connect()
    return client
}

export async function clearTable (database: string, name: string) {
    let client = await connect(database)
    await client.query('delete from ' + [name])
    await client.end()
}