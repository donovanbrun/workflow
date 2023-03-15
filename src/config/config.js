require('dotenv').config();

module.exports = {
    secret: process.env.NOTION_SECRET,
    databaseId: process.env.NOTION_DB,
}