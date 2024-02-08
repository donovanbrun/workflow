import { log } from "../utils/log";
import Configuration from "./Configuration";
import Extractor from "./extractors/Extractor";
import Loader from "./loaders/Loader";
import Transformer from "./transformers/Transformer";

export default abstract class Pipeline<T, U> {
    config: any;
    name: string;

    constructor(name: string, config: Configuration) {
        this.name = name;
        this.config = config;
    }

    async process() {
        try {
            log("INFO", `[${this.name}] started`);
            let data = await this.extract();
            let res = this.transform(data);
            await this.load(res);
            log("INFO", `[${this.name}] done`);
        }
        catch (e: any) {
            log("ERROR", `[${this.name}] failed`);
            log('ERROR', e);
        }
    }

    abstract getExtractors(): Extractor<T>[];
    abstract getTransformers(): Transformer<T, U>[];
    abstract getLoaders(): Loader<U>[];

    async extract(): Promise<T[]> {
        let data: T[] = [];
        const extractors = this.getExtractors();
        const extractedDataAll = await Promise.all(
            extractors.map((extractor) => {
                return extractor.extract();
            })
        )
        extractedDataAll.forEach((extractedData) => {
            data = data.concat(extractedData);
        });
        log("INFO", this.name + ` - Extracted ${data.length} items`);
        return data;
    }

    transform(data: T[]): U[] {
        let res: U[] = [];
        for (const transformer of this.getTransformers()) {
            res = transformer.transform(data);
        }
        log("INFO", this.name + ` - Transformed ${res.length} items`);
        return res;
    }

    async load(data: U[]) {
        const loaders = this.getLoaders();
        await Promise.all(
            loaders.map((loader) => {
                return loader.load(data);
            })
        ).catch((e) => {
            log("ERROR", e);
        }).then(() => {
            log("INFO", this.name + ` - Loaded ${data.length} items`);
        });
    }
}