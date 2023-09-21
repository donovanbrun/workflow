export default interface Pipeline {
    config: any;

    process(): Promise<any>;
}