import { mongodb } from "../../utils";
import { Component } from "../../core/Component";

export default class MongoDBLoader<T> implements Component<T, T> {

    constructor(private config: {
        url: string;
        database: string;
        collection: string;
        clearCollection: boolean;
    }) { }

    async process(data: T[]): Promise<T[]> {
        if (this.config.clearCollection)
            await mongodb.clearCollection(this.config.url, this.config.database, this.config.collection);

        await mongodb.insertMany(this.config.url, data, this.config.database, this.config.collection);
        return data;
    }
}