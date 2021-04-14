import { Entity } from "./entity";
import { assert, mapGet, swapRemove } from "utils/misc";
import { System } from "./system";

/**
 * Handles all the entities.
 * Use the application to create the scene.
 *
 * ## Example
 * ```js
 * // Create application and scene
 * const app = new ESSEM.Application();
 * const scene = app.createScene();
 *
 * // Create entities, add components
 * const entity = scene.createEntity("MyEntity");
 * entity.addComponent(new ESSEM.SpriteRendererComponent(texture));
 * entity.addComponent(new ESSEM.TransformComponent())
 * ```
 *
 * @memberof ESSEM
 */
export class Scene {
    /**
     * The instances of the systems for the scene that are registed.
     */
    systems: System[] = [];

    /**
     * A map containing scene entities mapped by their entity names.
     */
    children: Map<string, Entity> = new Map();

    private _totalEntities = 0;
    _typeNameToSystem: Map<string, System[]> = new Map();
    _tagToEntities: Map<string, Entity[]> = new Map();
    _availableEntities: Entity[] = [];

    constructor() {
        this.reserveEntities(100);
    }

    /**
     * Creates a new entity that is aquired from a pool for efficency.
     *
     * @param [name=`Unnamed Entity ${entity.id}`] - The name of the entity.
     * @param parent - The parent for the entity. Default is the scene.
     * @return The entity that was created.
     */
    createEntity(name?: string, parent: Entity | Scene = this): Entity {
        if (this._availableEntities.length === 0) {
            // resize by 20%
            this.reserveEntities(Math.ceil(this._totalEntities * 1.2) - this._totalEntities);
        }

        const entity = this._availableEntities.pop() as Entity;
        entity._setup(name ?? `Unnamed Entity ${entity.id}`, parent);
        return entity;
    }

    /**
     * Destroys the entity and all it's children and release them back to the entity poo.
     *
     * @param entity - Entity to destroy.
     */
    destroyEntity(entity: Entity): void {
        entity._destroy();
        entity.forEachChildrenRecursive((child) => {
            child._destroy();
        });
    }

    reserveEntities(count: number): void {
        for (let i = 0; i < count; i++) {
            this._availableEntities.push(new Entity(this, i + this._totalEntities));
        }

        this._totalEntities += count;
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
