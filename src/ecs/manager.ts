import { ObjectPool } from "../utils/object_pool";
import { Entity } from "./entity";
import { assert } from "../utils/misc";
import { AnyCtor } from "../utils/types";

// basically any object
export type Component = Record<string, unknown>;

export class Manager {
    managerEntity = class extends Entity {};

    entityPool: ObjectPool<Entity>;

    componentToEntityIDsMap: Map<string, Set<number>>;

    constructor() {
        this.managerEntity.prototype["_manager"] = this;
        this.entityPool = new ObjectPool(this.managerEntity, 100);
        this.componentToEntityIDsMap = new Map();
    }

    registerComponent<T extends Component>(componentClass: AnyCtor<T>): void {
        const typeName = componentClass.name;
        assert(
            !this.componentToEntityIDsMap.has(typeName),
            `Component '${typeName}' is already registered!`
        );
        this.componentToEntityIDsMap.set(typeName, new Set());
    }

    createEntity(): Entity {
        return this.entityPool.acquire();
    }

    destroyEntity(entity: Entity): void {
        entity.destroy();
        this.entityPool.release(entity);
    }

    getEntityIDSet(typeName: string): Set<number> {
        const entitySet = this.componentToEntityIDsMap.get(typeName);
        assert(entitySet !== undefined, `Component '${typeName}' has not been registered!`);
        return entitySet;
    }
}
