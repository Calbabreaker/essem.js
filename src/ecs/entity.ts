import { assert, getTypeName } from "src/utils/misc";
import { AnyConstructor, Dictionary } from "src/utils/types";
import { Component } from "./component";
import { ECSManager } from "./ecs_manager";
import { Scene } from "./scene";

// basically any object
// eslint-disable-next-line @typescript-eslint/ban-types
export type Component = Object;
export type ComponentClass = AnyConstructor<Component>;

/**
 * Entity class to handle components, tags and queries in the entity component system.
 * Note: Samed named components will be considered as the same component. This makes it possible
 * to get the component just by using its name.
 *
 * @memberof ESSEM
 */
export class Entity {
    /**
     * The child entities of the entity mapped by their name.
     */
    children: Map<string, Entity> = new Map();

    // these variables are private and are accessed by getters
    private _destroyed = true;

    _systemIndexMap: Map<string, number> = new Map();
    _tagIndexMap: Map<string, number> = new Map();
    private _componentMap: Map<string, Component> = new Map();
    private _ecsManager: ECSManager;

    constructor(ecsManager: ECSManager) {
        this._ecsManager = ecsManager;
    }

    addComponent<T extends typeof Component>(componentClass: T, properties: Dictionary<any>): T {
        const pool = this._ecsManager.componentPoolMap.get(componentClass.name);
        assert(pool, `${componentClass.name} has not been registered!`);

        const component = pool.aquire();
        return component as T;
    }

    /**
     * Removes a component from the entity.
     *
     * @param componentType - The component name or class to remove.
     */
    removeComponent(componentType: ComponentClass | string): void {
        const typeName = getTypeName(componentType);
        assert(this._componentMap.has(typeName), `Component '${typeName}' does not exist!`);

        this._componentMap.delete(typeName);
    }

    /**
     * Checks to see if the component is on the entity.
     *
     * @param componentType - The component name or class to check.
     * @return Whether or not the entity has the component.
     */
    hasComponent(componentType: ComponentClass | string): boolean {
        const typeName = getTypeName(componentType);
        return this._componentMap.has(typeName);
    }

    /**
     * Checks to see if all the components specified are on the entity.
     *
     * @param componentType - An array of the component names or classes to check.
     * @return Whether or not the entity has all the components.
     */
    hasAllComponents(componentTypes: (ComponentClass | string)[]): boolean {
        for (let i = 0; i < componentTypes.length; i++) {
            if (!this.hasComponent(componentTypes[i])) return false;
        }

        return true;
    }

    /**
     * Gets a component from the entity.
     *
     * @param {ComponentClass | string} componentType - The component name or class to get.
     * @return {Component} The component that was retrieved.
     */
    getComponent<T extends Component>(componentType: AnyConstructor<T> | string): T {
        const typeName = getTypeName(componentType);
        const component = this._componentMap.get(typeName);
        assert(component !== undefined, `Component '${typeName}' does not exist!`);
        return component as T;
    }

    /**
     * Whether or not the entity is destroyed.
     *
     * @member {boolean}
     * @readonly
     */
    get destroyed(): boolean {
        return this._destroyed;
    }

    /**
     * Gets called when creating a new entity from the scene.
     *
     * @private
     */
    _setup(name: string): void {
        if (!this.destroyed) return;

        this.name = name;
    }

    /**
     * Gets called when deleting the entity from the scene.
     *
     * @private
     */
    _destroy(): void {
        if (this.destroyed) return;

        this._setActive(false);
        this._destroyed = true;
        this._componentMap.clear();
        this._tagIndexMap.clear();

        this.parent = null;
    }
}
