import { assert, mapGet, swapRemove } from "utils/misc";
import { AnyCtor } from "utils/types";
import { Scene } from "./scene";

// basically any object
// eslint-disable-next-line @typescript-eslint/ban-types
export type Component = Object;

/**
 * Entity class to handle components in ecs.
 *
 * @memberof ESSEM
 */
export class Entity {
    parent: Entity | null = null;
    children: Entity[] = [];

    private _active = false;
    private _activeSelf = false;
    private _destroyed = true;

    _systemIndexMap: Map<string, number> = new Map();
    _parentArrayIndex = 0;
    _tagIndexMap: Map<string, number> = new Map();
    private _componentMap: Map<string, Component> = new Map();
    private _scene: Scene;

    constructor(manager: Scene) {
        this._scene = manager;
    }

    /**
     * Adds a new component to the entity.
     *
     * @param {Component} component - Any object that is an instance of a class. Same named classes
     *        will be considered as the same component.
     * @return {Component} The component that was added.
     */
    addComponent<T extends Component>(component: T): T {
        const typeName = component.constructor.name;
        assert(!this._componentMap.has(typeName), `Component '${typeName}' already exists!`);
        this._componentMap.set(typeName, component);

        if (this._active) this._scene._entityComponentAdd(this, typeName);
        return component as T;
    }

    /**
     * Removes a component from the entity.
     *
     * @param {ComponentClass | string} componentType - The component name or class to remove.
     *        Same named classes will be considered as the same component.
     */
    removeComponent(componentType: AnyCtor<Component> | string): void {
        const typeName = (componentType as AnyCtor<Component>).name ?? componentType;
        assert(this._componentMap.has(typeName), `Component '${typeName}' does not exist!`);

        if (this._active) this._scene._entityComponentRemove(this, typeName);
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

    addTag(tag: string): void {
        if (this._active) {
            const entities = mapGet(this._scene._tagToEntities, tag, Array) as Entity[];
            entities.push(this);
            this._tagIndexMap.set(tag, entities.length - 1);
        } else {
            this._tagIndexMap.set(tag, 0);
        }
    }

    hasTag(tag: string): boolean {
        return this._tagIndexMap.has(tag);
    }

    removeTag(tag: string): void {
        if (this._active) this._scene._entityTagRemove(this, tag);
        this._tagIndexMap.delete(tag);
    }

    /**
     * Sets the entity and all it's children to be active or not.
     * It will not make a child active if it's activeSelf state is false.
     * Will remove entity from systems if inactive and add back when active.
     *
     * @param active - Whether or not the entity should be active.
     */
    setActive(active: boolean) {
        if (this._active === active || (this.parent !== null && !this.parent.active)) return;
        this._setActive(active);
        this._activeSelf = active;

        // go through all the children and sets unactive
        this.forEachChildren((child) => {
            child._setActive(active && child.activeSelf);
        });
    }

    /**
     * Whether or not the entity is active.
     *
     * @readonly
     */
    get active() {
        return this._active;
    }

    /**
     * The local active state.
     * This will be regardless of it's parents.
     *
     * @readonly
     */
    get activeSelf() {
        return this._activeSelf;
    }

    private _setActive(active: boolean): void {
        if (this._active === active) return;
        this._active = active;

        // remove entity listing from components and tags
        if (this._componentMap.size !== 0) {
            for (const [typeName] of this._componentMap) {
                active
                    ? this._scene._entityComponentAdd(this, typeName)
                    : this._scene._entityComponentRemove(this, typeName);
            }
        }

        if (this._tagIndexMap.size !== 0) {
            for (const [tag] of this._tagIndexMap) {
                active ? this.addTag(tag) : this._scene._entityTagRemove(this, tag);
            }
        }
    }

    forEachParent(func: (parent: Entity) => void): void {
        if (this.parent !== null) {
            func(this.parent);
            this.parent.forEachParent(func);
        }
    }

    forEachChildren(func: (child: Entity) => void): void {
        this.children.forEach((child) => {
            func(child);
            child.forEachChildren(func);
        });
    }

    /**
     * Setups the entity. Makes the entity active an not destroyed.
     * Use the scene create entity function unless you are managing entities yourselves.
     *
     * @param parent - The entity for the entity to parent to.
     */
    setup(parent?: Entity): void {
        if (!this.destroyed) return;

        this.setActive(true);
        this._destroyed = false;

        if (parent !== undefined) {
            this._parentArrayIndex = parent.children.length;
            parent.children.push(this);
            this.parent = parent;
        }
    }

    /**
     * Destroys the entity. Removes all components and sets it unactive.
     * Use the scene destroy entity function unless you are managing entities yourselves.
     */
    destroy(): void {
        if (this.destroyed) return;

        this.setActive(true);
        this._destroyed = false;
        this._componentMap.clear();
        this._tagIndexMap.clear();
        this._destroyed = true;

        if (this.parent !== null) {
            const lastEntity = swapRemove(this.parent.children, this._parentArrayIndex);
            lastEntity._parentArrayIndex = this._parentArrayIndex;
        }

        this.children.forEach((child) => {
            child.destroy();
        });
    }

    /**
     * Whether or not the entity is destroyed.
     *
     * @readonly
     */
    get destroyed(): boolean {
        return this._destroyed;
    }
}
