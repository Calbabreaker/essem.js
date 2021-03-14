import { Entity } from "./entity";
import { Manager } from "./manager";

export class Scene {
    availiableEntities: Entity[] = [];
    totalEntities = 0;

    private _manager: Manager;

    constructor(manager: Manager) {
        this._manager = manager;
        this.reserveEntities(100);
    }

    createEntity(): Entity {
        if (this.availiableEntities.length === 0) {
            const toExpand = Math.ceil(this.totalEntities * 1.2);
            this.reserveEntities(toExpand);
        }

        const entity = this.availiableEntities.pop() as Entity;
        entity.setup();
        return entity;
    }

    destroyEntity(entity: Entity): void {
        entity.destroy();
        this.availiableEntities.push(entity);
    }

    reserveEntities(count: number): void {
        for (let i = 0; i < count; i++) {
            const entity = new Entity(this._manager);
            this.availiableEntities.push(entity);
        }

        this.totalEntities += count;
    }
}
