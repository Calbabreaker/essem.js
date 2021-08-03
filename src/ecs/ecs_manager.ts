import { assert } from "src/utils/misc";
import { ObjectPool } from "src/utils/object_pool";
import { Component } from "./component";
import { Entity } from "./entity";
import { Query } from "./query";

export class ECSManager {
    entityPool: ObjectPool<Entity> = new ObjectPool();
    componentPoolMap: Map<string, ObjectPool<Component>> = new Map();

    typeNameToQuery: Map<string, Query[]> = new Map();

    constructor() {
        this.entityPool.newObject = () => new Entity(this);
        this.entityPool.reserve(500);
    }

    registerComponent<T extends Component>(componentClass: new () => T) {
        assert(
            !this.componentPoolMap.has(componentClass.name),
            `${componentClass.name} is already registered!`
        );

        const objectPool = new ObjectPool<T>();
        objectPool.newObject = () => new componentClass();
        objectPool.reserve(5);

        this.componentPoolMap.set(componentClass.name, objectPool);
        this.typeNameToQuery.set(componentClass.name, []);
    }

    createEntity(): Entity {
        const entity = this.entityPool.aquire();
        return entity;
    }
}
