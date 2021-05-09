import { approxEquals } from "./common";
import { Matrix3 } from "./matrix3";

/**
 * A 2 component vector with x and y.
 *
 * @memberof ESSEM
 */
export class Vector2 {
    /**
     * The x component of the vector.
     */
    x: number;

    /**
     * The y component of the vector.
     */
    y: number;

    /**
     * The cache for toArray.
     */
    _array: Float32Array | null = null;

    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    setValues(x = 0, y = 0): this {
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

    /**
     * Converts the vector into a Float32Array array.
     *
     * @param [out=new Float32Array(2)] - An array to set the values of the vector. Leave it empty
     *        to use the vector's array cache.
     */
    toArray(out?: Float32Array): Float32Array {
        if (!this._array) this._array = new Float32Array(2);

        const array = out ?? this._array;
        array[0] = this.x;
        array[1] = this.y;
        return array;
    }

    /**
     * Adds the vector by another vector.
     *
     * @param vector - The vector to add by.
     */
    add(vector: Vector2): this {
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }

    /**
     * Subtracts the vector by another vector.
     *
     * @param vector - The vector to subtract by.
     */
    subtract(vector: Vector2): this {
        this.x -= vector.x;
        this.y -= vector.y;
        return this;
    }

    /**
     * Multiplies the vector by a scalar number.
     *
     * @param scalar - The number to multiply by.
     */
    multiply(scalar: number): this {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }

    /**
     * Divides the vector by a scalar number.
     *
     * @param scalar - The number to divide by.
     */
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

    /**
     * Sets the rotation of the vector by the angle that's in radians.
     *
     * @param angle - The angle of the rotation in radians.
     * @param {Vector2} [origin=Vector2.ZERO] - The origin of the rotation.
     */
    rotate(angle: number, origin: Vector2 = Vector2.ZERO): this {
        const pointX = this.x - origin.x;
        const pointY = this.y - origin.y;

        // perform rotation and translate to correct position
        const sinC = Math.sin(angle);
        const cosC = Math.cos(angle);
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

    /**
     * Checks to see if this vector is approximately equal to the input vector
     * according to tolerance.
     *
     * @param vector - The input vector to compare.
     * @param tolerance - The range to check in.
     * @return Whether or not the vectors are approximately equal.
     */
    approxEquals(vector: Vector2, tolerance = 0.001): boolean {
        return (
            approxEquals(this.x, vector.x, tolerance) && approxEquals(this.y, vector.y, tolerance)
        );
    }

    transformMatrix3(matrix: Matrix3): this {
        const x = this.x;
        this.x = matrix.xScale * x + matrix.xSkew * this.y + matrix.xTrans;
        this.y = matrix.ySkew * x + matrix.yScale * this.y + matrix.yTrans;
        return this;
    }

    static readonly ZERO = new Vector2(0, 0);
}

export class Vector2Proxy {
    private _x: number;
    private _y: number;
    _array: Float32Array | null = null;
    callbackFunc: () => void;

    constructor(callbackFunc: () => void, x = 0, y = 0) {
        this.callbackFunc = callbackFunc;
        this._x = x;
        this._y = y;
        this._array;
    }

    get x(): number {
        return this._x;
    }

    set x(x: number) {
        if (this._x !== x) {
            this._x = x;
            this.callbackFunc();
        }
    }

    get y(): number {
        return this._y;
    }

    set y(y: number) {
        if (this._y !== y) {
            this._y = y;
            this.callbackFunc();
        }
    }

    setValues = Vector2.prototype.setValues;
    setVector = Vector2.prototype.setVector;
    clone = Vector2.prototype.clone;
    toString = Vector2.prototype.toString;
    toArray = Vector2.prototype.toArray;

    add = Vector2.prototype.add;
    subtract = Vector2.prototype.subtract;
    multiply = Vector2.prototype.multiply;
    divide = Vector2.prototype.divide;

    distanceSquared = Vector2.prototype.distanceSquared;
    distance = Vector2.prototype.distance;
    magnitudeSquared = Vector2.prototype.magnitudeSquared;
    magnitude = Vector2.prototype.magnitude;
    normalize = Vector2.prototype.normalize;
    dot = Vector2.prototype.dot;
    cross = Vector2.prototype.cross;

    random = Vector2.prototype.random;
    rotate = Vector2.prototype.rotate;
    angle = Vector2.prototype.angle;
    exactEquals = Vector2.prototype.exactEquals;
    approxEquals = Vector2.prototype.approxEquals;
    transformMatrix3 = Vector2.prototype.transformMatrix3;
}
