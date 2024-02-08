import { Configuration } from "workflow-etl";

require('dotenv').config();

class GlobalConfig extends Configuration {
    test = process.env.TEST ?? true;
    output = process.env.OUTPUT ?? './data/';
    notion = {
        notion_secret: process.env.NOTION_SECRET ?? "",
        notion_database_id: process.env.NOTION_DB ?? "",
    };
    postgres = {
        host: process.env.DB_HOST ?? "localhost",
        user: process.env.DB_USER ?? "postgres",
        password: process.env.DB_PASSWORD ?? "postgres",
        port: process.env.DB_PORT ?? 5432,
    };
    mongodb = {
        url: process.env.MONGO_URL ?? "mongodb://localhost:27017",
    };
    auth = {
        login: process.env.AUTH_LOGIN ?? "",
        password: process.env.AUTH_PASSWORD ?? "",
    };
}

export const globalConfig = new GlobalConfig();