import axios from "axios";
import { LogType, log } from "../../utils/log";
import { Component } from "../../core/Component";

export default class HttpExtractor<T> implements Component<T, T> {

    constructor(private config: {
        url: string;
        root: string | "";
        headers: any,
    }) { }

    async process(): Promise<T[]> {
        const data = await axios.get(this.config.url, this.config.headers ? { headers: this.config.headers } : {})
            .then((res) => this.config.root.length > 0 ? res.data[this.config.root] : res.data)
            .catch((e) => {
                log(LogType.ERROR, e);
                throw new Error("HttpExtractor failed");
            });
        return data;
    }
}