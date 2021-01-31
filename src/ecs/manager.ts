import { ObjectPool } from "src/utils/object_pool";
import { Entity } from "./entity";

export class Manager {
    entityPool: ObjectPool<Entity>;

    constructor() {
        this.entityPool = new ObjectPool<Entity>(Entity, 100);
    }

    createEntity(): Entity {
        const entity = this.entityPool.acquire();
        return entity;
    }

    destroyEntity(entity: Entity): void {
        this.entityPool.release(entity);
    }
}
