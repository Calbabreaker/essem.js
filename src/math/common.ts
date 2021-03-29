/**
 * Checks to see if a and b are approximately equal according to the tolerance.
 *
 * @memberof ESSEM
 * @param a - The first value.
 * @param b - The second value.
 * @param {number} [tolerance=0.001] - The range to check in.
 * @return Whether or not the values are approximately equal.
 */
export function approxEquals(a: number, b: number, tolerance: number = 0.001): boolean {
    return Math.abs(a - b) <= tolerance;
}

export const DEG_TO_RAD = Math.PI / 180;

export function toRadians(degrees: number): number {
    return degrees * DEG_TO_RAD;
}

export const RAD_TO_DEG = 180 / Math.PI;

export function toDegrees(radians: number): number {
    return radians * RAD_TO_DEG;
}

export const TWO_PI = Math.PI * 2;
