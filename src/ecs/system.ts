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
    entities: Entity[] = [];
    typeNames: string[] = [];
    protected _scene: Scene;

    setup(_app: Application): void {
        // to override
    }

    onEntityAdd?(_entity: Entity): void {
        // to override (optional)
    }

    constructor(scene: Scene) {
        this._scene = scene;
    }

    setComponents(...componentTypes: AnyCtor<Component>[] | string[]): void {
        this.typeNames = [];
        for (const componentType of componentTypes) {
            const typeName = (componentType as AnyCtor<Component>).name ?? componentType;
            const systems = mapGet(this._scene._typeNameToSystem, typeName, Array);
            systems.push(this);
            this.typeNames.push(typeName);
        }
    }
}
