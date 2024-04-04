import { DataComponent, processComponent, Component } from "lib/core/Component";

export default class MergeAdapter implements Component<any, any> {

    constructor(
        private components: DataComponent<any, any>[],
        private mergeFunction: (data: any[][]) => any[] = (data: any[][]) => data.flat()
    ) { }

    async process(data: any[]): Promise<any[]> {
        const res = Promise.all(this.components.map(async (component) => {
            return await processComponent(component, data);
        }));

        return this.mergeFunction(await res);
    }
}