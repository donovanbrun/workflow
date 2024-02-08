import { stringify } from 'csv-stringify';
import fs from 'fs';

export function writeCSV(config: any, filename: string, columns: string[], data: any) {
    const writableStream = fs.createWriteStream(config.output + filename)
    const stringifier = stringify({ header: true, columns: columns })
    data.forEach((element: any) => {
        stringifier.write(element)
    });

    stringifier.pipe(writableStream)
}