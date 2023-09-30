import { Router } from "express";
import { globalConfig } from "../config/global";
import { log } from "../utils/log";
import * as mongodb from "../utils/mongodb";

const router = Router();

router.get('/', function (req, res) {
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