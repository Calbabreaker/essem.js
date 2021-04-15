export type AnyCtor<T> = new (...args: any[]) => T;

declare global {
    interface Window {
        __ESSEM__: boolean;
        ESSEM: { [key: string]: unknown };
    }
}
