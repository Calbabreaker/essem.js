import { sayHello } from "./utils/browser";
import { isEmpty } from "./utils/misc";

export * from "./core/application";
export * from "./core/canvas";

export * from "./ecs/systems/sprite_renderer_system";
export * from "./ecs/components";
export * from "./ecs/ecs_manager";
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
export * from "./utils/misc";

export const VERSION = "$_VERSION";

window.addEventListener("load", () => {
    sayHello();
});

if (!isEmpty(window.ESSEM)) throw new Error("essem.js is already imported!");
