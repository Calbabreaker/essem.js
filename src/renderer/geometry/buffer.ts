import { ShaderDataTypes, shaderDataTypeSize } from "../shader/shader_utils";
import { BUFFER_TYPE } from "src/utils/constants";
import { Dict, TypedArrayTypes } from "src/utils/types";
import { GLBuffer } from "./gl_buffer";

export interface IAttribute {
    name: string;
    dataType: ShaderDataTypes;
    normalized?: boolean;
}

/**
 * A class representing a buffer of data that will be uploaded to the GPU.
 *
 * @memberof ESSEM
 */
export class Buffer {
    data: TypedArrayTypes;
    type: BUFFER_TYPE = BUFFER_TYPE.VERTEX_BUFFER;
    layout?: BufferLayout;
    glBuffers: Dict<GLBuffer | undefined> = {};
    dirtyID = 0;
    dataSubLength?: number;

    isStatic: boolean;

    /**
     * @param data - A fixed typed array like Float32Array or UInt32Array.
     * @param isStatic - Whether or not the data is static or dynamic.
     */
    constructor(data: TypedArrayTypes, isStatic = true, dataSubLength?: number) {
        this.data = data;
        this.isStatic = isStatic;
        this.dataSubLength = dataSubLength;
    }

    /**
     *  Marks the data buffer as needing a reupload to the GPU.
     *
     * @param [data=this.data] - The data to set as the buffer data.
     * @param dataSubLength - The length of the data to upload (as a portion) to the buffer (will
     *      use gl.bufferSubData()). Leaving this undefined will upload the full array normally.
     */
    update(data?: TypedArrayTypes | number[], dataSubLength?: number): void {
        if (data instanceof Array) {
            data = new Float32Array(data);
        }

        if (data !== undefined) this.data = data;
        this.dataSubLength = dataSubLength;
        this.dirtyID++;
    }
}

export class BufferElement {
    dataType: ShaderDataTypes;
    name: string;
    size: number;
    normalized: boolean;
    offset: number;
    componentCount: number;

    constructor(dataType: ShaderDataTypes, name: string, size: number, normalized = false) {
        this.dataType = dataType;
        this.name = name;
        this.size = size;
        this.normalized = normalized;
        this.offset = 0;
        this.componentCount = parseInt(dataType.charAt(dataType.length - 1));
    }
}

export class BufferLayout {
    elements: BufferElement[] = [];
    stride: number;
    totalComponentCount: number;

    constructor(attributes: IAttribute | IAttribute[]) {
        // make sure its an array
        if (!(attributes instanceof Array)) attributes = [attributes];

        this.stride = 0;
        this.totalComponentCount = 0;
        attributes.forEach((attribute) => {
            const element = new BufferElement(
                attribute.dataType,
                attribute.name,
                shaderDataTypeSize(attribute.dataType),
                attribute.normalized
            );

            element.offset = this.stride;
            this.stride += element.size;
            this.totalComponentCount += element.componentCount;
            this.elements.push(element);
        });
    }
}
