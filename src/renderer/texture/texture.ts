import {
    DATA_TYPES,
    SCALE_MODES,
    TEXTURE_FORMATS,
    TEXTURE_TARGETS,
    WRAP_MODES,
} from "src/utils/constants";
import { settings } from "src/utils/settings";
import { GLTexture } from "./gl_texture";

export type TextureSource = HTMLImageElement | HTMLCanvasElement;

export interface ITextureOptions {
    format?: TEXTURE_FORMATS;
    target?: TEXTURE_TARGETS;
    dataType?: DATA_TYPES;
    scaleMode?: SCALE_MODES;
    wrapMode?: WRAP_MODES;
}

/**
 * Class that is used to store and render images.
 *
 * @memberof ESSEM
 */
export class Texture {
    source: TextureSource;

    format: TEXTURE_FORMATS;
    target: TEXTURE_TARGETS;
    dataType: DATA_TYPES;
    scaleMode: SCALE_MODES;
    wrapMode: WRAP_MODES;

    dirtyID = 0;
    dirtyStyleID = 0;
    glTextures: { [key: string]: GLTexture | undefined } = {};

    constructor(source: TextureSource, options: ITextureOptions = {}) {
        this.source = source;

        this.format = options.format ?? TEXTURE_FORMATS.RGBA;
        this.target = options.target ?? TEXTURE_TARGETS.TEXTURE_2D;
        this.dataType = options.dataType ?? DATA_TYPES.UNSIGNED_BYTE;
        this.scaleMode = options.scaleMode ?? settings.SCALE_MODE;
        this.wrapMode = options.wrapMode ?? settings.WRAP_MODE;
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

    static readonly WHITE = createWhiteTexture();
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
