import { Texture } from "../renderer/texture";
import { Vector2 } from "../math/vector2";
import { Matrix3 } from "../math/matrix3";

export class TransformComponent {
    position: Vector2;
    scale: Vector2;
    rotation: number;
    private _transformMatrix: Matrix3 = new Matrix3();

    constructor(position = new Vector2(), scale = new Vector2(1, 1), rotation = 0) {
        this.position = position;
        this.scale = scale;
        this.rotation = rotation;
    }

    get transformMatrix(): Matrix3 {
        this._transformMatrix.identity();
        if (this.rotation !== 0) {
            this._transformMatrix.rotate(this.rotation);
        }

        this._transformMatrix
            .translate(this.position.x, this.position.y)
            .scale(this.scale.x, this.scale.y);

        return this._transformMatrix;
    }
}

export class SpriteComponent {
    texture: Texture;

    constructor(texture: Texture) {
        this.texture = texture;
    }
}

export class CameraComponent {
    aspectRatio = 0;
    fixedAspectRatio: boolean;
    size: number;
    private _projectionMatrix: Matrix3 = new Matrix3();

    constructor(zoom = 5, fixedAspectRatio = false) {
        this.size = zoom;
        this.fixedAspectRatio = fixedAspectRatio;
    }

    setViewportSize(width: number, height: number) {
        this.aspectRatio = width / height;
    }

    get projectionMatrix(): Matrix3 {
        return this._projectionMatrix.projection(
            -this.size * this.aspectRatio,
            this.size * this.aspectRatio,
            this.size,
            -this.size
        );
    }
}
