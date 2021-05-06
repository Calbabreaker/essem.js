import { BUFFER_TYPE } from "src/utils/constants";
import { AnyCtor, Dict, TypedArrayTypes } from "src/utils/types";
import { Buffer, BufferLayout, IAttribute } from "./buffer";

export class Geometry {
    vertexBuffers: Buffer[] = [];
    indexBuffer?: Buffer;
    glVAOs: Dict<Dict<WebGLVertexArrayObject | undefined> | undefined> = {};

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

    setIndexBuffer(bufferParam: Buffer | TypedArrayTypes | number[]): void {
        const buffer = ensureBuffer(bufferParam, Uint16Array);
        buffer.type = BUFFER_TYPE.INDEX_BUFFER;
        this.indexBuffer = buffer;
    }
}

function ensureBuffer(
    buffer: Buffer | TypedArrayTypes | number[],
    typedArrayClass: AnyCtor<TypedArrayTypes>
) {
    if (!(buffer instanceof Buffer)) {
        if (buffer instanceof Array) {
            buffer = new typedArrayClass(buffer);
        }

        buffer = new Buffer(buffer);
    }

    return buffer;
}
