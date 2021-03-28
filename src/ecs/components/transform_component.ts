import { Entity } from "../entity";
import { Matrix3 } from "../../math/matrix3";
import { Vector2 } from "../../math/vector2";

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

    getTransformMatrix(): Matrix3 {
        return this._transformMatrix.transform(this.position, this.scale, this.rotation);
    }

    private static _getGlobalVector(
        entity: Entity,
        vectorCache: Vector2,
        property: keyof TransformComponent
    ): Vector2 {
        vectorCache.setVector(entity.getComponent(TransformComponent)[property] as Vector2);
        entity.forEachParent((parent) => {
            vectorCache.add(parent.getComponent(TransformComponent)[property] as Vector2);
        });

        return vectorCache;
    }

    private static _positionCache: Vector2 = new Vector2();
    static getGlobalPosition(entity: Entity): Vector2 {
        const cacheVector = TransformComponent._positionCache;
        return TransformComponent._getGlobalVector(entity, cacheVector, "position");
    }

    private static _scaleCache: Vector2 = new Vector2();
    static getGlobalScale(entity: Entity): Vector2 {
        return TransformComponent._getGlobalVector(entity, TransformComponent._scaleCache, "scale");
    }

    static getGlobalRotation(entity: Entity): number {
        let rotation = entity.getComponent(TransformComponent).rotation;
        entity.forEachParent((parent) => {
            rotation += parent.getComponent(TransformComponent).rotation;
        });

        return rotation;
    }

    static getGlobalTransformMatrix(entity: Entity): Matrix3 {
        const matrix = entity.getComponent(TransformComponent).getTransformMatrix();
        entity.forEachParent((parent) => {
            matrix.multiplyFront(parent.getComponent(TransformComponent).getTransformMatrix());
        });

        return matrix;
    }
}
