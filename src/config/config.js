require('dotenv').config();

module.exports = {
    test: process.env.TEST,
    output: process.env.OUTPUT,
    notion: {
        notion_secret: process.env.NOTION_SECRET,
        notion_database_id: process.env.NOTION_DB,
    },
    postgres: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
    }
}