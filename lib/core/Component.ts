export default interface Component<T, U> {
    process(data: T[]): Promise<U[]>;
}