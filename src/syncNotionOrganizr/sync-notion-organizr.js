const config = require('../config/config')
const { Client } = require('@notionhq/client')
const postgres = require('../utils/postgres')
const csv = require('../utils/csv')
const { v4: uuid } = require('uuid')
const log = require("../utils/log").log

async function process() {
    try  {
        var notion_tasks = await extract(config.notion.notion_secret, config.notion.notion_database_id)
        var tasks = transform(notion_tasks)
        await load(tasks)
    }
    catch(e) {
        log('ERROR', e)
    }
}

let extract = async (secretKey, databaseId) => {
    const notion = new Client({ auth: secretKey })
    const response = await notion.databases.query({ database_id: databaseId }).catch(err => console.log(err))
    return response?.results
}

let transform = (notionTasks) => {
    return notionTasks.map(t => {
        return {
            id: uuid(),
            userId: undefined,
            creationDate: t?.created_time,
            modificationDate: t?.last_edited_time,
            name: t.properties?.Nom?.title[0]?.plain_text,
            deadline: t.properties?.Date?.date?.start,
            status: t.properties?.Statut?.select?.name,
            description: ""
        }
    })
}

let load = async (tasks) => {

    await postgres.clearTable('postgres', 'notion_task')
    let client = await postgres.connect('postgres')

    for (const t of tasks) {
        await client.query('insert into notion_task (id, user_id, creation_date, modification_date, deadline, description, name, status) values ($1, $2, $3, $4, $5, $6, $7, $8)', [t.id, t.userId, t.creationDate, t.modificationDate, t.deadline, t.description, t.name, t.status])
    }

    await client.end()

    csv.writeCSV("notion_tasks.csv", ["id", "user_id", "creation_date", "modification_date", "deadline", "description", "name", "status"], tasks)
}

module.exports= {process}