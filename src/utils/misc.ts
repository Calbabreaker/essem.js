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

/**
 * Gets an item from the map using a key and sets it with a new instance of the class of it
 * doesn't  exist.
 *
 * @memberof ESSEM
 * @param map - The map to use.
 * @param key - The key of the item.
 * @param defaultClass - The class to create a new instance from.
 * @return The value that was retrieved.
 */
export function mapGet<K, V>(map: Map<K, V>, key: K, defaultClass: AnyCtor<V>): V {
    if (!map.has(key)) map.set(key, new defaultClass());
    return map.get(key) as V;
}

/**
 * Removes an item from an array by swapping the last element with the removing element and popping
 * the array.
 *
 * @memberof ESSEM
 * @param array - The array to use.
 * @param index - The index to remove.
 * @return The last item of the array that was swapped to the index.
 */
export function lastItemSwapRemove<T>(array: T[], index: number): T {
    const lastItem = array[array.length - 1];
    array[index] = lastItem;
    array.pop();
    return lastItem;
}

/**
 * Gets the name of the class or just uses string.
 *
 * @memberof ESSEM
 * @param {AnyClass | string} type - Any class or string.
 * @return The name of the type.
 */
export function getTypeName<T>(type: AnyCtor<T> | string): string {
    return (type as AnyCtor<T>).name ?? type;
}
