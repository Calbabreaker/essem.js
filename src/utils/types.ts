export type AnyCtor<T> = new (...args: any[]) => T;
export type ArrayCtor<T> = new (...items: T[]) => T[];
export type Dict<T> = { [key: string]: T };
export type ArrayTypes = boolean[] | number[] | TypedArrayTypes;
export type TypedArrayTypes =
    | Float32Array
    | Float64Array
    | Uint8Array
    | Uint16Array
    | Uint32Array
    | Int8Array
    | Int16Array
    | Int32Array;

declare global {
    interface Window {
        __ESSEM__: boolean;
        ESSEM: { [key: string]: unknown };
    }
}
