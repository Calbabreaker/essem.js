import { assert } from "src/utils/misc";

export type TextureSource = HTMLImageElement | HTMLCanvasElement;

/**
 * Class that is used to render images.
 *
 * @memberof ESSEM
 */
export class Texture {
    source: TextureSource;
    glTexture: WebGLTexture | null = null;
    aspectRatio: number;

    constructor(source: TextureSource) {
        this.source = source;
        this.aspectRatio = this.source.width / this.source.height;
    }

    /**
     * Inits the texture. This will get automatically called when binding the texture.
     *
     * @param gl - An WebGL2 rendering context for the texture to use.
     */
    init(gl: WebGL2RenderingContext): void {
        this.glTexture = gl.createTexture();
        assert(this.glTexture !== null, "Could not create glTexture!");
        this.bind(gl);
        // TODO: add options for this
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            this.source.width,
            this.source.height,
            0,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            this.source
        );
    }

    /**
     * Binds the texture.
     *
     * @param gl - An WebGL2 rendering context for the texture to use.
     * @param slot - The texture slot for the texture to be binded to (optional).
     */
    bind(gl: WebGL2RenderingContext, slot?: number): void {
        if (slot) {
            gl.activeTexture(gl.TEXTURE0 + slot);
        }

        if (this.glTexture === null) {
            this.init(gl);
        } else {
            gl.bindTexture(gl.TEXTURE_2D, this.glTexture);
        }
    }

    dispose(gl: WebGL2RenderingContext): void {
        gl.deleteTexture(this.glTexture);
        this.glTexture = null;
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
