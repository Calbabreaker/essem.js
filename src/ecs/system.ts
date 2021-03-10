import { Component, Manager } from "./manager";
import { AnyCtor } from "../utils/types";
import { Entity } from "./entity";
import { assert } from "../utils/misc";

export abstract class System {
    typeNames: string[];
    private _manager: Manager;
    private _entityGetCache: Entity[] | null;

    constructor(manager: Manager) {
        this._manager = manager;
    }

    abstract onInit(): void;
    abstract onUpdate(delta: number): void;

    setTypes(componentTypes: AnyCtor<Component>[] | string[]): void {
        this.typeNames = [];
        for (const componentType of componentTypes) {
            const typeName = (componentType as AnyCtor<Component>).name ?? componentType;
            assert(
                this._manager.componentToEntityIDsMap.has(typeName),
                `Component '${typeName}' has not been registered!`
            );
            this.typeNames.push(typeName);
        }
    }

    getEntities(): Entity[] {
        if (this._entityGetCache !== null) return this._entityGetCache;

        this._entityGetCache = [];
        for (const typeName of this.typeNames) {
            const entitySet = this._manager.componentToEntityIDsMap.get(typeName) as Set<Entity>;
            this._entityGetCache.push(...entitySet);
        }

        return this._entityGetCache;
    }
}
