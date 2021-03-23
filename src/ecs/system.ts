import { Component, ECSManager } from "./ecs_manager";
import { AnyCtor } from "../utils/types";
import { Entity } from "./entity";
import { mapGet } from "../utils/misc";
import { Application } from "../core/application";

export abstract class System {
    entities: Set<Entity> = new Set();
    typeNames: string[] = [];
    private _ecsManager: ECSManager;

    setup(_app: Application): void {}
    onEntityAdd?(_entity: Entity): void {}

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
