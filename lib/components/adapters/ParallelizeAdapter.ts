import { DataComponent, processComponent, Component } from "../../core/Component";

export default class ParallelizeAdapter implements Component<any, any> {

    constructor(private components: DataComponent<any, any>[]) { }

    async process(data: any[]): Promise<any[]> {
        const res = Promise.all(this.components.map(async (component) => {
            return await processComponent(component, data);
        }));

        return (await res).flat();
    }
}