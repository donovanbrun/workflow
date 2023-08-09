import { config } from "../config/config";
import fs from 'fs';
const { stringify } = require("csv-stringify")

export function writeCSV(filename: string, columns: string[], data: any) {
    const writableStream = fs.createWriteStream(config.output + filename)
    const stringifier = stringify({ header: true, columns: columns })
    data.forEach((element: any) => {
        stringifier.write(element)
    });

    stringifier.pipe(writableStream)
}