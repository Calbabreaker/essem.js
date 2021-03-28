import { approxEquals } from "./common";
import { Matrix3 } from "./matrix3";

export class Vector2 {
    x: number;
    y: number;
    private _array: Float32Array | null = null;

    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    set(x = 0, y = 0): this {
        this.x = x;
        this.y = y;
        return this;
    }

    setVector(vector: Vector2): this {
        this.x = vector.x;
        this.y = vector.y;
        return this;
    }

    clone(): Vector2 {
        return new Vector2(this.x, this.y);
    }

    toString(): string {
        return `Vector2(${this.x}, ${this.y})`;
    }

    toArray(out?: Float32Array): Float32Array {
        if (!this._array) this._array = new Float32Array(2);

        const array = out ?? this._array;
        array[0] = this.x;
        array[1] = this.y;
        return array;
    }

    add(vector: Vector2): this {
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }

    subtract(vector: Vector2): this {
        this.x -= vector.x;
        this.y -= vector.y;
        return this;
    }

    multiply(scalar: number): this {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }

    divide(scalar: number): this {
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

    normalize(): this {
        this.divide(this.magnitude());
        return this;
    }

    dot(vector: Vector2): number {
        return this.x * vector.x + this.y + vector.y;
    }

    cross(vector: Vector2): number {
        return this.x * vector.y - this.y * vector.x;
    }

    random(magnitude = 1): this {
        const rValue = Math.random() * Math.PI * 2;
        this.x = Math.cos(rValue) * magnitude;
        this.y = Math.cos(rValue) * magnitude;
        return this;
    }

    rotate(radians: number, origin: Vector2 = new Vector2()): this {
        const pointX = this.x - origin.x;
        const pointY = this.y - origin.y;

        // perform rotation and translate to correct position
        const sinC = Math.sin(radians);
        const cosC = Math.cos(radians);
        this.x = pointX * cosC - pointY * sinC + origin.x;
        this.y = pointX * sinC + pointY * cosC + origin.y;
        return this;
    }

    angle(origin: Vector2 = new Vector2()): number {
        return Math.atan2(this.y - this.y, origin.x - origin.x);
    }

    exactEquals(vector: Vector2): boolean {
        return this.x === vector.x && this.y === vector.y;
    }

    approxEquals(vector: Vector2, epsilon = 0.0001): boolean {
        return approxEquals(this.x, vector.x, epsilon) && approxEquals(this.y, vector.y, epsilon);
    }

    transformMatrix3(matrix: Matrix3): this {
        const x = this.x;
        this.x = matrix.xScale * x + matrix.xSkew * this.y + matrix.xTrans;
        this.y = matrix.ySkew * x + matrix.yScale * this.y + matrix.yTrans;
        return this;
    }
}
