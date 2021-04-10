import { Entity } from "../entity";
import { Matrix3 } from "math/matrix3";
import { Vector2 } from "math/vector2";

/**
 * Component that holds the position, scale and rotation of an entity.
 *
 * @memberof ESSEM
 */
export class TransformComponent {
    private _position: Vector2;
    private _scale: Vector2;
    private _rotation: number;
    private _transformMatrix: Matrix3 = new Matrix3();
    private _transformValid = false;

    constructor(position = new Vector2(), scale = new Vector2(1, 1), rotation = 0) {
        this._position = position;
        this._scale = scale;
        this._rotation = rotation;
    }

    get transformMatrix(): Matrix3 {
        if (!this._transformValid) {
            this._transformMatrix.transform(this._position, this._scale, this._rotation);
            this._transformValid = true;
        }

        return this._transformMatrix;
    }

    set rotation(rotation: number) {
        this._transformValid = false;
        this._rotation = rotation;
    }
    get rotation(): number {
        return this._rotation;
    }

    set position(position: Vector2) {
        this._transformValid = false;
        this._position = position;
    }

    get position(): Vector2 {
        this._transformValid = false;
        return this._position;
    }

    set scale(scale: Vector2) {
        this._transformValid = false;
        this._scale = scale;
    }

    get scale(): Vector2 {
        this._transformValid = false;
        return this._scale;
    }

    static getGlobalPosition(entity: Entity): Vector2 {
        const vector = entity.getComponent(TransformComponent)._position.clone();
        entity.forEachParent((parent) => {
            vector.add(parent.getComponent(TransformComponent)._position);
        });

        return vector;
    }

    static getGlobalScale(entity: Entity): Vector2 {
        const vector = entity.getComponent(TransformComponent)._scale.clone();
        entity.forEachParent((parent) => {
            vector.add(parent.getComponent(TransformComponent)._scale);
        });

        return vector;
    }

    static getGlobalRotation(entity: Entity): number {
        let rotation = entity.getComponent(TransformComponent)._rotation;
        entity.forEachParent((parent) => {
            rotation += parent.getComponent(TransformComponent)._rotation;
        });

        return rotation;
    }

    /**
     * Gets the global transform matrix relative to all the entity's parents.
     *
     * @param entity - Entity to get the global transform matrix of.
     * @return A global transform matrix.
     */
    static getGlobalTransformMatrix(entity: Entity): Matrix3 {
        const matrix = entity.getComponent(TransformComponent).transformMatrix;
        entity.forEachParent((parent) => {
            matrix.multiplyFront(parent.getComponent(TransformComponent).transformMatrix);
        });

        return matrix;
    }
}