import axios from "axios";
import { Configuration, Extractor, Loader, Pipeline, Transformer as Transformer_, log, postgres } from "workflow-etl";
import DevilFruit from "./model/DevilFruit";
import DevilFruitApi from "./model/DevilFruitApi";

class CustomExtractor extends Extractor<DevilFruitApi> {

    constructor(config: Configuration) {
        super(config);
    }

    async extract(): Promise<DevilFruitApi[]> {
        const response = await axios.get("https://api.api-onepiece.com/fruits")
        return response?.data
    }
}

class CustomTransformer extends Transformer_<DevilFruitApi, DevilFruit> {
    transform(data: DevilFruitApi[]): DevilFruit[] {
        const res = data.map((fruit) => {
            return {
                id: fruit?.id,
                name: fruit?.roman_name,
                type: fruit?.type
            }
        })
        log("INFO", `Transformed ${res.length} devil fruits`);
        return res;
    }
}

class CustomLoader extends Loader<DevilFruit> {

    constructor(config: Configuration) {
        super(config);
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

export default class OnePiece extends Pipeline<DevilFruitApi, DevilFruit> {

    getExtractors(): Extractor<DevilFruitApi>[] {
        return [
            new CustomExtractor(this.config)
        ];
    }

    getTransformers(): any[] {
        return [
            new CustomTransformer(this.config)
        ];
    }

    getLoaders(): Loader<DevilFruit>[] {
        return [
            new CustomLoader(this.config)
        ];
    }
}