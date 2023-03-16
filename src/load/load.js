const axios = require('axios');
const config = require('../config/config');

const api_url = config.organizr_api

module.exports= {

    addOrganizrTask: (organizrTask) => {
        return axios.post(api_url+'/api/task/add', organizrTask)
        .catch(function (error) {
            console.log("Error when adding task : " + organizrTask.name);
        });
    },

    updateOrganizrTask: (organizrTask) => {
        return axios.put(api_url+'/api/task/update', organizrTask)
        .catch(function (error) {
            console.log("Error when updating task : " + organizrTask.name);
        });
    },

    deleteOrganizrTask: (organizrTaskId) => {
        return axios.delete(api_url+'/api/task/delete/'+organizrTaskId)
        .catch(function (error) {
            console.log("Error when deleting task : " + organizrTaskId);
        });
    }
}