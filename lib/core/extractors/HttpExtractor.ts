import axios from "axios";
import { log } from "../../utils/log";
import Configuration from "../Configuration";
import Extractor from "./Extractor";

export default class HttpExtractor<T> extends Extractor<T> {

    url: string;

    constructor(config: Configuration, url: string) {
        super(config);
        this.url = url;
    }

    async extract(): Promise<T[]> {
        const data = await axios.get(this.url)
            .then((res) => res.data)
            .catch((e) => {
                log("ERROR", e);
            });
        return data;
    }
}