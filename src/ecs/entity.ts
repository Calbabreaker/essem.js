import { assert, getTypeName } from "src/utils/misc";
import { AnyConstructor } from "src/utils/types";
import { Scene } from "./scene";

// basically any object
// eslint-disable-next-line @typescript-eslint/ban-types
export type Component = Object;
export type ComponentClass = AnyConstructor<Component>;

let uidCounter = 0;

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

    /**
     * Identifier of the entity, only unique to its scene.
     */
    readonly id: string;

    // these variables are private and are accessed by getters
    private _active = false;
    private _activeSelf = false;
    private _destroyed = true;
    private _name = "";
    private _parent: Entity | Scene | null = null;

    _systemIndexMap: Map<string, number> = new Map();
    _tagIndexMap: Map<string, number> = new Map();
    private _componentMap: Map<string, Component> = new Map();
    private _scene: Scene;

    constructor(scene: Scene) {
        this.id = (uidCounter++).toString();
        this._scene = scene;
    }

    /**
     * Adds a new component to the entity.
     *
     * @param {Component} component - Any object that is an instance of a class.
     * @return {Component} The component that was added.
     */
    addComponent<T extends Component>(component: T): T {
        const typeName = component.constructor.name;
        assert(!this._componentMap.has(typeName), `Component '${typeName}' already exists!`);
        this._componentMap.set(typeName, component);

        if (this.active) this._scene._entityComponentAdd(this, typeName);
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

        if (this.active) this._scene._entityComponentRemove(this, typeName);
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

    // TODO: make tags be like components

    addTag(tag: string): void {
        if (this.active) {
            return this._scene._entityTagAdd(this, tag);
        }

        this._tagIndexMap.set(tag, 0);
    }

    hasTag(tag: string): boolean {
        return this._tagIndexMap.has(tag);
    }

    removeTag(tag: string): void {
        if (this.active) this._scene._entityTagRemove(this, tag);
    }

    /**
     * Whether or not the entity is active.
     * Making the entity unactive will remove it from systems and the scene tag collection and put
     * back when active.
     * Setting the value will make all its children be the same active state unless the child is
     * explicitly set to be not active and the parent(s) is set to be active.
     *
     * @member {boolean}
     */
    get active(): boolean {
        return this._active;
    }

    set active(active: boolean) {
        if (
            this._destroyed ||
            this.active === active ||
            (this.parent instanceof Entity && !this.parent.active)
        ) {
            return;
        }

        this._setActive(active);
        this._activeSelf = active;

        this.forEachChildrenRecursive((child) => {
            child._setActive(active && child.activeSelf);
        });
    }

    /**
     * The local active state.
     * This will be regardless of its parents` active states.
     *
     * @member {boolean}
     * @readonly
     */
    get activeSelf(): boolean {
        return this._activeSelf;
    }

    private _setActive(active: boolean): void {
        if (this.active === active) return;
        this._active = active;

        // removes entity listing from components and tags in the systems and scene but still
        // retains them in the entity
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

    /**
     * Parent of the entity. Could be either another entity, the scene or none at all.
     *
     * @member {ESSEM.Entity | ESSEM.Scene | null}
     */
    get parent(): Entity | Scene | null {
        return this._parent;
    }

    set parent(parent: Entity | Scene | null) {
        // remove this entity from parent
        if (this._parent !== null) {
            this._parent.children.delete(this._name);
        }

        // add to new parent
        if (parent !== null) {
            assert(
                !parent.children.has(this._name),
                `Other child with name '${this._name}' already exist!`
            );
            parent.children.set(this._name, this);
        }

        this._parent = parent;
    }

    /**
     * The name of the entity.
     *
     * @member {string}
     */
    get name(): string {
        return this._name;
    }

    set name(name: string) {
        this._name = name;
        this.parent = this._parent;
    }

    /**
     * Loops through each parent and calls the function.
     *
     * @param func - The function to call for each parent. Returning false from this function will
     *        stop the loop.
     */
    forEachParent(func: (parent: Entity) => void | boolean): void {
        if (this.parent instanceof Entity) {
            if (!func(this.parent)) return;
            this.parent.forEachParent(func);
        }
    }

    /**
     * Recursively loops through each child and calls the function.
     * This will include all childrens' childrens.
     * Since it is iterating over maps, it can be quite slow so it is not recommended to use this too much.
     *
     * @param func - The function to call for each children. Returning false from this function will
     *        stop the loop.
     */
    forEachChildrenRecursive(func: (child: Entity) => void | boolean): void {
        for (const [_a, child] of this.children) {
            if (!func(child)) return;
            if (child.children.size !== 0) child.forEachChildrenRecursive(func);
        }
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
    _setup(name: string, parent: Entity | Scene): void {
        if (!this.destroyed) return;

        this._activeSelf = true;
        this._setActive(true);
        this._destroyed = false;
        this._parent = parent;
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
