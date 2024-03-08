import Component from "../Component";
import { DataComponent } from "../pipeline/Pipeline";

export default class ParallelizeAdapter implements Component<any, any> {

    constructor(private components: DataComponent[]) { }

    async process(data: any[]): Promise<any[]> {
        let res: any[] = [];

        try {
            const res = Promise.all(this.components.map(async (component) => {
                if (typeof component === 'function')
                    return component(data);
                else if ((component as Component<any, any>).process !== undefined)
                    return await (component as Component<any, any>).process(data);
                else
                    throw new Error("Invalid component");
            }))

            return (await res).flat();
        }
        catch (e) {
            console.error(e);
            return [];
        }
    }
}