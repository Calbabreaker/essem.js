import { Entity } from "./entity";
import { Manager } from "./manager";

export class Scene {
    private _manager: Manager;

    constructor(manager: Manager) {
        this._manager = manager;
    }

    createEntity(): Entity {
        return this._manager.createEntity();
    }

    destroyEntity(entity: Entity): void {
        this._manager.destroyEntity(entity);
    }
}
