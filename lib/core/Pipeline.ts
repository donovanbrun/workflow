import { LogType, log } from "../utils/log";
import { DataComponent, processComponent } from "./Component";

export default class Pipeline {

    public constructor(private components: DataComponent<any, any>[]) { }

    static create(components: DataComponent<any, any>[] = []): Pipeline {
        return new Pipeline(components);
    }

    public addComponent(component: DataComponent<any, any>): Pipeline {
        this.components.push(component);
        return this;
    }

    async process() {
        const start = Date.now();
        let data: any[] = [];

        try {
            for (let component of this.components) {
                data = await processComponent(component, data);
            }

            const end = Date.now();
            log(LogType.INFO, `Pipeline succeed in ${end - start}ms`);
            return true;
        }
        catch (e: any) {
            log(LogType.ERROR, e);
            const end = Date.now();
            log(LogType.INFO, `Pipeline failed in ${end - start}ms`);
            return false;
        }
    }
}