const { Client } = require('pg')

export async function connect(host: string, port: string, user: string, password: string, database: string) {
    let client = new Client({
        user,
        password,
        host,
        port,
        database
    })
    await client.connect().catch((err: any) => { throw err })
    return client
}

export async function clearTable(host: string, port: string, user: string, password: string, database: string, name: string) {
    let client = await connect(host, port, user, password, database)
    await client.query('delete from ' + [name])
    await client.end()
}

export async function getTable(host: string, port: string, user: string, password: string, database: string, name: string) {
    let client = await connect(host, port, user, password, database)
    const res = await client.query('select * from ' + [name])
    await client.end()
    return res.rows
}