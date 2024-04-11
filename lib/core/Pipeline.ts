import { LogType, log } from "../utils/log";
import { Component, DataComponent, processComponent } from "./Component";

/**
 * Pipeline class
 * Allows to create a pipeline of components
 */
export default class Pipeline implements Component<any, any> {

    public constructor(private components: DataComponent<any, any>[] = []) { }

    /**
     * Create a pipeline with an optional list of components
     * @param components
     * @returns a new pipeline
     */
    static create(components: DataComponent<any, any>[] = []): Pipeline {
        return new Pipeline(components);
    }

    /**
     * Add a component at the end of the pipeline
     * @param component
     * @returns the pipeline
     */
    public addComponent(component: DataComponent<any, any>): Pipeline {
        this.components.push(component);
        return this;
    }

    /**
     * Process the pipeline, 
     * @param optionalData optional list of data in entry
     * @returns the data after processing
     */
    async process(optionalData: any[] = []): Promise<any[]> {
        const start = Date.now();

        try {
            const data = await this.components.reduce(async (accPromise: Promise<any[]>, component) => {
                const acc = await accPromise;
                return processComponent(component, acc);
            }, Promise.resolve(optionalData));

            const end = Date.now();
            log(LogType.INFO, `Pipeline succeed in ${end - start}ms`);
            return data;
        }
        catch (e: any) {
            log(LogType.ERROR, e);
            const end = Date.now();
            log(LogType.INFO, `Pipeline failed in ${end - start}ms`);
            return [];
        }
    }
}