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
     * Function that gets called when the system is created.
     * Override this to setup the component types and event listeners instead of the constructor
     * because constructor does wierd stuff.
     *
     * @param _app - The application that the system was registed from. Use this to register event
     *        listeners and other stuff.
     * @virtual
     */
    setup(_app: Application): void {
        // to override
    }

    /**
     * Function that gets called when a entity that matches the components gets added.
     * Optional override.
     *
     * @param _entity - The entity that was added to this.entites.
     * @virtual
     */
    onEntityAdd?(_entity: Entity): void {
        // to override (optional)
    }

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
