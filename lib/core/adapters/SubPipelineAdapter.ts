import Component from "../Component";
import { DataComponent } from "../pipeline/Pipeline";

export default class SubPipelineAdapter implements Component<any, any> {

    constructor(private components: DataComponent[]) { }

    async process(data: any[]): Promise<any[]> {
        let res: any[] = [];

        try {
            for (let component of this.components) {
                if (typeof component === 'function')
                    data = component(data);
                else if ((component as Component<any, any>).process !== undefined)
                    data = await (component as Component<any, any>).process(data);
                else
                    throw new Error("Invalid component");
            }

            return res;
        }
        catch (e) {
            console.error(e);
            return res;
        }
    }
}