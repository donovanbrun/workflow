var express = require('express')
var app = express()
const cron = require('node-cron')

const test = false

const syncNotionOrganizr = require('./src/syncNotionOrganizr/sync-notion-organizr')
const onePiece = require('./src/onePiece/one-piece')

const workflows = [
    {
        name: "sync-notion-organizr",
        description: "Synchronisation of tasks between notion and organizr",
        workflow: syncNotionOrganizr,
        cron: '0 * * * *'
    },
    {
        name: "one-piece",
        description: "Fetch one piece devil fruits and store them in a db",
        workflow: onePiece,
        cron: '0 * * * *'
    },
]

if (!test) {

    workflows.forEach(w => {
        cron.schedule(w?.cron, () => {
            w?.workflow?.process()
        })
        console.log(w?.name + " schedule on : " + w?.cron)

        app.post('/api/' + w?.name, function (req, res) {
            w?.workflow?.process()
            return res.send(w?.name + ' started')
        })
        console.log(w?.name + " api create on : " + '/api/' + w?.name)
    })

    app.post('/list/', function (req, res) {
        return res.send(workflows.map(w => {return {name: w.name, description: w.description}}))
    })
    
    app.listen('4000', function() {
        console.log('Server listening on port 4000')
    })
}
else {
    onePiece.process()
}