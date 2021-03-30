/**
 * Converts hexadecimal number to a rbga array.
 *
 * @param hex - Hexadecimal number. Alpha channel is default to 1.
 * @return RGBA array with values from 0 to 1.
 */
export function hexToRGBA(hex: number): Float32Array {
    const rgb = new Float32Array(4);
    if (hex <= 0xffffff) {
        rgb[0] = ((hex >> 16) & 0xff) / 255;
        rgb[1] = ((hex >> 8) & 0xff) / 255;
        rgb[2] = (hex & 0xff) / 255;
        rgb[3] = 1;
    } else {
        rgb[0] = ((hex >> 24) & 0xff) / 255;
        rgb[1] = ((hex >> 16) & 0xff) / 255;
        rgb[2] = ((hex >> 8) & 0xff) / 255;
        rgb[3] = (hex & 0xff) / 255;
    }

    return rgb;
}
