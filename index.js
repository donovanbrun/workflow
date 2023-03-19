var express = require('express')
var app = express()
const cron = require('node-cron')
const config = require("./src/config/config")
const log = require("./src/utils/log").log

const test = config.test == "true" ? true : false

const syncNotionOrganizr = require('./src/syncNotionOrganizr/sync-notion-organizr')
const onePiece = require('./src/onePiece/one-piece')

const workflows = [
    {
        name: "sync-notion-organizr",
        description: "Import of notion tasks into organizr database",
        workflow: syncNotionOrganizr,
        cron: '* * * * *'
    },
    {
        name: "one-piece",
        description: "Fetch one piece devil fruits and store them in a db",
        workflow: onePiece,
        cron: '* * * * *'
    },
]

if (!test) {

    workflows.forEach(w => {
        cron.schedule(w?.cron, () => {
            log('INFO', w?.name + " started by cron")
            w?.workflow?.process()
        })
        log('INFO', w?.name + " schedule on : " + w?.cron)

        app.post('/api/' + w?.name, function (req, res) {
            w?.workflow?.process()
            return res.send(w?.name + ' started')
        })
        log('INFO', w?.name + " api create on : " + '/api/' + w?.name)
    })

    app.post('/list/', function (req, res) {
        return res.send(workflows.map(w => {return {name: w.name, description: w.description}}))
    })
    
    app.listen('4000', function() {
        log('INFO', 'Server listening on port 4000')
    })
}
else {
    console.log("TEST")
    syncNotionOrganizr.process()
    onePiece.process()
}