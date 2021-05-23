/**
 * Checks to see if a and b are approximately equal according to the tolerance.
 *
 * @memberof ESSEM
 * @param a - The first value.
 * @param b - The second value.
 * @param tolerance - The range to check in.
 * @return Whether or not the values are approximately equal.
 */
export function approxEquals(a: number, b: number, tolerance = 0.001): boolean {
    return Math.abs(a - b) <= tolerance;
}

/**
 * Constant that converts degrees to radians.
 * Use the essem.js provided functions to convert instead.
 *
 * @memberof ESSEM
 * @type number
 */
export const DEG_TO_RAD: number = Math.PI / 180;

/**
 * Constant that converts radians to degrees.
 * Use the essem.js provided functions to convert instead.
 *
 * @memberof ESSEM
 * @type number
 */
export const RAD_TO_DEG: number = 180 / Math.PI;

/**
 * Converts degrees to radians.
 *
 * @memberof ESSEM
 * @param degrees - Degrees to convert.
 * @return Radians.
 */
export function toRadians(degrees: number): number {
    return degrees * DEG_TO_RAD;
}

/**
 * Converts radians to degrees.
 *
 * @memberof ESSEM
 * @param radians - Radians to convert.
 * @return Degrees.
 */
export function toDegrees(radians: number): number {
    return radians * RAD_TO_DEG;
}

/**
 * Constant that is equal to PI * 2.
 *
 * @memberof ESSEM
 */
export const TWO_PI = Math.PI * 2;
