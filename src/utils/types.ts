export type AnyCtor<T> = new (...args: any[]) => T;
export type ArrayCtor<T> = new (...items: T[]) => T[];
export type Dict<T> = { [key: string]: T };
export type ArrayTypes = boolean[] | number[] | Float32Array | Uint32Array | Int32Array;

declare global {
    interface Window {
        __ESSEM__: boolean;
        ESSEM: { [key: string]: unknown };
    }
}
