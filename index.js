const extract = require('./extract/extract');
const formatter = require('./transform/formatter');
const load = require('./load/load');
const fs = require('fs');
const cron = require('node-cron');

var lastCron = null;
const tasksFilePath = './data/tasks.json';
const tasksFile = JSON.parse(fs.readFileSync(tasksFilePath));

const secretFile = JSON.parse(fs.readFileSync("./secrets.json"));
const secret = secretFile["secret"];
const databaseId = secretFile["databaseId"];

pipeline = async () => {
    var notion_task = await extract.getNotionTasks(secret, databaseId);
    //var organizr_task = await extract.getOrganizrTasks();

    var allTask = [];
    tasksFile.forEach(task => allTask.push(task));
    
    notion_task.forEach((taskNotion) => {
        if (tasksFile.filter(task => task.idNotion == taskNotion.id).length === 0) {
            // AJOUT TACHE
            console.log("Ajout idNotion : " + taskNotion.id);
            let formated_task = formatter.notion2organizr(taskNotion);
            load.addOrganizrTask(formated_task).then(newTaskOrganizr => {
                tasksFile.push({
                    idNotion: taskNotion.id,
                    idOrganizr: newTaskOrganizr.data.id,
                    modificationDate: taskNotion?.last_edited_time
                })
                fs.writeFileSync(tasksFilePath, '');
                fs.writeFileSync(tasksFilePath, JSON.stringify(tasksFile));
            })
        }
        else {
            // MODIFICATION TACHE
            console.log("Modification idNotion : " + taskNotion.id);
            let formated_task = formatter.notion2organizr(taskNotion);
            let idOrganizr = tasksFile.filter(task => task.idNotion == taskNotion.id)[0].idOrganizr;
            formated_task = {
                id: idOrganizr,
                modificationDate: taskNotion?.last_edited_time,
                ...formated_task
            }
            load.updateOrganizrTask(formated_task);
        }

        allTask.splice(allTask.findIndex(deletedTask => deletedTask.idNotion == taskNotion.id), 1);
    });

    // SUPPRESSION TACHE
    allTask.forEach(task => {
        console.log("Suppression idOrganizr : " + task.idOrganizr);
        load.deleteOrganizrTask(task.idOrganizr).then(() => {
            tasksFile.splice(tasksFile.findIndex(t => t.idOrganizr == task.idOrganizr), 1);
            fs.writeFileSync(tasksFilePath, '');
            fs.writeFileSync(tasksFilePath, JSON.stringify(tasksFile));
        })
    })
}

cron.schedule('0 * * * *', () => {
    let date = new Date();
    console.log(date);
    pipeline();
    lastCron = date;
});

pipeline();