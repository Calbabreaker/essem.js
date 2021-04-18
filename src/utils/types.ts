export type AnyCtor<T> = new (...args: any[]) => T;
export type ArrayCtor<T> = new (...items: T[]) => T[];

declare global {
    interface Window {
        __ESSEM__: boolean;
        ESSEM: { [key: string]: unknown };
    }
}
