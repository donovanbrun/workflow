import Pipeline from "../core/Pipeline";
import cron from 'node-cron';

export default class Orchestrator {

    constructor(
        private name: string,
        private description: string,
        private process: Pipeline,
        private cron: string,
    ) { }

    schedule() {
        cron.schedule(this.cron, () => {
            this.process.process();
        });
    }
}