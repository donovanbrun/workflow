import axios from "axios";
import { log } from "../../utils/log";
import Component from "../Component";

export default class HttpExtractor<T> implements Component<T, T> {

    constructor(private config: {
        url: string;
        root: string | "";
    }) { }

    async process(): Promise<T[]> {
        const data = await axios.get(this.config.url)
            .then((res) => this.config.root.length > 0 ? res.data[this.config.root] : res.data)
            .catch((e) => {
                log("ERROR", e);
            });
        return data;
    }
}