import Configuration from "./Configuration";
import Pipeline from "./Pipeline";

export default class Orchestrator {

    name: string;
    description: string;
    process: Pipeline<any, any>;
    controller: any;
    path: string;
    cron: string;
    config: Configuration;

    constructor(name: string, description: string, process: new (name: string, config: any) => Pipeline<any, any>, controller: any, path: string, cron: string, config: any) {
        this.name = name;
        this.description = description;
        this.process = new process(name, config);
        this.controller = controller;
        this.path = path;
        this.cron = cron;
        this.config = config;
    }
}