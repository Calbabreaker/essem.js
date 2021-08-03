import { Vector2, Vector2Proxy } from "src/math/vector2";
import { Matrix3 } from "src/math/matrix3";
import { Component } from "../component";

/**
 * Component for viewing on the screen.
 * All render systems will look for a entity tagged 'MainCamera' as the camera to render with.
 * Note that you can set the zoom of the camera by modifying the scale property on the TransformComponent.
 *
 * @memberof ESSEM
 */
export class CameraComponent extends Component {
    autoScale: boolean = true;
    private _size = new Vector2Proxy(this._onChange.bind(this));

    projectionMatrix = new Matrix3();
    viewProjMatrix = new Matrix3();
    private _projMatrixValid = false;
    _transformUpdateID = 0;

    private _onChange(): void {
        this._projMatrixValid = false;
    }

    get size(): Vector2 {
        return this._size;
    }

    set size(size: Vector2) {
        this._size.setVector(size);
    }

    setViewportSize(width: number, height: number): void {
        this.size.setValues(width / 2, height / 2);
        this._onChange();
    }

    updateProjection(): void {
        if (!this._projMatrixValid) {
            this.projectionMatrix.project(-this.size.x, this.size.x, this.size.y, -this.size.y);

            this._projMatrixValid = true;
            this._transformUpdateID = -1;
        }
    }

    static schema = { autoScale: true };
}
