import { ArrayTypes, Dict } from "src/utils/types";

export interface IProgramUniformData {
    location: WebGLUniformLocation;
    cachedValue: ArrayTypes | boolean | number;
}

export interface IProgramAttributeData {
    location: number;
}

export class GLProgram {
    handle: WebGLProgram;
    uniformDatas: Dict<IProgramUniformData> = {};
    attributeDatas: Dict<IProgramAttributeData> = {};

    constructor(handle: WebGLProgram) {
        this.handle = handle;
    }
}
