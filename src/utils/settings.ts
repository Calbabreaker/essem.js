import { SCALE_MODES, WRAP_MODES } from "./constants";

export interface ISettings {
    SCALE_MODE: SCALE_MODES;
    WRAP_MODE: WRAP_MODES;
    SPRITE_BATCH_SIZE: number;
}

/**
 * Customizeable global defaults and settings for the user to set.
 *
 * @memberof ESSEM
 */
export const settings: ISettings = {
    SCALE_MODE: SCALE_MODES.LINEAR,
    WRAP_MODE: WRAP_MODES.MIRRORED_REPEAT,
    SPRITE_BATCH_SIZE: 1000,
};
