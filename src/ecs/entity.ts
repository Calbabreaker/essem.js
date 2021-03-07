import { Manager } from "./manager";
import { assert } from "../utils/misc";
import { AnyCtor } from "../utils/types";

export class Entity {
    id: number;
    componentToIndexMap: Map<string, number>;

    private _manager: Manager;

    constructor(id: number) {
        this.id = id;
        this.componentToIndexMap = new Map();
    }

    addComponent<T extends Object>(component: T): T {
        const name = component.constructor.name;
        assert(!this.componentToIndexMap.has(name), `Component '${name}' already exists!`);

        const index = this._manager.entityComponentAdd(this, component);
        this.componentToIndexMap.set(name, index);
        return component;
    }

    removeComponent<T extends Object>(componentType: AnyCtor<T> | string): void {
        const name = (componentType as AnyCtor<T>).name ?? componentType;
        assert(this.componentToIndexMap.has(name), `Component '${name}' does not exist!`);

        const index = this.componentToIndexMap.get(name) as number;
        this._manager.entityComponentRemove(name, index);
        this.componentToIndexMap.delete(name);
    }

    hasComponent<T extends Object>(componentType: AnyCtor<T> | string): boolean {
        const name = (componentType as AnyCtor<T>).name ?? componentType;
        return this.componentToIndexMap.get(name) !== undefined;
    }

    getComponent<T extends Object>(componentType: AnyCtor<T> | string): T {
        const name = (componentType as AnyCtor<T>).name ?? componentType;
        assert(this.componentToIndexMap.has(name), `Component '${name}' does not exist!`);

        const index = this.componentToIndexMap.get(name) as number;
        return this._manager.entityComponentGet(name, index);
    }
}
