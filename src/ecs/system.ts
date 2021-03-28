import { Component, ECSManager } from "./ecs_manager";
import { AnyCtor } from "../utils/types";
import { Entity } from "./entity";
import { mapGet } from "../utils/misc";
import { Application } from "../core/application";

export abstract class System {
    entities: Entity[] = [];
    typeNames: string[] = [];
    private _ecsManager: ECSManager;

    setup(_app: Application): void {
        // to override
    }

    onEntityAdd?(_entity: Entity): void {
        // to override (optional)
    }

    constructor(manager: ECSManager) {
        this._ecsManager = manager;
    }

    setComponents(...componentTypes: AnyCtor<Component>[] | string[]): void {
        this.typeNames = [];
        for (const componentType of componentTypes) {
            const typeName = (componentType as AnyCtor<Component>).name ?? componentType;
            const systems = mapGet(this._ecsManager.typeNameToSystem, typeName, Array);
            systems.push(this);
            this.typeNames.push(typeName);
        }
    }
}
