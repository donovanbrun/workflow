const { Client } = require('pg')

export async function connect(config: any, database: string) {
    let client = new Client({
        user: config.postgres.user,
        password: config.postgres.password,
        host: config.postgres.host,
        port: config.postgres.port,
        database: database
    })
    await client.connect().catch((err: any) => { throw err })
    return client
}

export async function clearTable(config: any, database: string, name: string) {
    let client = await connect(config, database)
    await client.query('delete from ' + [name])
    await client.end()
}