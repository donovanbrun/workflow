import { Client } from "@notionhq/client";
import { Configuration, Extractor, Loader, Pipeline, Transformer, csv, log, postgres } from "workflow-etl";
import Task from "./model/task";

class CustomExtractor extends Extractor<any> {

    constructor(config: Configuration) {
        super(config);
    }

    async extract(): Promise<any[]> {
        const notion = new Client({ auth: this.config.notion.notion_secret });
        let tasks: any[] = [];
        let res: any;
        do {
            res = await notion.databases
                .query(
                    {
                        database_id: this.config.notion.notion_database_id,
                        start_cursor: res?.next_cursor,
                        sorts: [
                            {
                                "property": "ID",
                                "direction": "ascending"
                            }
                        ]
                    }
                );
            log("INFO", `Extracted : ${res.results.length} tasks`);
            tasks = tasks.concat(res.results);
        } while (res?.has_more);
        log("INFO", `Total extracted : ${tasks.length} tasks`);
        return tasks;
    }
}

class CustomTransformer extends Transformer<any, Task> {
    transform(notionTasks: any[]): Task[] {
        const ingestionDate = new Date();
        const res = notionTasks.map((t: any) => {
            return {
                id: t?.id,
                userId: t?.created_by?.id,
                creationDate: t?.created_time,
                modificationDate: t?.last_edited_time,
                name: t.properties?.Nom?.title[0]?.plain_text,
                deadline: t.properties?.Date?.date?.start,
                status: t.properties?.Statut?.select?.name,
                description: "",
                ingestionDate,
            };
        });
        log("INFO", `Transformed ${res.length} tasks`);
        return res;
    }
}

class CustomLoaderDB extends Loader<Task> {

    constructor(config: Configuration) {
        super(config);
    }

    async load(tasks: Task[]) {

        await postgres.clearTable(this.config, "postgres", "notion_task");
        let client = await postgres.connect(this.config, "postgres");

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
    }
}

class CustomLoaderCSV extends Loader<Task> {

    constructor(config: any) {
        super(config);
    }

    async load(tasks: Task[]) {
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
                "ingestion_date"
            ],
            tasks
        );
    }
}

export default class syncNotionOrganizr extends Pipeline<any, Task> {

    getExtractors(): Extractor<any>[] {
        return [
            new CustomExtractor(this.config),
        ];
    }

    getTransformers(): Transformer<any, Task>[] {
        return [
            new CustomTransformer(this.config),
        ];
    }

    getLoaders(): Loader<Task>[] {
        return [
            new CustomLoaderDB(this.config),
            new CustomLoaderCSV(this.config),
        ];
    }
}