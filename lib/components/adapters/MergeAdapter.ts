import Component from "../../core/Component";
import { DataComponent } from "../../core/Pipeline";

export default class MergeAdapter implements Component<any, any> {

    constructor(private components: DataComponent[]) { }

    async process(): Promise<any[]> {
        let data: any[] = [];

        try {
            const res = Promise.all(this.components.map(async (component) => {
                if (typeof component === 'function')
                    return await component(data);
                else if ((component as Component<any, any>).process !== undefined)
                    return await (component as Component<any, any>).process(data);
                else
                    throw new Error("Invalid component");
            }));

            return (await res).flat();
        }
        catch (e) {
            console.error(e);
            return [];
        }
    }
}