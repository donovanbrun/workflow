import { LogType, log } from "../utils/log";
import { DataComponent, processComponent } from "./Component";

/**
 * Pipeline class
 * Allows to create a pipeline of components
 */
export default class Pipeline {

    public constructor(private components: DataComponent<any, any>[] = []) { }

    /**
     * Create a pipeline with an optional list of components
     * @param components 
     */
    static create(components: DataComponent<any, any>[] = []): Pipeline {
        return new Pipeline(components);
    }

    /**
     * Add a component at the end of the pipeline
     * @param component 
     */
    public addComponent(component: DataComponent<any, any>): Pipeline {
        this.components.push(component);
        return this;
    }

    /**
     * Process the pipeline
     */
    async process() {
        const start = Date.now();
        // let data: any[] = [];

        try {
            // for (let component of this.components) {
            //     data = await processComponent(component, data);
            // }

            const data = await this.components.reduce(async (accPromise: Promise<any[]>, component) => {
                const acc = await accPromise;
                return processComponent(component, acc);
            }, Promise.resolve([]));

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