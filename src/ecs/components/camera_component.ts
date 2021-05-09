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

    projectionMatrix = new Matrix3();
    viewProjMatrix = new Matrix3();
    private _projMatrixValid = false;
    _transformUpdateID = 0;

    /**
     * @param {number} [size=100] - The size or 'inverse zoom' of the camera.
     * @param {boolean} [fixedAspectRatio=false] - Whether or not the camera shouldn't be automatically
     *        resized whenever the viewport resizes.
     */
    constructor(size = 100, fixedAspectRatio = false) {
        this._size = size;
        this.fixedAspectRatio = fixedAspectRatio;
    }

    private _onChange(): void {
        this._projMatrixValid = false;
    }

    setViewportSize(width: number, height: number): void {
        this.aspectRatio = width / height;
        this._onChange();
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
        this._size = size;
        this._onChange();
    }

    /**
     * The current aspect ratio of the camera.
     *
     * @member {number}
     */
    get aspectRatio(): number {
        return this._aspectRatio;
    }

    set aspectRatio(aspectRatio: number) {
        this._aspectRatio = aspectRatio;
        this._onChange();
    }

    updateProjection(): void {
        if (!this._projMatrixValid) {
            this.projectionMatrix.project(
                -this._size * this.aspectRatio,
                this._size * this.aspectRatio,
                this._size,
                -this._size
            );

            this._projMatrixValid = true;
            this._transformUpdateID = -1;
        }
    }
}
