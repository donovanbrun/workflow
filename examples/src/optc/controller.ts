import { Router } from "express";
import { log, mongodb } from "workflow-etl";
import { globalConfig } from "../config/global";

const router = Router();

router.get('/', function (req, res) {
    log("INFO", "GET optc characters");
    try {
        mongodb.fetchCollection(globalConfig, "optc", "characters").then((data) => {
            return res.send(data);
        });
    }
    catch (err: any) {
        log("ERROR", err.toString());
        res.status(500).send(err.toString());
    }
});

module.exports = router;