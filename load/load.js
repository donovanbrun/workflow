const axios = require('axios');

module.exports= { 

    addOrganizrTask: (organizrTask) => {
        return axios.post('http://localhost:8080/api/task/add', organizrTask);
    },

    updateOrganizrTask: (organizrTask) => {
        return axios.put('http://localhost:8080/api/task/update', organizrTask);
    },

    deleteOrganizrTask: (organizrTaskId) => {
        return axios.delete('http://localhost:8080/api/task/delete/'+organizrTaskId);
    }
}