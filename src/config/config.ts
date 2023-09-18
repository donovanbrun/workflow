require('dotenv').config();

export const config = {
    test: process.env.TEST ?? true,
    output: process.env.OUTPUT ?? './data/',
    notion: {
        notion_secret: process.env.NOTION_SECRET ?? "",
        notion_database_id: process.env.NOTION_DB ?? "",
    },
    postgres: {
        host: process.env.DB_HOST ?? "localhost",
        user: process.env.DB_USER ?? "postgres",
        password: process.env.DB_PASSWORD ?? "postgres",
        port: process.env.DB_PORT ?? 5432,
    },
    mongodb: {
        url: process.env.MONGO_URL ?? "mongodb://localhost:27017",
    }
}