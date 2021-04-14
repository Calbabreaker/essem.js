import { AnyCtor } from "../utils/types";
import { Component, Entity } from "./entity";
import { mapGet } from "../utils/misc";
import { Application } from "core/application";
import { Scene } from "./scene";

export type SystemClass = { new (scene: Scene): System };

/**
 * System base class to extend to collect all the wanted entities and do stuff to them.
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
     * Use like this: `this.setComponents(Component1, Componen2, ...);`
     *
     * @param {...(ComponentClass | string)} componentTypes - Parameterised array of component
     *        classes or component names.
     */
    setComponents(...componentTypes: AnyCtor<Component>[] | string[]): void {
        this.typeNames = [];
        for (const componentType of componentTypes) {
            const typeName = (componentType as AnyCtor<Component>).name ?? componentType;
            const systems = mapGet(this.scene._typeNameToSystem, typeName, Array);
            systems.push(this);
            this.typeNames.push(typeName);
        }
    }
}
