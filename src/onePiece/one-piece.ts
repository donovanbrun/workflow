import axios from "axios";
import Pipeline from "../Pipeline";
import { log } from "../utils/log";
import * as postgres from "../utils/postgres";
import DevilFruit from "./model/DevilFruit";
import DevilFruitApi from "./model/DevilFruitApi";

export default class OnePiece implements Pipeline {

    config;

    constructor(config: any) {
        this.config = config;
    }

    async process() {
        try {
            let data = await this.extract()
            data = this.transform(data)
            await this.load(data)
            log("INFO", "one-piece done");
        }
        catch (e: any) {
            log("ERROR", "one-piece failed");
            log('ERROR', e);
        }
    }

    async extract() {
        const response = await axios.get("https://api.api-onepiece.com/fruits")
        return response?.data
    }

    transform(data: DevilFruitApi[]): DevilFruit[] {
        return data.map((fruit) => {
            return {
                id: fruit?.id,
                name: fruit?.roman_name,
                type: fruit?.type
            }
        })
    }

    async load(data: DevilFruit[]) {

        await postgres.clearTable(this.config, 'findfindnomi', 'fruit')
        let client = await postgres.connect(this.config, 'findfindnomi')

        for (const fruit of data) {
            await client.query('insert into fruit values ($1, $2, $3)', [fruit.id, fruit.name, fruit.type])
        }

        await client.end()
    }
}