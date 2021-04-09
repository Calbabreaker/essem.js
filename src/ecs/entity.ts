import { assert, swapRemove } from "utils/misc";
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
    active = false;
    destroyed = true;

    parent: Entity | null = null;
    children: Entity[] = [];

    _systemIndexMap: Map<string, number> = new Map();
    _arrayIndex = 0;
    private _componentMap: Map<string, Component> = new Map();
    private _scene: Scene;

    constructor(manager: Scene) {
        this._scene = manager;
    }

    setActive(active: boolean): void {
        if (this._componentMap.size !== 0 && this.active !== active) {
            for (const [typeName] of this._componentMap) {
                active
                    ? this._scene._entityComponentAdd(this, typeName)
                    : this._scene._entityComponentRemove(this, typeName);
            }
        }

        this.active = active;
    }

    forEachParent(func: (child: Entity) => void): void {
        if (this.parent !== null) {
            func(this.parent);
            this.parent.forEachParent(func);
        }
    }

    /**
     * Adds a new component to the entity.
     *
     * @param component - Any object that is an instance of a class. Same named classes will be
     *                    considered as the same component.
     * @return The component that was added.
     */
    addComponent<T extends Component>(component: T): T {
        const typeName = component.constructor.name;
        assert(!this._componentMap.has(typeName), `Component '${typeName}' already exists!`);
        this._componentMap.set(typeName, component);

        this._scene._entityComponentAdd(this, typeName);
        return component as T;
    }

    removeComponent(componentType: AnyCtor<Component> | string): void {
        const typeName = (componentType as AnyCtor<Component>).name ?? componentType;
        assert(this._componentMap.has(typeName), `Component '${typeName}' does not exist!`);

        this._scene._entityComponentRemove(this, typeName);
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

    /**
     * Setups the entity. Makes the entity active an not destroyed.
     * Use the scene create entity function unless you are managing entities yourselves.
     *
     * @param parent - The entity for the entity to parent to.
     */
    setup(parent?: Entity): void {
        if (!this.destroyed) return;

        this.setActive(true);
        this.destroyed = false;

        if (parent !== undefined) {
            this._arrayIndex = parent.children.length;
            parent.children.push(this);
            this.parent = parent;
        }
    }

    /**
     * Destroys the entity. Removes all components and sets it unactive.
     * Use the scene destroy function unless you are managing entities yourselves.
     */
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
