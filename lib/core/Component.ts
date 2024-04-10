/**
 * Interface to implement to create a component.
 * The pipeline will call the process method with the data to process.
 */
export interface Component<T, U> {
    process(data: T[]): Promise<U[]>;
}

export type DataComponent<T, U> = Component<T, U> | ((data: T[]) => U[]);

export const processComponent = async<T, U>(component: DataComponent<T, U>, data: T[]): Promise<U[]> => {
    if (typeof component === 'function')
        return await component(data);
    else if ((component as Component<any, any>).process !== undefined)
        return await (component as Component<any, any>).process(data);
    else
        throw new Error("Invalid component");
}