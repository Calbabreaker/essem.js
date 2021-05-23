import { Dictionary } from "src/utils/types";
import {
    TEXTURE_TYPES,
    SCALE_MODES,
    TEXTURE_FORMATS,
    TEXTURE_TARGETS,
    WRAP_MODES,
    DEFAULT_TEXTURE_UVS,
} from "src/utils/constants";
import { settings } from "src/utils/settings";
import { GLTexture } from "./gl_texture";
import { Vector2 } from "src/math/vector2";

export type TextureSource = HTMLImageElement | HTMLCanvasElement;

export interface ITextureOptions {
    format?: TEXTURE_FORMATS;
    target?: TEXTURE_TARGETS;
    dataType?: TEXTURE_TYPES;
    scaleMode?: SCALE_MODES;
    wrapMode?: WRAP_MODES;
    anchor?: Vector2;
}

/**
 * Class that is used to store and render images.
 *
 * @memberof ESSEM
 */
export class Texture {
    source: TextureSource;
    uvs: Float32Array = DEFAULT_TEXTURE_UVS.slice();
    anchor: Vector2;

    format: TEXTURE_FORMATS;
    target: TEXTURE_TARGETS;
    dataType: TEXTURE_TYPES;
    scaleMode: SCALE_MODES;
    wrapMode: WRAP_MODES;

    dirtyID = 0;
    dirtyStyleID = 0;
    glTextures: Dictionary<GLTexture | undefined> = {};

    /**
     * @param {HTMLCanvasElement | HTMLImageElement} source - The source for the texture.
     * @param {object} [options={}] - Optional parameters for the texture.
     * @param {object} [options.format=ESSEM.TEXTURE_FORMATS.RGBA] - The colour format for the texture.
     * @param {object} [options.target=ESSEM.TEXTURE_TARGETS.TEXTURE_2D] - The target of the texture.
     * @param {object} [options.dataType=ESSEM.TEXTURE_TYPES.UNSIGNED_BYTE] - The data type of the texture.
     * @param {object} [options.scaleMode=ESSEM.settings.SCALE_MODE] - The scale mode for the texture.
     * @param {object} [options.anchor=new Vector2(0.5, 0.5)] - The anchor of the texture used for rendering.
     *        Default is the middle of the texture.
     */
    constructor(source: TextureSource, options: ITextureOptions = {}) {
        this.source = source;

        this.format = options.format ?? TEXTURE_FORMATS.RGBA;
        this.target = options.target ?? TEXTURE_TARGETS.TEXTURE_2D;
        this.dataType = options.dataType ?? TEXTURE_TYPES.UNSIGNED_BYTE;
        this.scaleMode = options.scaleMode ?? settings.SCALE_MODE;
        this.wrapMode = options.wrapMode ?? settings.WRAP_MODE;
        this.anchor = options.anchor ?? new Vector2(0.5, 0.5);
    }

    get width(): number {
        return this.source.width;
    }

    get height(): number {
        return this.source.height;
    }

    static async fromURL(url: string): Promise<Texture> {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.src = url;
            image.onload = () => {
                const texture = new Texture(image);
                resolve(texture);
            };

            image.onerror = (event) => reject(event);
        });
    }

    /**
     * A completely white 16x16 texture useful for solid colour rectangles.
     */
    static readonly WHITE: Texture = createWhiteTexture();
}

function createWhiteTexture(): Texture {
    const canvas = document.createElement("canvas");
    canvas.width = 16;
    canvas.height = 16;

    const context = canvas.getContext("2d") as CanvasRenderingContext2D;
    context.fillStyle = "white";
    context.fillRect(0, 0, 16, 16);
    return new Texture(canvas);
}
