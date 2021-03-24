import { assert } from "../utils/misc";

export type TextureSource = HTMLImageElement | HTMLCanvasElement;

export class Texture {
    source: TextureSource;
    glTexture: WebGLTexture | null = null;
    aspectRatio: number;

    constructor(source: TextureSource) {
        this.source = source;
        this.aspectRatio = this.source.width / this.source.height;
    }

    init(gl: WebGL2RenderingContext) {
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

    dispose(gl: WebGL2RenderingContext) {
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
}
