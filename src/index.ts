import express from 'express';
import cron from 'node-cron';
import { config } from "./config/config";
import * as onePiece from './onePiece/one-piece';
import * as optc from './optc/one-piece-treasure-cruise';
import * as syncNotionOrganizr from './syncNotionOrganizr/sync-notion-organizr';
import { log } from "./utils/log";

const app = express();
const test = config.test == "true";

const pipelines = [
    {
        name: "sync-notion-organizr",
        description: "Import of notion tasks into organizr database",
        process: syncNotionOrganizr,
        cron: '*/10 * * * *'
    },
    {
        name: "one-piece",
        description: "Fetch one piece devil fruits and store them in a db",
        process: onePiece,
        cron: '*/10 * * * *'
    },
    {
        name: "one-piece-treasure-cruise",
        description: "Fetch one piece characters and store to a json file and to mongodb",
        process: optc,
        cron: '*/10 * * * *'
    },
]

if (test) {
    console.log("TEST");
    testAll();
}
else {
    pipelines.forEach(pipeline => {
        cron.schedule(pipeline?.cron, () => {
            log('INFO', pipeline?.name + " started by cron")
            pipeline?.process?.process()
        })
        log('INFO', pipeline?.name + " schedule on : " + pipeline?.cron)

        app.post('/api/' + pipeline?.name, function (req: any, res: any) {
            pipeline?.process?.process()
            return res.send(pipeline?.name + ' started')
        })
        log('INFO', pipeline?.name + " api create on : " + '/api/' + pipeline?.name)
    })

    app.post('/list/', function (req: any, res: any) {
        return res.send(pipelines.map(pipeline => { return { name: pipeline.name, description: pipeline.description } }))
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