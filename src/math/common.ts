export function approxEquals(a: number, b: number, epsilon = 0.0001): boolean {
    return Math.abs(a - b) <= epsilon;
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
