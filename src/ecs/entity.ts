import { Component, ECSManager } from "./ecs_manager";
import { assert } from "../utils/misc";
import { AnyCtor } from "../utils/types";

export class Entity {
    _componentMap: Map<string, Component> = new Map();
    _systemIndexMap: Map<string, number> = new Map();
    _arrayIndex = 0;
    private _ecsManager: ECSManager;

    active = false;
    destroyed = true;

    constructor(manager: ECSManager) {
        this._ecsManager = manager;
    }

    setActive(active: boolean): void {
        if (this._componentMap.size !== 0 && this.active !== active) {
            for (const [typeName] of this._componentMap) {
                active
                    ? this._ecsManager.entityComponentAdd(this, typeName)
                    : this._ecsManager.entityComponentRemove(this, typeName);
            }
        }

        this.active = active;
    }

    addComponent<T extends Component>(component: T): T {
        const typeName = component.constructor.name;
        assert(!this._componentMap.has(typeName), `Component '${typeName}' already exists!`);
        this._componentMap.set(typeName, component);

        this._ecsManager.entityComponentAdd(this, typeName);
        return component as T;
    }

    removeComponent(componentType: AnyCtor<Component> | string): void {
        const typeName = (componentType as AnyCtor<Component>).name ?? componentType;
        assert(this._componentMap.has(typeName), `Component '${typeName}' does not exist!`);

        this._ecsManager.entityComponentRemove(this, typeName);
        this._componentMap.delete(typeName);
    }

    hasComponent(componentType: AnyCtor<Component> | string): boolean {
        const typeName = (componentType as AnyCtor<Component>).name ?? componentType;
        return this._componentMap.has(typeName);
    }

    hasAllComponents(componentTypes: AnyCtor<Component>[] | string[]): boolean {
        for (let i = 0; i < componentTypes.length; i++) {
            if (!this.hasComponent(componentTypes[i])) return false;
        }

        return true;
    }

    getComponent<T extends Component>(componentType: AnyCtor<T> | string): T {
        const typeName = (componentType as AnyCtor<Component>).name ?? componentType;
        const component = this._componentMap.get(typeName);
        assert(component !== undefined, `Component '${typeName}' does not exist!`);
        return component as T;
    }

    _setup(arrayIndex: number): void {
        if (!this.destroyed) return;

        this.setActive(true);
        this.destroyed = false;
        this._arrayIndex = arrayIndex;
    }

    destroy(): void {
        if (this.destroyed) return;

        this.setActive(false);
        this._componentMap.clear();
        this.destroyed = true;
    }
}
