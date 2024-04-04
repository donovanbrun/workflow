import { DataComponent, processComponent, Component } from "lib/core/Component";

export default class SubPipelineAdapter implements Component<any, any> {

    constructor(private components: DataComponent<any, any>[]) { }

    async process(data: any[]): Promise<any[]> {
        let res: any[] = data;

        for (let component of this.components) {
            res = await processComponent(component, res);
        }
        return res;
    }
}