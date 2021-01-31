import { ObjectPool } from "src/utils/object_pool";
import { Entity } from "./entity";
import { Manager } from "./manager";

export class Scene {
    entityPool: ObjectPool<Entity>;

    // @ts-ignore:
    private _manager: Manager;

    constructor(manager: Manager) {
        this.entityPool = new ObjectPool<Entity>(Entity, 100);
        this._manager = manager;
    }

    createEntity(): Entity {
        const entity = this.entityPool.acquire();
        return entity;
    }

    destroyEntity(entity: Entity): void {
        this.entityPool.release(entity);
    }
}
