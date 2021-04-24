/**
 * @namespace ESSEM
 */

export * from "./core/application";
export * from "./core/audio_clip";
export * from "./core/canvas";
export * from "./core/event_manager";
export * from "./core/input_events";
export * from "./core/loader";

export * from "./ecs/components/camera_component";
export * from "./ecs/components/sprite_component";
export * from "./ecs/components/transform_component";
export * from "./ecs/systems/camera_system";
export * from "./ecs/systems/sprite_renderer_system";
export * from "./ecs/entity";
export * from "./ecs/scene";
export * from "./ecs/system";

export * from "./renderer/batch_renderer_extension";
export * from "./renderer/renderer";
export * from "./renderer/shader/gl_program";
export * from "./renderer/shader/shader";
export * from "./renderer/shader/shader_extension";
export * from "./renderer/shader/shader_utils";
export * from "./renderer/shader/uniforms";
export * from "./renderer/texture/gl_texture";
export * from "./renderer/texture/texture";
export * from "./renderer/texture/texture_extension";
export * from "./renderer/vertex_array";

export * from "./math/common";
export * from "./math/vector2";
export * from "./math/matrix3";

export * from "./utils/browser";
export * from "./utils/colors";
export * from "./utils/constants";
export * from "./utils/misc";
export * from "./utils/settings";
export * from "./utils/types";

/**
 * The version of the essem.js library being used.
 *
 * @memberof ESSEM
 * @type string
 */
export const VERSION: string = "$_VERSION";

if (window.__ESSEM__) {
    throw new Error("essem.js is already imported!");
} else {
    window.__ESSEM__ = true;
}
