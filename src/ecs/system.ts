import { Application } from "src/core/application";
import { ComponentClass, Entity } from "./entity";
import { Scene } from "./scene";
import { assert, getTypeName } from "src/utils/misc";
import { ECSManager } from "./ecs_manager";
import { Query } from "./query";

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

    protected ecsManager: ECSManager;

    constructor(ecsManager: ECSManager) {
        this.ecsManager = ecsManager;
    }

    /**
     * Abstract function that gets called when the system is created. This should be overrided to
     * setup component types and event listeners.
     *
     * @param app - The application that the system was registed from. Use this to register event
     *        listeners and other stuff.
     */
    abstract setup(app: Application): void;

    addQuery(componentTagTypes: (ComponentClass | string)[]) {
        const query = new Query([]);
        componentTagTypes.forEach((componentTagType) => {
            const typeName = getTypeName(componentTagType);
            query.typeNames.push(typeName);

            const queries = this.ecsManager.typeNameToQuery.get(typeName);
            assert(queries, `${typeName} has not been registered!`);

            queries.push(query);
        });
    }
}
