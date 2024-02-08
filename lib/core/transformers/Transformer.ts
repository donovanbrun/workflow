import Configuration from "../Configuration";

export default abstract class Transformer<T, U> {

    config: any;

    constructor(config: Configuration) {
        this.config = config;
    }

    abstract transform(data: T[]): U[];
}