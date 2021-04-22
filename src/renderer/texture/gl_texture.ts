import { assert } from "src/utils/misc";

export class GLTexture {
    handle: WebGLTexture;
    dirtyID = -1;
    dirtyStyleID = -1;

    constructor(handle: WebGLTexture | null) {
        assert(handle !== null, "Failed to create WebGL texture");
        this.handle = handle;
    }
}
