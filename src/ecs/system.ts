import { Application } from "src/core/application";
import { ComponentClass, Entity } from "./entity";
import { Scene } from "./scene";
import { getTypeName } from "src/utils/misc";

export type SystemClass = new (scene: Scene) => System;

/**
 * System base class to extend to collect all the wanted entities and do stuff to them.
 * ## Example
 * ```js
 * // System that logs hello for each entity with a transform component
 * class HelloSystem extends ESSEM.System {
 *     setup(app) {
 *         app.eventManager.addListener(ESSEM.ApplicationUpdateEvent, this.onUpdate.bind(this));
 *         this.setComponents(ESSEM.TransformComponent);
 *     }
 *
 *     onUpdate() {
 *         for (entity of this.entities) {
 *             const transform = entity.getComponent(ESSEM.TransformComponent);
 *             console.log("Hello from: " + tranform.position.toString())
 *         }
 *     }
 * }
 *
 * const app = new ESSEM.Application();
 * app.registerSystem(HelloSystem);
 * const scene = app.createScene()
 *
 * // Logs "Hello from: Vector2(0, 1)" every frame
 * const entity = scene.createEntity();
 * entity.addComponent(new TransformComponent(new ESSEM.Vector2(0, 1)));
 * ```
 *
 * @memberof ESSEM
 */
export abstract class System {
    /**
     * The entities that have the system's component types.
     */
    entities: Entity[] = [];

    /**
     * The name of the component types that has been set.
     */
    typeNames: string[] = [];

    /**
     * The scene that the system is active on.
     */
    protected scene: Scene;

    constructor(scene: Scene) {
        this.scene = scene;
    }

    /**
     * Abstract function that gets called when the system is created. This should be overrided to
     * setup component types and event listeners.
     *
     * @param app - The application that the system was registed from. Use this to register event
     *        listeners and other stuff.
     */
    abstract setup(app: Application): void;

    /**
     * Optional abstract function that gets called whenever a matching entity gets added.
     *
     * @param entity - The entity that was added to this.entites.
     */
    onEntityAdd?(entity: Entity): void;

    /**
     * Sets the component types that the system will use to collect entities.
     * Note that previous sets of component types will not be removed and so new sets will just be
     * added on top.
     *
     * @param componentTypes - Array of component classes or names.
     */
    setComponents(componentTypes: (ComponentClass | string)[]): void {
        for (const componentType of componentTypes) {
            const typeName = getTypeName(componentType);
            this.scene._systemTypeNameAdd(this, typeName);
        }
    }
}
