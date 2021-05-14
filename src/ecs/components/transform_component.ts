import { Matrix3 } from "src/math/matrix3";
import { Vector2, Vector2Proxy } from "src/math/vector2";
import { Entity } from "../entity";

/**
 * Component that holds the position, scale and rotation of an entity.
 *
 * @memberof ESSEM
 */
export class TransformComponent {
    private _position = new Vector2Proxy(this._onChange.bind(this));
    private _scale = new Vector2Proxy(this._onChange.bind(this));
    private _rotation: number;

    localMatrix: Matrix3 = new Matrix3();
    globalMatrix: Matrix3 = new Matrix3();

    private _localValid = false;
    private _parentUpdateID = 0;
    _globalUpdateID = 0;

    /**
     * @param position - Starting position.
     * @param scale - Starting scale.
     * @param rotation - Starting rotation.
     */
    constructor(position = new Vector2(), scale = new Vector2(1, 1), rotation = 0) {
        this.position = position;
        this.scale = scale;
        this._rotation = rotation;
    }

    private _onChange() {
        this._localValid = false;
    }

    /**
     * Position of the transform.
     */
    get position(): Vector2 {
        return this._position;
    }

    /**
     * Scale of the transform.
     */
    set position(position: Vector2) {
        this._position.setVector(position);
    }

    /**
     * Scale of the transform.
     */
    get scale(): Vector2 {
        return this._scale;
    }

    set scale(scale: Vector2) {
        this._scale.setVector(scale);
    }

    /**
     * Rotation of the component.
     */
    get rotation(): number {
        return this._rotation;
    }

    set rotation(rotation: number) {
        this._rotation = rotation;
        this._onChange();
    }

    updateTransform(parentTransform?: TransformComponent): void {
        if (!this._localValid) {
            this.localMatrix.transform(this.position, this.scale, this.rotation);
            this._localValid = true;
            // force update global transform
            this._parentUpdateID = -1;
        }

        if (parentTransform !== undefined) {
            // parent exist then check parent
            if (this._parentUpdateID !== parentTransform._globalUpdateID) {
                this.globalMatrix = this.localMatrix.clone();
                this.globalMatrix.multiplyFront(parentTransform.globalMatrix);
                this._parentUpdateID = parentTransform._parentUpdateID;
                this._globalUpdateID++;
            }
        } else {
            // else have -2 as the id for the parentUpdateID to check
            if (this._parentUpdateID !== -2) {
                this.globalMatrix = this.localMatrix;
                this._globalUpdateID++;
                this._parentUpdateID = -2;
            }
        }
    }

    static updateGlobalTransform(entity: Entity): void {
        let parentTransform = undefined;
        if (entity.parent instanceof Entity) {
            TransformComponent.updateGlobalTransform(entity.parent);
            if (entity.parent.hasComponent(TransformComponent)) {
                parentTransform = entity.parent.getComponent(TransformComponent);
            }
        }

        if (entity.hasComponent(TransformComponent)) {
            entity.getComponent(TransformComponent).updateTransform(parentTransform);
        }
    }
}
