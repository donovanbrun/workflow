import { postgres } from "../../utils";
import Component from "../../core/Component";

export default class PostgresLoader<T> implements Component<T, T> {

    constructor(private config: {
        host: string;
        port: string;
        user: string;
        password: string;
        database: string;
        table: string;
        columns: string[];
        clearTable: boolean;
    }) { }

    async process(data: T[]): Promise<T[]> {
        if (this.config.clearTable)
            await postgres.clearTable(this.config.host, this.config.port, this.config.user, this.config.password, this.config.database, this.config.table)

        let client = await postgres.connect(this.config.host, this.config.port, this.config.user, this.config.password, this.config.database)

        for (const d of data) {
            await client.query(`insert into ${this.config.table} values (${this.config.columns.map((c, i) => `$${i + 1}`).join(',')})`, Object.values(d as any));
        }

        await client.end()

        return data;
    }
}