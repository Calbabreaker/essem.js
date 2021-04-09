import { Texture } from "renderer/texture";
import { hexToRGBA } from "utils/colors";

export class SpriteComponent {
    texture: Texture;
    rgbaColor!: Float32Array;
    private _hexColor!: number;

    constructor(texture: Texture, color = 0xffffff) {
        this.texture = texture;
        this.color = color;
    }

    set color(hex: number) {
        this._hexColor = hex;
        this.rgbaColor = hexToRGBA(hex);
    }

    get color(): number {
        return this._hexColor;
    }
}
