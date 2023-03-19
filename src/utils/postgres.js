const { Client } = require('pg')
const config = require('../config/config')

async function connect(database) {
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

async function clearTable (database, name) {
    let client = await this.connect(database)
    await client.query('delete from ' + [name])
    await client.end()
}

module.exports = { connect, clearTable }