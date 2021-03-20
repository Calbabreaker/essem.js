import { Renderer } from "./renderer";
import { Shader } from "./shader";
import { VertexArray } from "./vertex_array";
import textureVertexSrc from "./shaders/texture_vert.glsl";
import textureFragmentSrc from "./shaders/texture_frag.glsl";

export abstract class AbstractBatchRenderer {
    static vertexSize = 2;
    static maxQuads = 1000;
    static maxVertices = AbstractBatchRenderer.maxQuads * 4 * AbstractBatchRenderer.vertexSize;
    static maxIndices = AbstractBatchRenderer.maxQuads * 6;
    static maxVerticesBytes = AbstractBatchRenderer.maxVertices * Float32Array.BYTES_PER_ELEMENT;

    renderer: Renderer;
    vertexArray: VertexArray;
    vertexBuffer: WebGLBuffer;
    textureShader: Shader;

    vertices: Float32Array = new Float32Array(AbstractBatchRenderer.maxVertices);
    indices: Uint16Array = new Uint16Array(AbstractBatchRenderer.maxIndices);
    verticesIndex = 0;
    indicesCount = 0;

    constructor(renderer: Renderer) {
        this.renderer = renderer;
        const gl = renderer.gl;

        this.textureShader = new Shader(textureVertexSrc, textureFragmentSrc, "Sprite");
        this.textureShader.init(gl);

        this.vertexArray = new VertexArray(gl);
        this.vertexBuffer = this.vertexArray.addVertexBuffer(gl, this.vertices, gl.DYNAMIC_DRAW);

        for (let i = 0, offset = 0; i < AbstractBatchRenderer.maxIndices; i += 6, offset += 4) {
            this.indices[i + 0] = offset + 0;
            this.indices[i + 1] = offset + 1;
            this.indices[i + 2] = offset + 2;

            this.indices[i + 3] = offset + 2;
            this.indices[i + 4] = offset + 3;
            this.indices[i + 5] = offset + 0;
        }

        this.vertexArray.setIndexBuffer(gl, this.indices);

        const stride = AbstractBatchRenderer.vertexSize * Float32Array.BYTES_PER_ELEMENT;
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, stride, 0);
    }

    beginScene() {
        // TODO: make this be a camera
        //const matrix = new Matrix3();

        const gl = this.renderer.gl;
        this.textureShader.bind(gl);
        //this.textureShader.setMatrix3(gl, "u_viewProjection", matrix);

        this.startBatch();
    }

    endScene() {
        this.flush();
    }

    startBatch() {
        this.verticesIndex = 0;
        this.indicesCount = 0;
    }

    nextBatch() {
        this.flush();
        this.startBatch();
    }

    flush() {
        if (this.indicesCount === 0 || this.verticesIndex === 0) return;

        const gl = this.renderer.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

        const vertices =
            this.verticesIndex === AbstractBatchRenderer.maxVertices
                ? this.vertices
                : this.vertices.subarray(0, this.verticesIndex);

        gl.bufferSubData(gl.ARRAY_BUFFER, 0, vertices);

        this.vertexArray.bind(gl);
        gl.drawElements(gl.TRIANGLES, this.indicesCount, gl.UNSIGNED_SHORT, 0);
    }
}
