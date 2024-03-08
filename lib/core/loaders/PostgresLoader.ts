import { postgres } from "../../../lib/utils";
import Component from "../Component";

export default class PostgresLoader implements Component<any,any> {

    constructor(private config: {
        host: string;
        port: string;
        user: string;
        password: string;
        database: string;
        table: string;
        columns: string[];
    }) {}

    async process(data: any[]): Promise<any> {
        await postgres.clearTable(this.config.host, this.config.port, this.config.user, this.config.password, this.config.database, this.config.table)
        let client = await postgres.connect(this.config.host, this.config.port, this.config.user, this.config.password, this.config.database)

        for (const d of data) {
            await client.query(`insert into ${this.config.table} values (${this.config.columns.map((c, i) => `$${i + 1}`).join(',')})`, Object.values(d));
        }

        await client.end()
    }
}