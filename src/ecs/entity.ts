import { Component, Manager } from "./manager";
import { assert } from "../utils/misc";
import { AnyCtor } from "../utils/types";

export class Entity {
    componentMap: Map<string, Component> = new Map();
    signiture = "";
    destroyed = true;

    private _manager: Manager;

    constructor(manager: Manager) {
        this._manager = manager;
    }

    addComponent(component: Component): Component {
        const typeName = component.constructor.name;
        assert(!this.componentMap.has(typeName), `Component '${typeName}' already exists!`);

        const newSigniture = this.signiture + typeName;
        this._manager.notifySystemsEntityChange(this, this.signiture, newSigniture);
        this.signiture = newSigniture;

        this.componentMap.set(typeName, component);
        return component;
    }

    removeComponent(componentType: AnyCtor<Component> | string): void {
        const typeName = (componentType as AnyCtor<Component>).name ?? componentType;
        assert(this.componentMap.has(typeName), `Component '${typeName}' does not exist!`);

        // fast remove component name out of string
        const start = this.signiture.indexOf(typeName);
        const newSigniture =
            this.signiture.substr(0, start) + this.signiture.substr(start + typeName.length);
        this._manager.notifySystemsEntityChange(this, this.signiture, newSigniture);
        this.signiture = newSigniture;

        this.componentMap.delete(typeName);
    }

    hasComponent(componentType: AnyCtor<Component> | string): boolean {
        const typeName = (componentType as AnyCtor<Component>).name ?? componentType;
        return this.componentMap.has(typeName);
    }

    getComponent(componentType: AnyCtor<Component> | string): Component {
        const typeName = (componentType as AnyCtor<Component>).name ?? componentType;
        const component = this.componentMap.get(typeName);
        assert(component !== undefined, `Component '${typeName}' does not exist!`);
        return component as Component;
    }

    destroy(removeComponents = true): void {
        if (this.destroyed) return;
        this.destroyed = true;

        this._manager.notifySystemsEntityChange(this, this.signiture, "");

        if (removeComponents) {
            this.componentMap.clear();
            this.signiture = "";
        }
    }

    setup(): void {
        if (!this.destroyed) return;
        this.destroyed = false;

        if (this.signiture !== "") {
            this._manager.notifySystemsEntityChange(this, "", this.signiture);
        }
    }
}
