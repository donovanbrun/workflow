import express from 'express';
import cron from 'node-cron';
import Pipeline from './Pipeline';
import { globalConfig } from "./config/global";
import OnePiece from './onePiece/one-piece';
import OnePieceTreasureCruise from './optc/one-piece-treasure-cruise';
import SyncNotionOrganizr from './syncNotionOrganizr/sync-notion-organizr';
import { log } from "./utils/log";

const app = express();
const test = globalConfig.test == "true";

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

const pipelines: { name: string, description: string, process: new (config: any) => Pipeline, cron: string, config: any }[] = [
    {
        name: "sync-notion-organizr",
        description: "Import of notion tasks into organizr database",
        process: SyncNotionOrganizr,
        cron: '*/10 * * * *',
        config: globalConfig
    },
    {
        name: "one-piece",
        description: "Fetch one piece devil fruits and store them in a db",
        process: OnePiece,
        cron: '*/10 * * * *',
        config: globalConfig
    },
    {
        name: "one-piece-treasure-cruise",
        description: "Fetch one piece characters and store to a json file and to mongodb",
        process: OnePieceTreasureCruise,
        cron: '*/10 * * * *',
        config: globalConfig
    },
]

if (test) {
    console.log("TEST");
    testAll();
}
else {
    pipelines.forEach(pipeline => {
        const pipelineInstance = new pipeline.process(pipeline.config);
        cron.schedule(pipeline?.cron, () => {
            log('INFO', pipeline?.name + " started by cron")
            pipelineInstance.process()
        })
        log('INFO', pipeline?.name + " schedule on : " + pipeline?.cron)

        app.post('/api/' + pipeline?.name, function (req: any, res: any) {
            pipelineInstance.process()
            return res.send(pipeline?.name + ' started')
        })
        log('INFO', pipeline?.name + " api create on : " + '/api/' + pipeline?.name)
    })

    app.get('/list/', function (req: any, res: any) {
        return res.send(pipelines.map(pipeline => { return { name: pipeline.name, description: pipeline.description } }))
    })

    app.listen('4000', function () {
        log('INFO', 'Server listening on port 4000')
    })
}

async function testAll() {
    const syncNotionOrganizr = new SyncNotionOrganizr(globalConfig);
    const onePiece = new OnePiece(globalConfig);
    const optc = new OnePieceTreasureCruise(globalConfig);
    await syncNotionOrganizr.process();
    await onePiece.process();
    await optc.process();
}
