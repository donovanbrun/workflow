const { Client } = require('@notionhq/client');
const axios = require('axios');

module.exports= { 
    getNotionTasks: async (secretKey, databaseId) => {
        const notion = new Client({ auth: secretKey });
        const response = await notion.databases.query({ database_id: databaseId });
        return response?.results;
    },

    getOrganizrTasks: async () => {
        const response = await axios.get('http://localhost:8080/api/task/user/Donovan');
        return response?.data;
    }
}