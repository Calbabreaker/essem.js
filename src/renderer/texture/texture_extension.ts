import { assert } from "src/utils/misc";
import { Renderer } from "../renderer";
import { GLTexture } from "./gl_texture";
import { Texture } from "./texture";

export class TextureExtension {
    boundTextures: (Texture | null)[];
    currentSlot = -1;

    renderer: Renderer;

    constructor(renderer: Renderer) {
        this.renderer = renderer;

        const { gl } = this.renderer;

        this.boundTextures = new Array(gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS)).fill(null);
    }

    bindTexture(texture: Texture, slot: number = 0): void {
        const { gl, contextUID } = this.renderer;

        assert(
            this.boundTextures[slot] !== undefined,
            `Can't bind texture at invalid slot ${slot}!`
        );

        const glTexture = texture.glTextures[contextUID] ?? this.initTexture(texture);
        if (this.boundTextures[slot] !== texture) {
            this.setActiveTextureSlot(slot);

            gl.bindTexture(texture.target, glTexture.handle);
            this.boundTextures[slot] = texture;
        }

        if (texture.dirtyID !== glTexture.dirtyID) this.updateTexture(texture, glTexture);
    }

    unbindTexture(texture: Texture): void {
        const { gl } = this.renderer;

        for (let i = 0; i < this.boundTextures.length; i++) {
            if (this.boundTextures[i] === texture) {
                this.setActiveTextureSlot(i);

                gl.bindTexture(texture.target, null);
                this.boundTextures[i] = null;
                return;
            }
        }
    }

    initTexture(texture: Texture): GLTexture {
        const { gl, contextUID } = this.renderer;

        const webglTexture = gl.createTexture();
        assert(webglTexture !== null, "Failed to create WebGL texture");
        const glTexture = new GLTexture(webglTexture);
        texture.glTextures[contextUID] = glTexture;
        return glTexture;
    }

    updateTexture(texture: Texture, glTexture: GLTexture): void {
        const { gl } = this.renderer;

        if (texture.dirtyStyleID !== glTexture.dirtyStyleID)
            this.updateTextureStyle(texture, glTexture);

        gl.texImage2D(
            texture.target,
            0,
            texture.format,
            texture.format,
            texture.dataType,
            texture.source
        );
        glTexture.dirtyID = texture.dirtyID;
    }

    updateTextureStyle(texture: Texture, glTexture: GLTexture): void {
        const { gl } = this.renderer;

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, texture.wrapMode);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, texture.wrapMode);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, texture.scaleMode);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, texture.scaleMode);
        texture.dirtyStyleID = glTexture.dirtyStyleID;
    }

    destroyTexture(texture: Texture): void {
        const { gl, contextUID } = this.renderer;

        const glTexture = texture.glTextures[contextUID];
        if (glTexture !== undefined) {
            this.unbindTexture(texture);
            gl.deleteTexture(glTexture.handle);
            delete texture.glTextures[contextUID];
        }
    }

    setActiveTextureSlot(slot: number): void {
        const { gl } = this.renderer;

        if (this.currentSlot !== slot) {
            gl.activeTexture(gl.TEXTURE0 + slot);
            this.currentSlot = slot;
        }
    }
}
