import { Matrix3 } from "src/math/matrix3";

/**
 * Component to handle cameras.
 * All render systems will look for a entity tagged 'MainCamera' as the camera to render with.
 *
 * @memberof ESSEM
 */
export class CameraComponent {
    fixedAspectRatio: boolean;

    private _aspectRatio = 0;
    private _size: number;

    private _projectionMatrix = new Matrix3();
    private _projectionValid = false;

    /**
     * @param {number} [size=100] - The size or 'inverse zoom' of the camera.
     * @param {boolean} [fixedAspectRatio=false] - Whether or not the camera shouldn't be automatically
     *        resized whenever the viewport resizes.
     */
    constructor(size: number = 100, fixedAspectRatio: boolean = false) {
        this._size = size;
        this.fixedAspectRatio = fixedAspectRatio;
    }

    setViewportSize(width: number, height: number): void {
        this.aspectRatio = width / height;
    }

    /**
     * The current size or 'inverse zoom' of the camera.
     *
     * @member {number}
     */
    get size(): number {
        return this._size;
    }

    set size(size: number) {
        this._projectionValid = false;
        this._size = size;
    }

    /**
     * The current aspect ratio or 'inverse zoom' of the camera.
     *
     * @member {number}
     */
    get aspectRatio(): number {
        return this._aspectRatio;
    }

    set aspectRatio(aspectRatio: number) {
        this._projectionValid = false;
        this._aspectRatio = aspectRatio;
    }

    /**
     * The camera projection represented as a matrix.
     *
     * @member {Matrix3}
     * @readonly
     */
    get projectionMatrix(): Matrix3 {
        if (!this._projectionValid) {
            this._projectionMatrix.projection(
                -this._size * this.aspectRatio,
                this._size * this.aspectRatio,
                this._size,
                -this._size
            );

            this._projectionValid = true;
        }

        return this._projectionMatrix;
    }
}
