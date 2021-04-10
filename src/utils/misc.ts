import { AnyCtor } from "./types";

/**
 * Error class that is used for {@link ESSEM.assert}.
 *
 * @memberof ESSEM
 */
export class AssertionError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = "AssertionError";
    }
}

/**
 * Throws an error if condition is false.
 * All uses if this in the essem.js code will get removed in minified files.
 *
 * @memberof ESSEM
 * @param condition - The condition to assert.
 * @param message - The message to use in the Error.
 * @return {void}
 */
export function assert(condition: boolean, message?: string): asserts condition {
    if (!condition) throw new AssertionError(message);
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
