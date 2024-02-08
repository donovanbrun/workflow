import axios from "axios";
import { Configuration, Extractor, Loader, Pipeline, Transformer, csv, log, mongodb } from "workflow-etl";

class CustomExtractor extends Extractor<any> {

    constructor(config: Configuration) {
        super(config);
    }

    async extract(): Promise<any[]> {
        const data: string = await axios.get("https://raw.githubusercontent.com/optc-db/optc-db.github.io/master/common/data/units.js")
            .then((res) => res.data)
            .catch((e) => {
                console.log(e);
            })

        let startIndex = data.indexOf("window.units = [") + 15;
        let endIndex = data.indexOf("var calcGhostStartID");

        let res = data.slice(startIndex, endIndex);

        res = res.replace(/'(6\+|5\+)'/g, '"$1"');

        let lastCommaIndex = res.lastIndexOf(',');
        if (lastCommaIndex !== -1) {
            res = res.slice(0, lastCommaIndex) + res.slice(lastCommaIndex + 1);
        }

        let lastDelimiterIndex = res.lastIndexOf(';');
        if (lastDelimiterIndex !== -1) {
            res = res.slice(0, lastDelimiterIndex) + res.slice(lastDelimiterIndex + 1);
        }

        return JSON.parse(res);
    }
}

class CustomTransformer extends Transformer<any, any> {
    transform(characters: any[]): any[] {
        function idToLink(id: number) {
            const idStr = String(id).padStart(4, '0');
            const firstSegment = Math.floor(id / 1000);
            const secondSegment = (Math.floor(Math.floor(id % 1000) / 100) * 100).toString().padStart(3, '0');

            return `/${firstSegment}/${secondSegment}/${idStr}.png`;
        }

        let res: any[] = [];
        characters.forEach((character, i) => {
            res.push({
                _id: i + 1,
                name: character[0],
                rank: character[3],
                img: "https://raw.githubusercontent.com/optc-db/optc-db.github.io/master/api/images/full/transparent" + idToLink(i + 1),
            })
        });

        log("INFO", `Transformed ${res.length} characters`);
        res = res.filter((character) => character.name);
        log("INFO", `Filtered ${res.length} characters`);

        return res;
    }
}

class CustomLoader extends Loader<any> {

    constructor(config: Configuration) {
        super(config);
    }

    async load(characters: any[]) {
        if (characters.length === 0) {
            throw new Error("No characters to load");
        }

        const fs = require('fs');
        fs.writeFileSync(this.config.output + 'characters.json', JSON.stringify(characters), 'utf-8');

        csv.writeCSV(
            this.config,
            "characters.csv",
            [
                "_id",
                "name",
                "rank",
                "img",
            ],
            characters
        );

        await mongodb.clearCollection(this.config, 'optc', 'characters');
        return await mongodb.insertMany(this.config, characters, 'optc', 'characters');
    }
}

export default class OnePieceTreasureCruise extends Pipeline<any, any> {

    getExtractors(): Extractor<any>[] {
        return [
            new CustomExtractor(this.config)
        ];
    }

    getTransformers(): Transformer<any, any>[] {
        return [
            new CustomTransformer(this.config)
        ];
    }

    getLoaders(): Loader<any>[] {
        return [
            new CustomLoader(this.config)
        ];
    }
}