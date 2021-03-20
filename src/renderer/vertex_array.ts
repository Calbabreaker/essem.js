import { assert } from "../utils/misc";

export class VertexArray {
    glVertexArray: WebGLVertexArrayObject;
    glIndexBuffer: WebGLBuffer | null = null;
    glVertexBuffers: WebGLBuffer[] = [];

    constructor(gl: WebGL2RenderingContext) {
        const glVertexArray = gl.createVertexArray();
        assert(glVertexArray !== null, "Failed to create vertex array!");
        this.glVertexArray = glVertexArray;
    }

    bind(gl: WebGL2RenderingContext) {
        gl.bindVertexArray(this.glVertexArray);
    }

    addVertexBuffer(
        gl: WebGL2RenderingContext,
        vertices: Float32Array | Float64Array,
        usage: number = WebGL2RenderingContext.STATIC_DRAW
    ): WebGLBuffer {
        this.bind(gl);
        const glVertexBuffer = gl.createBuffer();
        assert(glVertexBuffer !== null, "Failed to create vertex buffer!");

        gl.bindBuffer(gl.ARRAY_BUFFER, glVertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, usage);

        this.glVertexBuffers.push(glVertexBuffer);
        return glVertexBuffer;
    }

    setIndexBuffer(
        gl: WebGL2RenderingContext,
        indices: Uint8Array | Uint16Array | Uint32Array
    ): WebGLBuffer {
        this.bind(gl);
        const glIndexBuffer = gl.createBuffer();
        assert(glIndexBuffer !== null, "Failed to create index buffer!");

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, glIndexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

        this.glIndexBuffer = glIndexBuffer;
        return glIndexBuffer;
    }

    dispose(gl: WebGL2RenderingContext) {
        this.glVertexBuffers.forEach((buffer) => {
            gl.deleteBuffer(buffer);
        });

        gl.deleteBuffer(this.glIndexBuffer);
        gl.deleteVertexArray(this.glVertexArray);
    }
}
