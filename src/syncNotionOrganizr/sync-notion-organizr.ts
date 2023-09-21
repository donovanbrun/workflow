import { Client } from "@notionhq/client";
import { v4 as uuid } from "uuid";
import Pipeline from "../Pipeline";
import * as csv from "../utils/csv";
import { log } from "../utils/log";
import * as postgres from "../utils/postgres";
import Task from "./model/task";

export default class syncNotionOrganizr implements Pipeline {

    config;

    constructor(config: any) {
        this.config = config;
    }

    async process() {
        try {
            var notion_tasks = await this.extract(
                this.config.notion.notion_secret,
                this.config.notion.notion_database_id
            ).catch((err: any) => { throw err; });
            var tasks = this.transform(notion_tasks);
            await this.load(tasks).catch((err: any) => { throw err; });
            log("INFO", "sync-notion-organizr done");
        } catch (e: any) {
            log("ERROR", "sync-notion-organizr failed");
            log("ERROR", e);
        }
    }

    async extract(secretKey: string, databaseId: string) {
        const notion = new Client({ auth: secretKey });
        const res = await notion.databases
            .query({ database_id: databaseId });
        return res.results;
    }

    transform(notionTasks: any): Task[] {
        const ingestionDate = new Date();
        return notionTasks.map((t: any) => {
            return {
                id: uuid(),
                userId: undefined,
                creationDate: t?.created_time,
                modificationDate: t?.last_edited_time,
                name: t.properties?.Nom?.title[0]?.plain_text,
                deadline: t.properties?.Date?.date?.start,
                status: t.properties?.Statut?.select?.name,
                description: "",
                ingestionDate,
            };
        });
    }

    async load(tasks: Task[]) {
        let client = await postgres.connect(this.config, "postgres").catch((err: any) => {
            throw err;
        });
        await postgres.clearTable(this.config, "postgres", "notion_task").catch((err: any) => {
            throw err;
        });

        for (const t of tasks) {
            await client.query(
                "insert into notion_task (id, user_id, creation_date, modification_date, deadline, description, name, status, ingestion_date) values ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
                [
                    t.id,
                    t.userId,
                    t.creationDate,
                    t.modificationDate,
                    t.deadline,
                    t.description,
                    t.name,
                    t.status,
                    t.ingestionDate,
                ]
            );
        }

        await client.end();

        csv.writeCSV(
            this.config,
            "notion_tasks.csv",
            [
                "id",
                "user_id",
                "creation_date",
                "modification_date",
                "deadline",
                "description",
                "name",
                "status",
            ],
            tasks
        );

        return true;
    };
}