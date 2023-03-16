const { Client } = require('@notionhq/client');
const axios = require('axios');
const config = require('../config/config')

const api_url = config.organizr_api

module.exports= { 
    
    getNotionTasks: async (secretKey, databaseId) => {
        const notion = new Client({ auth: secretKey });
        const response = await notion.databases.query({ database_id: databaseId }).catch(err => console.log(err));
        return response?.results;
    },

    getOrganizrTasks: async () => {
        const response = await axios.get(api_url+'/api/task/user/Donovan')
            .catch(function (error) {
                if (error.response) {
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                } else if (error.request) {
                    console.log(error.request);
                } else {
                    console.log('Error', error.message);
                }
                console.log(error.config);
            });
        return response?.data;
    }
}