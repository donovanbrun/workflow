import { stringify } from 'csv-stringify';
import fs from 'fs';
import { Component } from "../../core/Component";

export default class CsvLoader<T> implements Component<T, T> {
    path: string;
    columns: string[];

    constructor(config: {
        path: string;
        columns: string[];
    }) {
        this.path = config.path;
        this.columns = config.columns;
    }

    process(data: T[]): Promise<T[]> {
        const writableStream = fs.createWriteStream(this.path)
        const stringifier = stringify({ header: true, columns: this.columns })
        data.forEach((element: any) => {
            stringifier.write(element)
        });

        stringifier.pipe(writableStream)
        stringifier.end()
        return Promise.resolve(data);
    }
}