import { Texture } from "renderer/texture";

export class SpriteComponent {
    texture: Texture;

    constructor(texture: Texture) {
        this.texture = texture;
    }
}
