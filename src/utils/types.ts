export type AnyConstructor<T> = new (...args: any[]) => T;
export type ArrayConstructor<T> = new (...items: T[]) => T[];
export type Dictionary<T> = { [key: string]: T };
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ESSEM: { [key: string]: any };
    }
}
