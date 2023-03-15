var express = require('express');
var app = express();
const cron = require('node-cron');

var syncNotionOrganizr = require('./src/workflow/sync-notion-organizr');

cron.schedule('* * * * *', () => {
    syncNotionOrganizr.sync()
});


app.post('/api/syncNotionOrganizr', function (req, res) {
    syncNotionOrganizr.sync()
    return res.send('syncNotionOrganizr started');
});

app.listen('4000', function() {
    console.log('Server listening on port 4000');
});