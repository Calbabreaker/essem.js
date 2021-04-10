import { Entity } from "./entity";
import { assert, mapGet, swapRemove } from "utils/misc";
import { System } from "./system";

/**
 * Handles all the entities.
 * Use the application to create the scene.
 *
 * @memberof ESSEM
 */
export class Scene {
    /**
     * The instances of the systems for the scene that are registed.
     */
    systems: System[] = [];

    /**
     * The entities that are currently active and not destroyed.
     */
    entities: Entity[] = [];

    _typeNameToSystem: Map<string, System[]> = new Map();
    _tagToEntities: Map<string, Entity[]> = new Map();
    private _availableEntities: Entity[] = [];

    /**
     * Don't use constructor for creating. Use `app.createScene` instead.
     */
    constructor() {
        this.reserveEntities(100);
    }

    /**
     * Creates a new entity that is aquired from a pool for efficency.
     *
     * @param parent - The parent for the entity. Default is the scene.
     * @return The entity that was created.
     */
    createEntity(parent?: Entity): Entity {
        if (this._availableEntities.length === 0) {
            // resize by 20%
            const totalEntities = this.entities.length;
            this.reserveEntities(Math.ceil(totalEntities * 1.2) - totalEntities);
        }

        const entity = this._availableEntities.pop() as Entity;
        entity.setup(parent);
        if (parent === undefined) {
            entity._parentArrayIndex = this.entities.length;
            this.entities.push(entity);
        }

        return entity;
    }

    destroyEntity(entity: Entity): void {
        if (entity.parent === undefined) {
            const lastEntity = swapRemove(this.entities, entity._parentArrayIndex);
            lastEntity._parentArrayIndex = entity._parentArrayIndex;
        }

        entity.destroy();
    }

    reserveEntities(count: number): void {
        for (let i = 0; i < count; i++) {
            this._availableEntities.push(new Entity(this));
        }
    }

    getEntitesByTag(tag: string): Entity[] {
        return mapGet(this._tagToEntities, tag, Array) as Entity[];
    }

    /**
     * Gets called whenever a component gets added to an entity.
     *
     * @private
     */
    _entityComponentAdd(entity: Entity, typeName: string): void {
        const systems = mapGet(this._typeNameToSystem, typeName, Array) as System[];
        systems.forEach((system) => {
            if (entity._systemIndexMap.has(system.constructor.name)) return;

            if (entity.hasAllComponents(system.typeNames)) {
                entity._systemIndexMap.set(system.constructor.name, system.entities.length);
                system.entities.push(entity);
                if (system.onEntityAdd !== undefined) {
                    system.onEntityAdd(entity);
                }
            }
        });
    }

    /**
     * Gets called whenever a component gets removed from an entity.
     *
     * @private
     */
    _entityComponentRemove(entity: Entity, typeName: string): void {
        const systems = mapGet(this._typeNameToSystem, typeName, Array) as System[];
        systems.forEach((system) => {
            const entityIndex = entity._systemIndexMap.get(system.constructor.name);
            if (entityIndex === undefined) return;

            // swap last element to avoid shifting entities
            const lastEntity = swapRemove(system.entities, entityIndex);
            lastEntity._systemIndexMap.set(system.constructor.name, entityIndex);
            entity._systemIndexMap.delete(system.constructor.name);
        });
    }

    /**
     * Gets called whenever a tag gets removed from an entity.
     *
     * @private
     */
    _entityTagRemove(entity: Entity, tag: string): void {
        const entities = mapGet(this._tagToEntities, tag, Array) as Entity[];
        const index = entity._tagIndexMap.get(tag);
        assert(index !== undefined, `Tag ${tag} does not exist!`);

        const lastEntity = swapRemove(entities, index);
        lastEntity._tagIndexMap.set(tag, index);
    }
}
