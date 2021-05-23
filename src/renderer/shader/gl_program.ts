import { ArrayTypes, Dictionary } from "src/utils/types";

export interface IProgramUniformData {
    location: WebGLUniformLocation;
    cachedValue: ArrayTypes | boolean | number;
}

export interface IProgramAttributeData {
    location: number;
}

export class GLProgram {
    handle: WebGLProgram;
    uniformDatas: Dictionary<IProgramUniformData> = {};
    attributeDatas: Dictionary<IProgramAttributeData> = {};

    constructor(handle: WebGLProgram) {
        this.handle = handle;
    }
}
