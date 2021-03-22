import { Entity } from "./entity";
import { ECSManager } from "./ecs_manager";

export class Scene {
    private _ecsManager: ECSManager;

    constructor(manager: ECSManager) {
        this._ecsManager = manager;
    }

    createEntity(): Entity {
        return new Entity(this._ecsManager);
    }

    destroyEntity(entity: Entity): void {
        entity.destroy();
    }
}
