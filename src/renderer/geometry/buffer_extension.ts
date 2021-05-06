import { assert } from "src/utils/misc";
import { BUFFER_TYPE } from "src/utils/constants";
import { Renderer } from "../renderer";
import { Buffer } from "./buffer";
import { GLBuffer } from "./gl_buffer";

export class BufferExtension {
    renderer: Renderer;
    boundBuffers: { [key: number]: Buffer | null } = {};

    constructor(renderer: Renderer) {
        this.renderer = renderer;
    }

    bindBuffer(buffer: Buffer): GLBuffer {
        const { gl, contextUID } = this.renderer;

        const glBuffer = buffer.glBuffers[contextUID] ?? this.initBuffer(buffer);
        if (this.boundBuffers[buffer.type] !== buffer) {
            this.boundBuffers[buffer.type] = buffer;
            gl.bindBuffer(buffer.type, glBuffer.handle);
        }

        return glBuffer;
    }

    /**
     * Unbinds a buffer or all buffers.
     *
     * @param bufferType - The type of buffer to unbind. Leaving this undefined will unbind all buffers.
     */
    unbindBuffer(bufferType?: BUFFER_TYPE): void {
        const { gl } = this.renderer;

        if (bufferType !== undefined) {
            gl.bindBuffer(bufferType, null);
            this.boundBuffers[bufferType] = null;
        } else {
            gl.bindBuffer(BUFFER_TYPE.VERTEX_BUFFER, null);
            gl.bindBuffer(BUFFER_TYPE.INDEX_BUFFER, null);
        }
    }

    updateBuffer(buffer: Buffer): void {
        const { gl, contextUID } = this.renderer;

        let glBuffer = buffer.glBuffers[contextUID];
        if (buffer.dirtyID === glBuffer?.dirtyID) return;

        glBuffer = this.bindBuffer(buffer);
        if (buffer.dataSubLength !== undefined) {
            gl.bufferSubData(buffer.type, 0, buffer.data, 0, buffer.dataSubLength);
        } else {
            const usageType = buffer.isStatic ? gl.STATIC_DRAW : gl.DYNAMIC_DRAW;
            gl.bufferData(buffer.type, buffer.data, usageType);
        }

        glBuffer.dirtyID = buffer.dirtyID;
    }

    initBuffer(buffer: Buffer): GLBuffer {
        const { gl, contextUID } = this.renderer;

        const webglBuffer = gl.createBuffer();
        assert(webglBuffer !== null, "Failed to create WebGL buffer!");
        const glBuffer = new GLBuffer(webglBuffer);
        buffer.glBuffers[contextUID] = glBuffer;
        return glBuffer;
    }
}
