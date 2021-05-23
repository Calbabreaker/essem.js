import { BUFFER_TYPE } from "src/utils/constants";
import { AnyConstructor, Dictionary, TypedArrayTypes } from "src/utils/types";
import { Buffer, BufferLayout, IAttribute } from "./buffer";

/**
 * Class for defining attribute information and buffers.
 *
 * ## Examples:
 *
 * Buffer per attribute:
 * ```js
 * const geometry = new ESSEM.Geometry();
 * geometry.addVertexBuffer([
 *     -0.5, -0.5, 0,
 *     -0.5,  0.5, 0,
 *      0.5,  0.5, 0,
 *      0.5, -0.5, 0,
 * ], { name: "a_position", dataType: "float3" });
 * geometry.addVertexBuffer([
 *      0, 0,
 *      0, 1,
 *      1, 1,
 *      1, 0,
 * ], { name: "a_texCoord", dataType: "float2" });
 *
 * Buffer for all attributes:
 * ```js
 * const geometry = new ESSEM.Geometry();
 * geometry.addVertexBuffer([
 *     -0.5, -0.5, 0,    0, 0,
 *     -0.5,  0.5, 0,    0, 1,
 *      0.5,  0.5, 0,    1, 1,
 *      0.5, -0.5, 0,    1, 0,
 * ], [
 *     { name: "a_position", dataType: "float3" },
 *     { name: "a_texCoord", dataType: "float2" },
 * ]);
 * ```
 *
 * @memberof ESSEM
 */
export class Geometry {
    vertexBuffers: Buffer[] = [];
    indexBuffer?: Buffer;
    glVAOs: Dictionary<Dictionary<WebGLVertexArrayObject | undefined> | undefined> = {};

    /**
     * Adds a vertex buffer to the geometry.
     *
     * @param bufferParam - A Buffer class, a typed array (Float32Array, Uint16Array) or a number
     *      array.
     * @param attributes - The attribute or attributes information of the buffer.
     */
    addVertexBuffer(
        bufferParam: Buffer | TypedArrayTypes | number[],
        attributes: IAttribute | IAttribute[] | BufferLayout
    ): this {
        const buffer = ensureBuffer(bufferParam, Float32Array);
        buffer.type = BUFFER_TYPE.VERTEX_BUFFER;
        buffer.layout =
            attributes instanceof BufferLayout ? attributes : new BufferLayout(attributes);
        this.vertexBuffers.push(buffer);
        return this;
    }

    /**
     * Adds a index buffer to the geometry.
     *
     * @param bufferParam - A Buffer class, a typed array (Float32Array, Uint16Array) or a number
     *      array.
     */
    setIndexBuffer(bufferParam: Buffer | TypedArrayTypes | number[]): void {
        const buffer = ensureBuffer(bufferParam, Uint16Array);
        buffer.type = BUFFER_TYPE.INDEX_BUFFER;
        this.indexBuffer = buffer;
    }
}

function ensureBuffer(
    buffer: Buffer | TypedArrayTypes | number[],
    typedArrayClass: AnyConstructor<TypedArrayTypes>
) {
    if (!(buffer instanceof Buffer)) {
        if (buffer instanceof Array) {
            buffer = new typedArrayClass(buffer);
        }

        buffer = new Buffer(buffer);
    }

    return buffer;
}
