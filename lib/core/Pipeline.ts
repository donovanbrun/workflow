import { log } from "../utils/log";
import Component from "./Component";

export type DataComponent = Component<any, any> | ((data: any) => any);

export default class Pipeline {

    public constructor(public components: DataComponent[]) {
        this.components = components;
    }

    static create(components: DataComponent[]) {
        return new Pipeline(components);
    }

    async process() {
        const start = Date.now();
        let data: any[] = [];

        try {
            for (let component of this.components) {
                if (typeof component === 'function')
                    data = await component(data);
                else if ((component as Component<any, any>).process !== undefined)
                    data = await (component as Component<any, any>).process(data);
                else
                    throw new Error("Invalid component");
            }
        }
        catch (e) {
            console.error(e);
            return false;
        }

        const end = Date.now();
        log('INFO', `Pipeline finished in ${end - start}ms`);
        return true;
    }
}