const { Client } = require('pg')

async function connect() {
    let client = new Client({
        user: 'postgres',
        password: 'password',
        host: 'localhost',
        port: 5432,
        database: 'findfindnomi'
    })
    await client.connect()
    return client
}

async function clearTable (name) {
    let client = await this.connect()
    await client.query('delete from ' + [name])
    await client.end()
}

module.exports = { connect, clearTable }