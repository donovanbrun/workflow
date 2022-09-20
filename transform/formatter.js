module.exports= { 
    notion2organizr: (notionTask) => {
        return {
            userId: "Donovan",
            creationDate: notionTask?.created_time,
            modificationDate: notionTask?.last_edited_time,
            name: notionTask.properties?.Nom?.title[0]?.plain_text,
            deadline: notionTask.properties?.Date?.date?.start,
            status: notionTask.properties?.Statut?.select?.name,
            description: ""
        }
    },

    organizr2notion: (organizrTask) => {
        return {}
    }
}