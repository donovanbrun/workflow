import axios from "axios";
import { log } from "../utils/log";
import * as postgres from "../utils/postgres";
import DevilFruit from "./model/DevilFruit";
import DevilFruitApi from "./model/DevilFruitApi";

export async function process() {
    try {
        let data = await extract()
        data = transform(data)
        await load(data)
        log("INFO", "one-piece done");
    }
    catch (e: any) {
        log("ERROR", "one-piece failed");
        log('ERROR', e);
    }
}

let extract = async () => {
    const response = await axios.get("https://api.api-onepiece.com/fruits")
    return response?.data
}

let transform = (data: DevilFruitApi[]): DevilFruit[] => {
    return data.map((fruit) => {
        return {
            id: fruit?.id,
            name: fruit?.roman_name,
            type: fruit?.type
        }
    })
}

let load = async (data: DevilFruit[]) => {

    await postgres.clearTable('findfindnomi', 'fruit')
    let client = await postgres.connect('findfindnomi')

    for (const fruit of data) {
        await client.query('insert into fruit values ($1, $2, $3)', [fruit.id, fruit.name, fruit.type])
    }

    await client.end()
}

module.exports = { process };