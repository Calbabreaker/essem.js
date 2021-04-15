import { Matrix3 } from "src/math/matrix3";

/**
 * Component to handle camera stuff
 * All render systems will look for a entity tagged 'MainCamera' as the camera to render with.
 *
 * @memberof ESSEM
 */
export class CameraComponent {
    aspectRatio = 0;
    fixedAspectRatio: boolean;
    size: number;
    private _projectionMatrix: Matrix3 = new Matrix3();

    constructor(zoom = 5, fixedAspectRatio = false) {
        this.size = zoom;
        this.fixedAspectRatio = fixedAspectRatio;
    }

    setViewportSize(width: number, height: number): void {
        this.aspectRatio = width / height;
    }

    getProjectionMatrix(): Matrix3 {
        return this._projectionMatrix.projection(
            -this.size * this.aspectRatio,
            this.size * this.aspectRatio,
            this.size,
            -this.size
        );
    }
}
