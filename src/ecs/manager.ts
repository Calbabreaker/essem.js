import { ObjectPool } from "../utils/object_pool";
import { Entity } from "./entity";
import { assert } from "../utils/misc";
import { AnyCtor } from "../utils/types";

export class Manager {
    managerEntity = class extends Entity {};

    entityPool: ObjectPool<Entity>;

    componentArrayMap: Map<string, Object[]>;
    componentIndexToEntityMap: Map<number, Entity>;

    constructor() {
        this.managerEntity.prototype["_manager"] = this;
        this.entityPool = new ObjectPool(this.managerEntity, 100);
        this.componentArrayMap = new Map();
        this.componentIndexToEntityMap = new Map();
    }

    registerComponent<T extends Object>(componentClass: AnyCtor<T>): void {
        const name = componentClass.name;
        this.componentArrayMap.set(name, []);
    }

    createEntity(): Entity {
        return this.entityPool.acquire();
    }

    destroyEntity(entity: Entity): void {
        this.entityPool.release(entity);
    }

    getComponentArray(name: string): Object[] {
        const array = this.componentArrayMap.get(name);
        assert(array, `Component '${name}' has not been registered!`);
        return array;
    }

    entityComponentAdd<T extends Object>(entity: Entity, component: T): number {
        const name = component.constructor.name;
        const array = this.getComponentArray(name);

        const index = array.length;
        array.push(component);
        this.componentIndexToEntityMap.set(index, entity);
        return index;
    }

    entityComponentRemove(name: string, index: number): void {
        const array = this.getComponentArray(name);
        const lastIndex = array.length - 1;
        const lastEntity = this.componentIndexToEntityMap.get(lastIndex) as Entity;

        array[index] = array[lastIndex];
        lastEntity.componentToIndexMap.set(name, index);
        array.pop();
    }

    entityComponentGet<T extends Object>(name: string, index: number): T {
        const array = this.getComponentArray(name);
        return array[index] as T;
    }
}
