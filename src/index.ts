/**
 * @namespace ESSEM
 */

export * from "./core/application";
export * from "./core/canvas";
export * from "./core/codes";
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

export * from "./renderer/abstract_batch_renderer";
export * from "./renderer/renderer";
export * from "./renderer/shader";
export * from "./renderer/texture";
export * from "./renderer/vertex_array";

export * from "./math/common";
export * from "./math/vector2";
export * from "./math/matrix3";

export * from "./utils/browser";
export * from "./utils/colors";
export * from "./utils/misc";
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
