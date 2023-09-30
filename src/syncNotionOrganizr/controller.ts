import { Router } from "express";
import { globalConfig } from "../config/global";
import { log } from "../utils/log";
import * as postgres from "../utils/postgres";
import Task from "./model/task";

const router = Router();

router.get('/', async function (req, res) {
    try {
        let results = await postgres.getTable(globalConfig, "postgres", "notion_task");
        const tasks: Task[] = results.map((t: any) => {
            return {
                id: t.id.toString(),
                userId: t.user_id,
                creationDate: t.creation_date,
                modificationDate: t.modification_date,
                name: t.name,
                deadline: t.deadline,
                status: t.status,
                description: t.description,
                ingestionDate: t.ingestion_date,
            };
        });
        res.send(tasks);
    }
    catch (err: any) {
        log("ERROR", err.toString());
        res.status(500).send(err.toString());
    }
});

module.exports = router;