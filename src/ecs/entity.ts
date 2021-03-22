import { Component, ECSManager } from "./ecs_manager";
import { assert } from "../utils/misc";
import { AnyCtor } from "../utils/types";

export class Entity {
    componentMap: Map<string, Component> = new Map();

    private _ecsManager: ECSManager;

    constructor(manager: ECSManager) {
        this._ecsManager = manager;
    }

    addComponent<T extends Component>(component: T): T {
        const typeName = component.constructor.name;
        assert(!this.componentMap.has(typeName), `Component '${typeName}' already exists!`);
        this.componentMap.set(typeName, component);

        this._ecsManager.entityComponentAdd(this, typeName);
        return component as T;
    }

    removeComponent(componentType: AnyCtor<Component> | string): void {
        const typeName = (componentType as AnyCtor<Component>).name ?? componentType;
        assert(this.componentMap.has(typeName), `Component '${typeName}' does not exist!`);

        this._ecsManager.entityComponentRemove(this, typeName);
        this.componentMap.delete(typeName);
    }

    hasComponent(componentType: AnyCtor<Component> | string): boolean {
        const typeName = (componentType as AnyCtor<Component>).name ?? componentType;
        return this.componentMap.has(typeName);
    }

    hasAllComponents(componentTypes: AnyCtor<Component>[] | string[]): boolean {
        for (let i = 0; i < componentTypes.length; i++) {
            if (!this.hasComponent(componentTypes[i])) return false;
        }

        return true;
    }

    getComponent<T extends Component>(componentType: AnyCtor<T> | string): T {
        const typeName = (componentType as AnyCtor<Component>).name ?? componentType;
        const component = this.componentMap.get(typeName);
        assert(component !== undefined, `Component '${typeName}' does not exist!`);
        return component as T;
    }

    destroy(): void {
        for (const [typeName] of this.componentMap) {
            this.removeComponent(typeName);
        }
    }
}
