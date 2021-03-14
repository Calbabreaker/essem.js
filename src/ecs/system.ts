import { Component, Manager } from "./manager";
import { AnyCtor } from "../utils/types";
import { Entity } from "./entity";

export abstract class System {
    signiture = "";
    entities: Set<Entity> = new Set();
    private _manager: Manager;

    constructor(manager: Manager) {
        this._manager = manager;
    }

    abstract onInit(): void;
    abstract onUpdate(delta: number): void;

    setTypes(...componentTypes: AnyCtor<Component>[] | string[]): void {
        const systemMap = this._manager.signitureToSystemMap;
        if (systemMap.has(this.signiture)) systemMap.delete(this.signiture);

        this.signiture = "";
        for (const componentType of componentTypes) {
            const typeName = (componentType as AnyCtor<Component>).name ?? componentType;
            this.signiture += typeName;
        }

        systemMap.set(this.signiture, this);
    }
}
