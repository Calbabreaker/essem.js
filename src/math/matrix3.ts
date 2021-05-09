import { Vector2 } from "./vector2";

/**
 * The matrix as this class makes it a lot faster since there are less values to work with.
 *
 * Here's a representation of it:
 * ```js
 * | xScale | xSkew  | xTrans |
 * | ySkew  | yScale | yTrans |
 * | 0      | 0      | 1      |
 * ```
 *
 * @memberof ESSEM
 */
export class Matrix3 {
    xScale!: number;
    ySkew!: number;
    xSkew!: number;
    yScale!: number;
    xTrans!: number;
    yTrans!: number;

    private _array: Float32Array | null = null;

    constructor(
        xScale?: number,
        ySkew?: number,
        xSkew?: number,
        yScale?: number,
        xTrans?: number,
        yTrans?: number
    ) {
        this.setValues(xScale, ySkew, xSkew, yScale, xTrans, yTrans);
    }

    clone(): Matrix3 {
        return new Matrix3(
            this.xScale,
            this.ySkew,
            this.xSkew,
            this.yScale,
            this.xTrans,
            this.yTrans
        );
    }

    setValues(xScale = 1, ySkew = 0, xSkew = 0, yScale = 1, xTrans = 0, yTrans = 0): this {
        this.xScale = xScale;
        this.ySkew = ySkew;
        this.xSkew = xSkew;
        this.yScale = yScale;
        this.xTrans = xTrans;
        this.yTrans = yTrans;
        return this;
    }

    setMatrix(matrix: Matrix3): this {
        return this.setValues(
            matrix.xScale,
            matrix.ySkew,
            matrix.xSkew,
            matrix.yScale,
            matrix.xTrans,
            matrix.yTrans
        );
    }

    toString(): string {
        return (
            `Matrix3(\n\t` +
            `${this.xScale}, ${this.xSkew}, ${this.xTrans},\n\t` +
            `${this.ySkew}, ${this.yScale}, ${this.yTrans},\n\t` +
            `0, 0, 1\n)`
        );
    }

    toArray(transpose = true, out?: Float32Array): Float32Array {
        if (!this._array) this._array = new Float32Array(9);

        const array = out ?? this._array;

        if (transpose) {
            array[0] = this.xScale;
            array[1] = this.ySkew;
            array[2] = 0;
            array[3] = this.xSkew;
            array[4] = this.yScale;
            array[5] = 0;
            array[6] = this.xTrans;
            array[7] = this.yTrans;
            array[8] = 1;
        } else {
            array[0] = this.xScale;
            array[1] = this.xSkew;
            array[2] = this.xTrans;
            array[3] = this.ySkew;
            array[4] = this.yScale;
            array[5] = this.yTrans;
            array[6] = 0;
            array[7] = 0;
            array[8] = 1;
        }

        return array;
    }

    invert(): this {
        const xScale = this.xScale;
        const ySkew = this.ySkew;
        const xSkew = this.xSkew;
        const yScale = this.yScale;
        const xTrans = this.xTrans;
        const det = xScale * yScale - ySkew * xSkew;
        if (det === 0) return this;

        this.xScale = yScale / det;
        this.ySkew = -ySkew / det;
        this.xSkew = -xSkew / det;
        this.yScale = xScale / det;
        this.xTrans = (xSkew * this.yTrans - yScale * xTrans) / det;
        this.yTrans = -(xScale * this.yTrans - xSkew * xTrans) / det;
        return this;
    }

    multiply(matrix: Matrix3): this {
        const xScale = this.xScale;
        const ySkew = this.ySkew;
        const xSkew = this.xSkew;
        const yScale = this.yScale;

        this.xScale = xScale * matrix.xScale + xSkew * matrix.ySkew;
        this.ySkew = ySkew * matrix.xScale + yScale * matrix.ySkew;
        this.xSkew = xScale * matrix.xSkew + xSkew * matrix.yScale;
        this.yScale = ySkew * matrix.xSkew + yScale * matrix.yScale;

        this.xTrans = xScale * matrix.xTrans + xSkew * matrix.yTrans + this.xTrans;
        this.yTrans = ySkew * matrix.xTrans + yScale * matrix.yTrans + this.yTrans;
        return this;
    }

    multiplyFront(matrix: Matrix3): this {
        const xTrans = this.xTrans;

        if (
            matrix.xScale !== 1 ||
            matrix.ySkew !== 0 ||
            matrix.xSkew !== 0 ||
            matrix.yScale !== 1
        ) {
            const xScale1 = this.xScale;
            const xSkew = this.xSkew;

            this.xScale = xScale1 * matrix.xScale + this.ySkew * matrix.xSkew;
            this.ySkew = xScale1 * matrix.ySkew + this.ySkew * matrix.yScale;
            this.xSkew = xSkew * matrix.xScale + this.yScale * matrix.xSkew;
            this.yScale = xSkew * matrix.ySkew + this.yScale * matrix.yScale;
        }

        this.xTrans = xTrans * matrix.xScale + this.yTrans * matrix.xSkew + matrix.xTrans;
        this.yTrans = xTrans * matrix.ySkew + this.yTrans * matrix.yScale + matrix.yTrans;
        return this;
    }

    translate(x: number, y: number): this {
        this.xTrans += x;
        this.yTrans += y;
        return this;
    }

    scale(x: number, y: number): this {
        this.xScale *= x;
        this.yScale *= y;
        this.xSkew *= x;
        this.ySkew *= y;
        this.xTrans *= x;
        this.yTrans *= y;
        return this;
    }

    rotate(angle: number): this {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        const xScale = this.xScale;
        const xSkew = this.xSkew;
        const xTrans = this.xTrans;

        this.xScale = xScale * cos - this.ySkew * sin;
        this.ySkew = xScale * sin + this.ySkew * cos;
        this.xSkew = xSkew * cos - this.yScale * sin;
        this.yScale = xSkew * sin + this.yScale * cos;
        this.xTrans = xTrans * cos - this.yTrans * sin;
        this.yTrans = xTrans * sin + this.yTrans * cos;
        return this;
    }

    // TODO: perhaps make this not use matrix funcions?
    transform(position: Vector2, scale: Vector2, rotation: number): this {
        this.setValues();
        if (rotation !== 0) {
            this.rotate(rotation);
        }

        this.translate(position.x, position.y).scale(scale.x, scale.y);
        return this;
    }

    project(left: number, right: number, bottom: number, top: number, flip = true): this {
        const rl = right - left;
        const tb = top - bottom;
        const sign = flip ? -1 : 1;

        this.xScale = 2 / rl;
        this.yScale = (2 / tb) * sign;
        this.xTrans = (right + left) / rl;
        this.yTrans = (top + bottom) / tb;
        this.xSkew = 0;
        this.ySkew = 0;
        return this;
    }
}
