import { Component, ECSManager } from "./ecs_manager";
import { assert, swapRemove } from "../utils/misc";
import { AnyCtor } from "../utils/types";

export class Entity {
    _componentMap: Map<string, Component> = new Map();
    _systemIndexMap: Map<string, number> = new Map();
    _arrayIndex = 0;
    private _ecsManager: ECSManager;

    active = false;
    destroyed = true;

    parent: Entity | null = null;
    children: Entity[] = [];

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

    forEachParent(func: (child: Entity) => void) {
        if (this.parent !== null) {
            func(this.parent);
            this.parent.forEachParent(func);
        }
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

    _setup(parent?: Entity): void {
        if (!this.destroyed) return;

        this.setActive(true);
        this.destroyed = false;

        if (parent !== undefined) {
            this._arrayIndex = parent.children.length;
            parent.children.push(this);
            this.parent = parent;
        }
    }

    destroy(): void {
        if (this.destroyed) return;

        this.setActive(false);
        this._componentMap.clear();
        this.destroyed = true;

        if (this.parent !== null) {
            const lastEntity = swapRemove(this.parent.children, this._arrayIndex);
            lastEntity._arrayIndex = this._arrayIndex;
        }
    }
}
