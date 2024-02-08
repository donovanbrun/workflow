import Configuration from "../Configuration";

export default abstract class Loader<U> {

    config: any;

    constructor(config: Configuration) {
        this.config = config;
    }

    abstract load(data: U[]): any;
}