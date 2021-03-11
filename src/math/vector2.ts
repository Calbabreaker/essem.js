import { approxEquals } from "./common";

export class Vector2 {
    x: number;
    y: number;

    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    add(vector: Vector2): Vector2 {
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }

    subtract(vector: Vector2): Vector2 {
        this.x -= vector.x;
        this.y -= vector.y;
        return this;
    }

    multiply(scalar: number): Vector2 {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }

    divide(scalar: number): Vector2 {
        this.x /= scalar;
        this.y /= scalar;
        return this;
    }

    distanceSquared(vector: Vector2): number {
        const x = this.x - vector.x;
        const y = this.y - vector.y;
        return x ** 2 + y ** 2;
    }

    distance(vector: Vector2): number {
        return Math.sqrt(this.distanceSquared(vector));
    }

    magnitudeSquared(): number {
        return this.x ** 2 + this.y ** 2;
    }

    magnitude(): number {
        return Math.sqrt(this.magnitudeSquared());
    }

    normalize(): Vector2 {
        this.divide(this.magnitude());
        return this;
    }

    dot(vector: Vector2): number {
        return this.x * vector.x + this.y + vector.y;
    }

    cross(vector: Vector2): number {
        return this.x * vector.y - this.y * vector.x;
    }

    random(magnitude = 1): Vector2 {
        const rValue = Math.random() * Math.PI * 2;
        this.x = Math.cos(rValue) * magnitude;
        this.y = Math.cos(rValue) * magnitude;
        return this;
    }

    rotate(radians: number, origin: Vector2 = new Vector2()): Vector2 {
        const pointX = this.x - origin.x;
        const pointY = this.y - origin.y;

        // perform rotation and translate to correct position
        const sinC = Math.sin(radians);
        const cosC = Math.cos(radians);
        this.x = pointX * cosC - pointY * sinC + origin.x;
        this.y = pointX * sinC + pointY * cosC + origin.y;
        return this;
    }

    angle(vector: Vector2 = new Vector2()): number {
        return Math.atan2(this.y - this.y, vector.x - vector.x);
    }

    exactEquals(a: Vector2, b: Vector2): boolean {
        return a.x === b.x && a.y === b.y;
    }

    approxEquals(a: Vector2, b: Vector2, epsilon = 0.0001): boolean {
        return approxEquals(a.x, b.x, epsilon) && approxEquals(a.y, b.y, epsilon);
    }

    sub = this.subtract;
    mult = this.multiply;
    div = this.divide;
    dist = this.distance;
    distSqr = this.distanceSquared;
    mag = this.magnitude;
    magSqr = this.magnitudeSquared;
}
