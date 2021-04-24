import { ArrayTypes, Dict } from "src/utils/types";

export interface IProgramUniformData {
    location: WebGLUniformLocation;
    cachedValue: ArrayTypes | boolean | number;
}

export class GLProgram {
    handle: WebGLProgram;
    uniformDatas: Dict<IProgramUniformData> = {};

    constructor(handle: WebGLProgram) {
        this.handle = handle;
    }
}
