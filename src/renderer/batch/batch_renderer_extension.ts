import { Renderer } from "../renderer";
import batchVertexSrc from "./batch_vert.glsl";
import batchFragmentSrc from "./batch_frag.glsl";
import { Texture } from "../texture/texture";
import { Matrix3 } from "src/math/matrix3";
import { Shader } from "../shader/shader";
import { Geometry } from "../geometry/geometry";
import { settings } from "src/utils/settings";
import { Buffer, BufferLayout } from "../geometry/buffer";

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
    renderer: Renderer;
    shader: Shader;
    geometry: Geometry;

    vertices: Float32Array;
    textureSlots: Texture[];
    verticesIndex = 0;
    textureSlotIndex = 0;

    constructor(renderer: Renderer) {
        this.renderer = renderer;
        const {
            extensions: { geometry: geometryExt },
        } = renderer;

        this.geometry = new Geometry();

        const bufferLayout = new BufferLayout([
            { name: "a_position", dataType: "float2" },
            { name: "a_texCoord", dataType: "float2" },
            { name: "a_texIndex", dataType: "float1" },
            { name: "a_color", dataType: "float4" },
        ]);

        this.vertices = new Float32Array(
            settings.BATCH_SIZE * 4 * bufferLayout.totalComponentCount
        );
        const vertexBuffer = new Buffer(this.vertices, false);

        this.geometry.addVertexBuffer(vertexBuffer, bufferLayout);

        const indicies = new Uint16Array(settings.BATCH_SIZE * 6);
        for (let i = 0, offset = 0; i < indicies.length; i += 6, offset += 4) {
            indicies[i] = offset;
            indicies[i + 1] = offset + 1;
            indicies[i + 2] = offset + 2;
            indicies[i + 3] = offset + 2;
            indicies[i + 4] = offset + 3;
            indicies[i + 5] = offset;
        }

        this.geometry.setIndexBuffer(indicies);

        this.shader = new Shader(batchVertexSrc, batchFragmentSrc, "Sprite");

        const maxTextureSlots = renderer.extensions.texture.boundTextures.length;
        const samplers = new Int32Array(maxTextureSlots).map((_, i) => i);
        this.shader.uniforms.u_textures = samplers;

        geometryExt.bindGeometry(this.geometry, this.shader);

        this.textureSlots = new Array(maxTextureSlots).fill(undefined);
    }

    beginScene(viewProjection: Matrix3): void {
        this.shader.uniforms.u_viewProjection = viewProjection;
        this.startBatch();
    }

    endScene(): void {
        this.flush();
    }

    startBatch(): void {
        this.verticesIndex = 0;
        this.textureSlotIndex = 0;
    }

    nextBatch(): void {
        this.flush();
        this.startBatch();
    }

    render(batchableElement: IBatchableElement): void {
        if (this.verticesIndex >= this.vertices.length - 1) this.nextBatch();

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
    }

    flush(): void {
        if (this.verticesIndex === 0) return;
        const { gl, extensions } = this.renderer;

        const vertexBuffer = this.geometry.vertexBuffers[0];
        vertexBuffer.update(this.vertices, this.verticesIndex);
        extensions.geometry.bindGeometry(this.geometry, this.shader);

        extensions.shader.bindShader(this.shader);

        for (let i = 0; i < this.textureSlotIndex; i++) {
            extensions.texture.bindTexture(this.textureSlots[i], i);
        }

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const indicesCount = (this.verticesIndex / vertexBuffer.layout!.stride) * 6;
        gl.drawElements(gl.TRIANGLES, indicesCount, gl.UNSIGNED_SHORT, 0);
    }

    getTextureSlot(texture: Texture): number {
        const { extensions } = this.renderer;

        let slot: number | undefined;
        for (let i = 0; i < this.textureSlotIndex; i++) {
            if (this.textureSlots[i] === texture) {
                slot = i;
                break;
            }
        }

        if (slot === undefined) {
            if (this.textureSlotIndex >= extensions.texture.boundTextures.length) this.nextBatch();

            this.textureSlots[this.textureSlotIndex] = texture;
            slot = this.textureSlotIndex;
            this.textureSlotIndex++;
        }

        return slot;
    }
}
