import { Component, Manager } from "./manager";
import { assert } from "../utils/misc";
import { AnyCtor } from "../utils/types";

export class Entity {
    id: number;
    destroyed: boolean = false;

    componentMap: Map<string, Component>;

    // @ts-ignore
    private _manager: Manager;

    constructor(id: number) {
        this.id = id;
        this.componentMap = new Map();
    }

    addComponent<T extends Component>(component: T): T {
        const typeName = component.constructor.name;
        const entitySet = this._manager.getEntityIDSet(typeName);
        assert(!this.componentMap.has(typeName), `Component '${typeName}' already exists!`);

        this.componentMap.set(typeName, component);
        entitySet.add(this.id);
        return component;
    }

    removeComponent<T extends Component>(componentType: AnyCtor<T> | string): void {
        const typeName = (componentType as AnyCtor<T>).name ?? componentType;
        const entitySet = this._manager.getEntityIDSet(typeName);
        assert(this.componentMap.has(typeName), `Component '${typeName}' does not exist!`);

        this.componentMap.delete(typeName);
        entitySet.delete(this.id);
    }

    hasComponent<T extends Component>(componentType: AnyCtor<T> | string): boolean {
        const typeName = (componentType as AnyCtor<T>).name ?? componentType;
        return this.componentMap.has(typeName);
    }

    getComponent<T extends Component>(componentType: AnyCtor<T> | string): T {
        const typeName = (componentType as AnyCtor<T>).name ?? componentType;
        const component = this.componentMap.get(typeName);
        assert(component !== undefined, `Component '${typeName}' does not exist!`);
        return component as T;
    }

    destroy(): void {
        if (this.destroyed) return;

        for (const [typeName] of this.componentMap) {
            this.removeComponent(typeName);
        }

        this.destroyed = true;
    }

    _setup(): void {
        if (!this.destroyed) return;

        this.destroyed = false;
    }
}
