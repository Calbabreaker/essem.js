import { assert } from "../utils/misc";

export class Renderer {
    gl: WebGL2RenderingContext;

    constructor(canvasElement: HTMLCanvasElement) {
        const gl = canvasElement.getContext("webgl2");
        assert(gl !== null, "Failed to create WebGL2 context");

        this.gl = gl;
    }
}
