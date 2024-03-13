import Component from "../../core/Component";
import * as fs from 'fs';

export default class JsonExtractor<T> implements Component<T, T> {

    constructor(private config: {
        path: string;
        root: string | "";
    }) { }

    async process(): Promise<T[]> {
        const data = fs.readFileSync(this.config.path, 'utf8');
        const jsonData = JSON.parse(data);
        if (this.config.root.length > 0 && jsonData[this.config.root]) {
            return jsonData[this.config.root] as T[];
        }
        else {
            return jsonData as T[];
        }
    }
}