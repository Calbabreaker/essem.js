import { AnyCtor } from "./types";

export class AssertionError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = "AssertionError";
    }
}

export function assert(condition: boolean, message?: string): asserts condition {
    if (!condition) throw new AssertionError(message);
}

export function isEmpty(obj: Record<string, unknown> | null | undefined): boolean {
    return obj != null && Object.keys(obj).length === 0 && obj.constructor === Object;
}

export function mapGet<K, V>(map: Map<K, V>, key: K, defaultClass: AnyCtor<V>): V {
    if (!map.has(key)) map.set(key, new defaultClass());
    return map.get(key) as V;
}

export function swapRemove<T>(array: T[], index: number): T {
    const lastItem = array[array.length - 1];
    array[index] = lastItem;
    array.pop();
    return lastItem;
}
