import Configuration from "../Configuration";

export default abstract class Extractor<T> {

    config: any;

    constructor(config: Configuration) {
        this.config = config;
    }

    abstract extract(): Promise<T[]>;
}