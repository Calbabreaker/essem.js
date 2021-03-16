import { Component, Manager } from "./manager";
import { AnyCtor } from "../utils/types";
import { Entity } from "./entity";
import { assert } from "../utils/misc";

export abstract class System {
    entities: Set<Entity> = new Set();
    typeNames: string[] = [];
    private _manager: Manager;

    abstract onInit(): void;
    abstract onUpdate(delta: number): void;

    constructor(manager: Manager) {
        this._manager = manager;
    }

    setTypes(...componentTypes: AnyCtor<Component>[] | string[]): void {
        this.typeNames = [];
        for (const componentType of componentTypes) {
            const typeName = (componentType as AnyCtor<Component>).name ?? componentType;
            const systemSet = this._manager.typeNameToSystem.get(typeName);
            assert(systemSet !== undefined, `Component '${typeName}' has not been registered!`);

            systemSet.push(this);
            this.typeNames.push(typeName);
        }
    }
}
