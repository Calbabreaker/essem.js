import { assert, mapGet } from "src/utils/misc";
import { AnyCtor } from "src/utils/types";
import { Scene } from "./scene";

// basically any object
// eslint-disable-next-line @typescript-eslint/ban-types
export type Component = Object;
export type ComponentClass = AnyCtor<Component>;

/**
 * Entity class to handle components in ecs.
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
    readonly id: number;

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

    constructor(manager: Scene, id: number) {
        this._scene = manager;
        this.id = id;
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
     * @param componentType - The component name or class to remove.
     *        Same named classes will be considered as the same component.
     */
    removeComponent(componentType: ComponentClass | string): void {
        const typeName = (componentType as AnyCtor<Component>).name ?? componentType;
        assert(this._componentMap.has(typeName), `Component '${typeName}' does not exist!`);

        if (this._active) this._scene._entityComponentRemove(this, typeName);
        this._componentMap.delete(typeName);
    }

    /**
     * Checks to see if the component is on the entity.
     *
     * @param componentType - The component name or class to check.
     *        Same named classes will be considered as the same component.
     * @return Whether or not the entity has the component.
     */
    hasComponent(componentType: ComponentClass | string): boolean {
        const typeName = (componentType as AnyCtor<Component>).name ?? componentType;
        return this._componentMap.has(typeName);
    }

    /**
     * Checks to see if all the components specified are on the entity.
     *
     * @param componentType - An array of the component names or classes to check.
     *        Same named classes will be considered as the same component.
     * @return Whether or not the entity has all the components.
     */
    hasAllComponents(componentTypes: ComponentClass[] | string[]): boolean {
        for (let i = 0; i < componentTypes.length; i++) {
            if (!this.hasComponent(componentTypes[i])) return false;
        }

        return true;
    }

    /**
     * Gets a component from the entity.
     *
     * @param {ComponentClass | string} componentType - The component name or class to get.
     *        Same named classes will be considered as the same component.
     * @return {Component} The component that was retrieved.
     */
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
     * Whether or not the entity is active.
     * Making the entity unactive will remove it from systems and the scene tag collection and put
     * back when active.
     * Setting the value will make all its children be the same active state unless the child is
     * explicitly set to be not active and the parent(s) is set to be active.
     */
    get active(): boolean {
        return this._active;
    }

    set active(active: boolean) {
        if (
            this._destroyed ||
            this._active === active ||
            (this.parent instanceof Entity && !this.parent.active)
        ) {
            return;
        }

        this._setActive(active);
        this._activeSelf = active;

        // go through all the children and sets unactive
        this.forEachChildrenRecursive((child) => {
            child._setActive(active && child.activeSelf);
        });
    }

    /**
     * The local active state.
     * This will be regardless of its parents` active states.
     *
     * @readonly
     */
    get activeSelf(): boolean {
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

    /**
     * Parent of the entity. Could be either another entity, the scene or none at all.
     */
    get parent(): Entity | Scene | null {
        return this._parent;
    }

    set parent(parent: Entity | Scene | null) {
        // remove this entity from parent
        if (this._parent !== null) {
            this._parent.children.delete(this._name);
        }

        // add to parent
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
     */
    get name(): string {
        return this._name;
    }

    set name(name: string) {
        this._name = name;
        this.parent = this._parent;
    }

    forEachParent(func: (parent: Entity) => void): void {
        if (this._parent instanceof Entity) {
            func(this._parent);
            this._parent.forEachParent(func);
        }
    }

    forEachChildrenRecursive(func: (child: Entity) => void): void {
        this.children.forEach((child) => {
            func(child);
            child.forEachChildrenRecursive(func);
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

    /**
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
     * @private
     */
    _destroy(): void {
        if (this.destroyed) return;

        this._setActive(false);
        this._destroyed = true;
        this._componentMap.clear();
        this._tagIndexMap.clear();

        this.parent = null;
        this._scene._availableEntities.push(this);
    }
}
