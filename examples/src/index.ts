import express from 'express';
import 'module-alias/register';
import cron from 'node-cron';
import { log, Orchestrator } from "workflow-etl";
import { globalConfig } from "./config/global";
import OnePiece from './onePiece/one-piece';
import Optc from './optc/optc';
import SyncNotionOrganizr from './syncNotionOrganizr/sync-notion-organizr';

const app = express();
const test = globalConfig.test == "true";

const router = express.Router();
app.use(router);

// Basic auth
app.use((req, res, next) => {
    const auth = { login: globalConfig.auth.login, password: globalConfig.auth.password }
    const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
    const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':')
    if (login && password && login === auth.login && password === auth.password) {
        return next()
    }
    res.sendStatus(401);
})

const orchestrators: Orchestrator[] = [
    new Orchestrator(
        "sync-notion-organizr",
        "Import of notion tasks into organizr database",
        SyncNotionOrganizr,
        require('./syncNotionOrganizr/controller'),
        "/api/data/tasks",
        '* 0 * * *',
        globalConfig
    ),
    new Orchestrator(
        "one-piece",
        "Fetch one piece devil fruits and store them in a db",
        OnePiece,
        null,
        "",
        '* 0 * * *',
        globalConfig
    ),
    new Orchestrator(
        "optc",
        "Fetch one piece characters and store to a json file and to mongodb",
        Optc,
        require('./optc/controller'),
        "/api/data/optc",
        '* 0 * * *',
        globalConfig
    ),
]

if (test) {
    console.log("TEST");
    testAll();
}
else {
    orchestrators.forEach((orchestrator: Orchestrator) => {
        const pipeline = orchestrator.process;
        cron.schedule(orchestrator?.cron, () => {
            log('INFO', orchestrator?.name + " started by cron")
            pipeline.process()
        })
        log('INFO', orchestrator?.name + " schedule on : " + orchestrator?.cron)

        app.post('/api/job/' + orchestrator?.name, function (req: any, res: any) {
            pipeline.process()
            return res.send(orchestrator?.name + ' started')
        })
        log('INFO', orchestrator?.name + " api create on : " + '/api/job/' + orchestrator?.name)

        if (orchestrator?.controller) {
            router.use(orchestrator?.path, orchestrator?.controller);
        }
    })

    app.get('/api/list/', function (req: any, res: any) {
        return res.send(orchestrators.map(orchestrator => {
            return {
                name: orchestrator.name,
                description: orchestrator.description,
                pipeline: '/api/job/' + orchestrator.name,
                controller: orchestrator.path,
            }
        }))
    })

    app.listen('4000', function () {
        log('INFO', 'Server listening on port 4000')
    })
}

async function testAll() {
    const syncNotionOrganizr = new SyncNotionOrganizr("sync-notion-organizr", globalConfig);
    const onePiece = new OnePiece("one-piece", globalConfig);
    const optc = new Optc("optc", globalConfig);
    await syncNotionOrganizr.process();
    await onePiece.process();
    await optc.process();
}
