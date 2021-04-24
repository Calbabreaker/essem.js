export class GLTexture {
    handle: WebGLTexture;
    dirtyID = -1;
    dirtyStyleID = -1;

    constructor(handle: WebGLTexture) {
        this.handle = handle;
    }
}
