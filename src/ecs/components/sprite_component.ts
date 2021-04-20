import { Texture } from "src/renderer/texture";
import { hexToRGBA } from "src/utils/colors";

/**
 * Component that handles sprite info like textures and colours.
 *
 * @memberof ESSEM
 */
export class SpriteComponent {
    /**
     * The texture of the sprite in use.
     */
    readonly texture: Texture;

    /**
     * The RGBA colour of the sprite as a 4 length Float32Array.
     */
    rgbaColor!: Float32Array;

    private _hexColor!: number;

    /**
     * @param texture - Texture to use. This should be resued between other components.
     * @param color - Colour of the sprite in hexadecimal.
     */
    constructor(texture: Texture, color = 0xffffff) {
        this.texture = texture;
        this.color = color;
    }

    /**
     * Colour of the sprite in hexadecimal.
     *
     * @member {number}
     */
    set color(hex: number) {
        this._hexColor = hex;
        this.rgbaColor = hexToRGBA(hex);
    }

    get color(): number {
        return this._hexColor;
    }
}
