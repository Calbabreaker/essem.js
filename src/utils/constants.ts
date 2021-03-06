export enum TEXTURE_FORMATS {
    ALPHA = 6406,
    DEPTH_COMPONENT = 6402,
    DEPTH_STENCIL = 34041,
    LUMINANCE = 6409,
    LUMINANCE_ALPHA = 6410,
    RED = 6403,
    RGB = 6407,
    RGBA = 6408,
}

export enum TEXTURE_TARGETS {
    TEXTURE_2D = 3553,
    TEXTURE_CUBE_MAP = 34067,
    TEXTURE_2D_ARRAY = 35866,
}

export enum TEXTURE_TYPES {
    FLOAT = 5126,
    HALF_FLOAT = 36193,
    UNSIGNED_BYTE = 5121,
    UNSIGNED_SHORT = 5123,
    UNSIGNED_SHORT_4_4_4_4 = 32819,
    UNSIGNED_SHORT_5_5_5_1 = 32820,
    UNSIGNED_SHORT_5_6_5 = 33635,
}

/**
 * Possible scale modes for textures.
 *
 * @memberof ESSEM
 * @property {number} NEAREST - No smooth scaling (pixelated look).
 * @property {number} LINEAR - Smooth scaling.
 */
export enum SCALE_MODES {
    NEAREST = 9728,
    LINEAR = 9729,
}

export enum WRAP_MODES {
    CLAMP = 33071,
    REPEAT = 10497,
    MIRRORED_REPEAT = 33648,
}

export enum SHADER_TYPES {
    FRAGMENT_SHADER = 35632,
    VERTEX_SHADER = 35633,
}

export enum BUFFER_TYPE {
    INDEX_BUFFER = 34963,
    VERTEX_BUFFER = 34962,
}

export const DEFAULT_TEXTURE_UVS: Float32Array = new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]);
