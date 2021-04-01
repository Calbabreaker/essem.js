import { Entity } from "./entity";
import { ECSManager } from "./ecs_manager";
import { swapRemove } from "utils/misc";

/**
 * Handles all the entities.
 * Use the application to create the scene.
 *
 * @memberof ESSEM
 */
export class Scene {
    private _ecsManager: ECSManager;
    private _availableEntities: Entity[] = [];

    /**
     * The entities that are currently active and not destroyed.
     */
    entities: Entity[] = [];

    constructor(manager: ECSManager) {
        this._ecsManager = manager;
        this.reserveEntities(100);
    }

    createEntity(parent?: Entity): Entity {
        if (this._availableEntities.length === 0) {
            // resize by 20%
            const totalEntities = this.entities.length;
            this.reserveEntities(Math.ceil(totalEntities * 1.2) - totalEntities);
        }

        const entity = this._availableEntities.pop() as Entity;
        entity.setup(parent);
        if (parent === undefined) {
            entity._arrayIndex = this.entities.length;
            this.entities.push(entity);
        }

        return entity;
    }

    destroyEntity(entity: Entity): void {
        if (entity.parent === undefined) {
            const lastEntity = swapRemove(this.entities, entity._arrayIndex);
            lastEntity._arrayIndex = entity._arrayIndex;
        }

        entity.destroy();
    }

    reserveEntities(count: number): void {
        for (let i = 0; i < count; i++) {
            this._availableEntities.push(new Entity(this._ecsManager));
        }
    }
}
