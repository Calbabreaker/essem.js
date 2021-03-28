import { assert } from "utils/misc";
import { isWebGL2Supported } from "utils/browser";

export class Renderer {
    readonly gl: WebGL2RenderingContext;
    maxTextureSlots: number;

    constructor(canvasElement: HTMLCanvasElement) {
        if (isWebGL2Supported()) {
            const gl = canvasElement.getContext("webgl2");
            assert(gl !== null, "Failed to create WebGL2 context");
            this.gl = gl;

            this.maxTextureSlots = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
        } else {
            alert("WebGL2 is not supported in your browser!");
            throw new Error("WebGL2 not supported!");
        }
    }
}
