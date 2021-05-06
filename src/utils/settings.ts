import { SCALE_MODES, WRAP_MODES } from "./constants";

export interface ISettings {
    SCALE_MODE: SCALE_MODES;
    WRAP_MODE: WRAP_MODES;
    BATCH_SIZE: number;
}

/**
 * Customizeable global defaults and settings for the user to set.
 *
 * @namespace ESSEM.settings
 */
export const settings: ISettings = {
    /**
     * Default ESSEM.SCALE_MODE for all textures.
     * You can set this to SCALE_MODES.NEAREST for no interpolation (pixelated look).
     *
     * @memberof ESSEM.settings
     * @type {ESSEM.SCALE_MODES}
     * @default ESSEM.SCALE_MODES.NEAREST
     */
    SCALE_MODE: SCALE_MODES.LINEAR,
    WRAP_MODE: WRAP_MODES.MIRRORED_REPEAT,
    BATCH_SIZE: 1000,
};
