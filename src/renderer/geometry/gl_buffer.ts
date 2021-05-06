export class GLBuffer {
    handle: WebGLBuffer;
    dirtyID: number = -1;

    constructor(handle: WebGLBuffer) {
        this.handle = handle;
    }
}
