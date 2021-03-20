import { Texture } from "../renderer/texture";
import { Vector2 } from "../math/vector2";

export class Transform2DComponent {
    position: Vector2;
    scale: Vector2;
    rotation: number;

    constructor(position = new Vector2(), scale = new Vector2(), rotation = 0) {
        this.position = position;
        this.scale = scale;
        this.rotation = rotation;
    }
}

export class SpriteComponent {
    texture: Texture;

    constructor(texture: Texture) {
        this.texture = texture;
    }
}
