import express from 'express';
import cron from 'node-cron';
import { config } from "./config/config";
import * as onePiece from './onePiece/one-piece';
import * as optc from './optc/one-piece-treasure-cruise';
import * as syncNotionOrganizr from './syncNotionOrganizr/sync-notion-organizr';
import { log } from "./utils/log";

const app = express();
const test = config.test == "true";

const workflows = [
    {
        name: "sync-notion-organizr",
        description: "Import of notion tasks into organizr database",
        workflow: syncNotionOrganizr,
        cron: '*/10 * * * *'
    },
    {
        name: "one-piece",
        description: "Fetch one piece devil fruits and store them in a db",
        workflow: onePiece,
        cron: '*/10 * * * *'
    },
    {
        name: "one-piece-treasure-cruise",
        description: "Fetch one piece characters and store to a json file and to mongodb",
        workflow: optc,
        cron: '*/10 * * * *'
    },
]

if (test) {
    console.log("TEST");
    testAll();
}
else {
    workflows.forEach(w => {
        cron.schedule(w?.cron, () => {
            log('INFO', w?.name + " started by cron")
            w?.workflow?.process()
        })
        log('INFO', w?.name + " schedule on : " + w?.cron)

        app.post('/api/' + w?.name, function (req: any, res: any) {
            w?.workflow?.process()
            return res.send(w?.name + ' started')
        })
        log('INFO', w?.name + " api create on : " + '/api/' + w?.name)
    })

    app.post('/list/', function (req: any, res: any) {
        return res.send(workflows.map(w => { return { name: w.name, description: w.description } }))
    })

    app.listen('4000', function () {
        log('INFO', 'Server listening on port 4000')
    })
}

async function testAll() {
    await syncNotionOrganizr.process();
    await onePiece.process();
    await optc.process();
}

module.exports = {};