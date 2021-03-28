import { Renderer } from "./renderer";
import { Shader } from "./shader";
import { VertexArray } from "./vertex_array";
import textureVertexSrc from "./shaders/texture_vert.glsl";
import textureFragmentSrc from "./shaders/texture_frag.glsl";
import { Texture } from "./texture";
import { Matrix3 } from "../math/matrix3";

export abstract class AbstractBatchRenderer {
    static readonly vertexSize = 5; // position (2) + texCoord (2) + texture index (1)
    static readonly maxDraws = 1000;
    static readonly maxVertices =
        AbstractBatchRenderer.maxDraws * 4 * AbstractBatchRenderer.vertexSize;
    static readonly maxIndices = AbstractBatchRenderer.maxDraws * 6;
    static readonly maxVerticesBytes =
        AbstractBatchRenderer.maxVertices * Float32Array.BYTES_PER_ELEMENT;

    renderer: Renderer;
    vertexArray: VertexArray;
    vertexBuffer: WebGLBuffer;
    textureShader: Shader;
    textureSlots: Texture[];
    textureToSlotMap: Map<Texture, number> = new Map();
    vertices: Float32Array = new Float32Array(AbstractBatchRenderer.maxVertices);
    indices: Uint16Array = new Uint16Array(AbstractBatchRenderer.maxIndices);
    verticesIndex = 0;
    indicesCount = 0;
    textureSlotIndex = 0;

    constructor(renderer: Renderer) {
        this.renderer = renderer;
        const gl = renderer.gl;

        this.vertexArray = new VertexArray(gl);
        this.vertexBuffer = this.vertexArray.addVertexBuffer(gl, this.vertices, gl.DYNAMIC_DRAW);

        for (let i = 0, offset = 0; i < AbstractBatchRenderer.maxIndices; i += 6, offset += 4) {
            this.indices[i] = offset;
            this.indices[i + 1] = offset + 1;
            this.indices[i + 2] = offset + 2;

            this.indices[i + 3] = offset + 2;
            this.indices[i + 4] = offset + 3;
            this.indices[i + 5] = offset;
        }

        this.vertexArray.setIndexBuffer(gl, this.indices);

        const stride = AbstractBatchRenderer.vertexSize * Float32Array.BYTES_PER_ELEMENT;
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, stride, 0);
        gl.enableVertexAttribArray(1);
        gl.vertexAttribPointer(1, 2, gl.FLOAT, false, stride, 2 * Float32Array.BYTES_PER_ELEMENT);
        gl.enableVertexAttribArray(2);
        gl.vertexAttribPointer(2, 1, gl.FLOAT, false, stride, 4 * Float32Array.BYTES_PER_ELEMENT);

        // TODO: abstract shader
        this.textureShader = new Shader(textureVertexSrc, textureFragmentSrc, "Sprite");
        this.textureShader.bind(gl);

        const samplers = new Int32Array(renderer.maxTextureSlots).map((i) => i);
        this.textureShader.setIntArray(gl, "u_textures", samplers);

        this.textureSlots = new Array(renderer.maxTextureSlots).fill(undefined);
    }

    beginScene(viewProjection: Matrix3): void {
        const gl = this.renderer.gl;
        this.textureShader.bind(gl);
        this.textureShader.setMatrix3(gl, "u_viewProjection", viewProjection);

        this.startBatch();
    }

    endScene(): void {
        this.flush();
    }

    startBatch(): void {
        this.verticesIndex = 0;
        this.indicesCount = 0;
    }

    nextBatch(): void {
        this.flush();
        this.startBatch();
        this.textureSlotIndex = 0;
    }

    flush(): void {
        if (this.indicesCount === 0 || this.verticesIndex === 0) return;

        const gl = this.renderer.gl;

        // set buffer data
        const vertices =
            this.verticesIndex === AbstractBatchRenderer.maxVertices
                ? this.vertices
                : this.vertices.subarray(0, this.verticesIndex);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, vertices);

        // bind textures
        for (let i = 0; i < this.textureSlotIndex; i++) {
            this.textureSlots[i].bind(gl, i);
        }

        // now draw!
        this.vertexArray.bind(gl);
        gl.drawElements(gl.TRIANGLES, this.indicesCount, gl.UNSIGNED_SHORT, 0);
    }

    getTextureSlot(texture: Texture): number {
        let slot = this.textureToSlotMap.get(texture);
        if (slot === undefined) {
            if (this.textureSlotIndex >= this.renderer.maxTextureSlots) this.nextBatch();

            slot = this.textureSlotIndex;
            this.textureSlots[this.textureSlotIndex] = texture;
            this.textureToSlotMap.set(texture, this.textureSlotIndex);
            this.textureSlotIndex++;
        }

        return slot;
    }
}
