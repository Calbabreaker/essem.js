import { Renderer } from "../renderer";
import { VertexArray } from "../vertex_array";
import batchVertexSrc from "./batch_vert.glsl";
import batchFragmentSrc from "./batch_frag.glsl";
import { Texture } from "../texture/texture";
import { Matrix3 } from "src/math/matrix3";
import { Shader } from "../shader/shader";

export interface IBatchableElement {
    texture: Texture;
    vertexData: Float32Array;
    rgbaColor: Float32Array;
    uvs: Float32Array;
}

/**
 * Renderer that batches vertices for speed.
 *
 * @memberof ESSEM
 */
export class BatchRendererExtension {
    static readonly vertexSize = 9; // position (2) + texCoord (2) + texture index (1) + color (4)
    static readonly maxDraws = 1000;
    static readonly maxVertices =
        BatchRendererExtension.maxDraws * 4 * BatchRendererExtension.vertexSize;
    static readonly maxIndices = BatchRendererExtension.maxDraws * 6;
    static readonly maxVerticesBytes =
        BatchRendererExtension.maxVertices * Float32Array.BYTES_PER_ELEMENT;

    renderer: Renderer;
    vertexArray: VertexArray;
    vertexBuffer: WebGLBuffer;
    textureShader: Shader;
    textureSlots: Texture[];
    textureToSlotMap: Map<Texture, number> = new Map();
    vertices: Float32Array = new Float32Array(BatchRendererExtension.maxVertices);
    indices: Uint16Array = new Uint16Array(BatchRendererExtension.maxIndices);
    verticesIndex = 0;
    indicesCount = 0;
    textureSlotIndex = 0;

    constructor(renderer: Renderer) {
        this.renderer = renderer;
        const { gl } = renderer;

        this.vertexArray = new VertexArray(gl);
        this.vertexBuffer = this.vertexArray.addVertexBuffer(gl, this.vertices, gl.DYNAMIC_DRAW);

        for (let i = 0, offset = 0; i < BatchRendererExtension.maxIndices; i += 6, offset += 4) {
            this.indices[i] = offset;
            this.indices[i + 1] = offset + 1;
            this.indices[i + 2] = offset + 2;

            this.indices[i + 3] = offset + 2;
            this.indices[i + 4] = offset + 3;
            this.indices[i + 5] = offset;
        }

        this.vertexArray.setIndexBuffer(gl, this.indices);

        const stride = BatchRendererExtension.vertexSize * Float32Array.BYTES_PER_ELEMENT;
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, stride, 0);
        gl.enableVertexAttribArray(1);
        gl.vertexAttribPointer(1, 2, gl.FLOAT, false, stride, 2 * Float32Array.BYTES_PER_ELEMENT);
        gl.enableVertexAttribArray(2);
        gl.vertexAttribPointer(2, 1, gl.FLOAT, false, stride, 4 * Float32Array.BYTES_PER_ELEMENT);
        gl.enableVertexAttribArray(3);
        gl.vertexAttribPointer(3, 4, gl.FLOAT, false, stride, 5 * Float32Array.BYTES_PER_ELEMENT);

        this.textureShader = new Shader(batchVertexSrc, batchFragmentSrc, "Sprite");

        const maxTextureSlots = renderer.extensions.texture.boundTextures.length;
        const samplers = new Int32Array(maxTextureSlots).map((_, i) => i);
        this.textureShader.uniforms.u_textures = samplers;

        this.textureSlots = new Array(maxTextureSlots).fill(undefined);
    }

    beginScene(viewProjection: Matrix3): void {
        this.textureShader.uniforms.u_viewProjection = viewProjection;
        this.startBatch();
    }

    endScene(): void {
        this.flush();
    }

    startBatch(): void {
        this.verticesIndex = 0;
        this.indicesCount = 0;
        this.textureSlotIndex = 0;
    }

    nextBatch(): void {
        this.flush();
        this.startBatch();
    }

    render(batchableElement: IBatchableElement): void {
        const { vertexData, uvs, rgbaColor } = batchableElement;

        for (let i = 0; i < vertexData.length; i += 2) {
            this.vertices[this.verticesIndex++] = vertexData[i];
            this.vertices[this.verticesIndex++] = vertexData[i + 1];
            this.vertices[this.verticesIndex++] = uvs[i];
            this.vertices[this.verticesIndex++] = uvs[i + 1];
            this.vertices[this.verticesIndex++] = this.getTextureSlot(batchableElement.texture);
            this.vertices[this.verticesIndex++] = rgbaColor[0];
            this.vertices[this.verticesIndex++] = rgbaColor[1];
            this.vertices[this.verticesIndex++] = rgbaColor[2];
            this.vertices[this.verticesIndex++] = rgbaColor[3];
        }

        this.indicesCount += 6;
    }

    flush(): void {
        if (this.indicesCount === 0 || this.verticesIndex === 0) return;

        const { gl, extensions } = this.renderer;

        extensions.shader.bindShader(this.textureShader);

        // set buffer data
        const vertices =
            this.verticesIndex === BatchRendererExtension.maxVertices
                ? this.vertices
                : this.vertices.subarray(0, this.verticesIndex);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, vertices);

        // bind textures
        for (let i = 0; i < this.textureSlotIndex; i++) {
            extensions.texture.bindTexture(this.textureSlots[i], i);
        }

        // now draw!
        this.vertexArray.bind(gl);
        gl.drawElements(gl.TRIANGLES, this.indicesCount, gl.UNSIGNED_SHORT, 0);
    }

    getTextureSlot(texture: Texture): number {
        const { extensions } = this.renderer;

        let slot = this.textureToSlotMap.get(texture);
        if (slot === undefined) {
            if (this.textureSlotIndex >= extensions.texture.boundTextures.length) this.nextBatch();

            slot = this.textureSlotIndex;
            this.textureSlots[this.textureSlotIndex] = texture;
            this.textureToSlotMap.set(texture, this.textureSlotIndex);
            this.textureSlotIndex++;
        }

        return slot;
    }
}
