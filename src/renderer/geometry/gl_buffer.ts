export class GLBuffer {
    handle: WebGLBuffer;
    dirtyID = -1;

    constructor(handle: WebGLBuffer) {
        this.handle = handle;
    }
}
