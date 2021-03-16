import { Entity } from "./entity";
import { Manager } from "./manager";

export class Scene {
    private _manager: Manager;

    constructor(manager: Manager) {
        this._manager = manager;
    }

    createEntity(): Entity {
        return new Entity(this._manager);
    }

    destroyEntity(entity: Entity): void {
        entity.destroy();
    }
}
