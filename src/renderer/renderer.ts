import { assert } from "src/utils/misc";
import { isWebGL2Supported } from "src/utils/browser";
import { hexToRGBA } from "src/utils/colors";
import { TextureExtension } from "./texture/texture_extension";
import { ShaderExtension } from "./shader/shader_extension";
import { BatchRendererExtension } from "./batch/batch_renderer_extension";

let uidCounter = 0;

interface IRendererExtensions {
    texture: TextureExtension;
    shader: ShaderExtension;
    batch: BatchRendererExtension;
}

/**
 * Main renderer class.
 * It is automatically created when creating {@link ESSEM.Application} and it can be accesed from
 * `app.renderer`.
 *
 * @memberof ESSEM
 */
export class Renderer {
    readonly gl: WebGL2RenderingContext;
    readonly contextUID: string;

    extensions: IRendererExtensions;

    constructor(canvasElement: HTMLCanvasElement) {
        if (isWebGL2Supported()) {
            const gl = canvasElement.getContext("webgl2");
            assert(gl !== null, "Failed to create WebGL2 context");

            this.gl = gl;
            this.contextUID = (uidCounter++).toString(16);

            this.extensions = {} as IRendererExtensions;
            this.extensions.texture = new TextureExtension(this);
            this.extensions.shader = new ShaderExtension(this);
            this.extensions.batch = new BatchRendererExtension(this);
        } else {
            alert("WebGL2 is not supported in your browser!");
            throw new Error("WebGL2 not supported!");
        }
    }

    update(): void {
        const gl = this.gl;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }

    set backgroundColor(hexColor: number) {
        const rgbColor = hexToRGBA(hexColor);
        this.gl.clearColor(rgbColor[0], rgbColor[1], rgbColor[2], rgbColor[3]);
    }
}
