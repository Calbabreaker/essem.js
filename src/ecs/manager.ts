import { ObjectPool } from "../utils/object_pool";
import { Entity } from "./entity";
import { assert } from "../utils/misc";
import { AnyCtor } from "../utils/types";
import { System } from "./system";

// basically any object
export type Component = Record<string, unknown>;

export class Manager {
    managerEntity: typeof Entity = class extends Entity {};

    entityPool: ObjectPool<Entity>;
    componentToEntityIDsMap: Map<string, Set<Entity>>;
    systems: System[] = [];

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

    registerSystem<T extends System>(systemClass: { new (manager: Manager): T }): void {
        const system = new systemClass(this);
        system.onInit();
        this.systems.push(system);
    }

    runSystems(delta: number): void {
        for (const system of this.systems) {
            system.onUpdate(delta);
        }
    }

    createEntity(): Entity {
        return this.entityPool.acquire();
    }

    destroyEntity(entity: Entity): void {
        entity.destroy();
        this.entityPool.release(entity);
        this.notifySystemEntityChange();
    }

    getEntityIDSet(typeName: string): Set<Entity> {
        const entitySet = this.componentToEntityIDsMap.get(typeName);
        assert(entitySet !== undefined, `Component '${typeName}' has not been registered!`);
        return entitySet;
    }

    notifySystemEntityChange(): void {
        for (const system of this.systems) {
            system["_entityGetCache"] = null;
        }
    }
}
