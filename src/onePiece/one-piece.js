const axios = require('axios')
const postgres = require('../utils/postgres')

async function process() {
    let data = await extract()
    data = transform(data)
    await load(data)
}

let extract = async () => {
    const response = await axios.get("https://api.api-onepiece.com/fruits")
    return response?.data
}

let transform = (data) => {
    return data.map((fruit) => {
        return {
            id : fruit?.id,
            name: fruit?.roman_name,
            type: fruit?.type
        }
    })
}

let load = async (data) => {

    await postgres.clearTable("fruit")

    let client = await postgres.connect()

    for (const fruit of data) {
        await client.query('insert into fruit values ($1, $2, $3)', [fruit.id, fruit.name, fruit.type])
    }

    await client.end()
}

module.exports = { process };