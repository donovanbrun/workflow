import { Component } from "../../core/Component";

export default class JsonLoader<T> implements Component<T, T> {
    path: string;

    constructor(config: {
        path: string;
    }) {
        this.path = config.path;
    }

    process(data: T[]): Promise<T[]> {
        const fs = require('fs');
        fs.writeFileSync(this.path, JSON.stringify(data), 'utf-8');
        return Promise.resolve(data);
    }
}