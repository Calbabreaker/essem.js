export type AnyCtor<T> = new (...args: any[]) => T;

declare global {
    interface Window {
        ESSEM: Record<string, unknown> | undefined;
    }
}
