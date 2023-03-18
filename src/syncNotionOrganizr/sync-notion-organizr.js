const extract = require('./extract/extract');
const mapper = require('./transform/mapper');
const load = require('./load/load');
const config = require('../config/config');

async function process() {
    console.log("Sync Notion Organizr")

    //var notion_task = await extract.getNotionTasks(secret, databaseId)
    //var organizr_task = await extract.getOrganizrTasks()

    /*
    var allTask = [];
    tasksFile.forEach(task => allTask.push(task));
    
    notion_task.forEach((taskNotion) => {
        if (tasksFile.filter(task => task.idNotion == taskNotion.id).length === 0) {
            // AJOUT TACHE
            console.log("Ajout idNotion : " + taskNotion.id);
            let formated_task = mapper.notion2organizr(taskNotion);
            load.addOrganizrTask(formated_task).then(newTaskOrganizr => {
                tasksFile.push({
                    idNotion: taskNotion.id,
                    idOrganizr: newTaskOrganizr.data.id,
                    modificationDate: taskNotion?.last_edited_time
                })
            })
        }
        else {
            // MODIFICATION TACHE
            console.log("Modification idNotion : " + taskNotion.id);
            let formated_task = mapper.notion2organizr(taskNotion);
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
        })
    })
    */
}

module.exports= {process}