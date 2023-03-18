require('dotenv').config();

module.exports = {
    notion_secret: process.env.NOTION_SECRET,
    notion_database_id: process.env.NOTION_DB,
    organizr_api: process.env.ORGANIZR_API,
}