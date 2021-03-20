import { Renderer } from "./renderer";

export type TextureSource = HTMLImageElement | HTMLCanvasElement;

export class Texture {
    source: TextureSource;
    handle: WebGLTexture | null = null;

    constructor(source: TextureSource) {
        this.source = source;
    }

    init(renderer: Renderer) {
        const gl = renderer.gl;

        this.handle = gl.createTexture();
        this.bind(renderer);
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

    bind(renderer: Renderer, slot = 0): void {
        const gl = renderer.gl;

        if (this.handle === null) {
            this.init(renderer);
        } else {
            gl.activeTexture(gl.TEXTURE0 + slot);
            gl.bindTexture(gl.TEXTURE_2D, this.handle);
        }
    }

    dispose(renderer: Renderer) {
        renderer.gl.deleteTexture(this.handle);
        this.handle = null;
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
