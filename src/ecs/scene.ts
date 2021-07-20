import { Entity } from "./entity";
import { assert, mapGet, lastItemSwapRemove } from "src/utils/misc";
import { System } from "./system";
import { ObjectPool } from "src/utils/object_pool";
import { ArrayConstructor } from "src/utils/types";

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
     * The instances of the systems for the scene that are registered.
     */
    systems: System[] = [];

    /**
     * A map containing scene entities mapped by their entity names.
     */
    children: Map<string, Entity> = new Map();

    entityPool: ObjectPool<Entity, Scene>;

    private _typeNameToSystem: Map<string, System[]> = new Map();
    private _tagToEntities: Map<string, Entity[]> = new Map();

    constructor() {
        this.entityPool = new ObjectPool<Entity, Scene>(Entity, this);
        this.entityPool.reserve(100);
    }

    /**
     * Creates a new entity that is aquired from a pool for efficency.
     *
     * @param [name=`Unnamed Entity ${entity.id}`] - The name of the entity.
     * @param {Entity | Scenen} [parent=this] - The parent for the entity.
     * @return The entity that was created.
     */
    createEntity(name?: string, parent: Entity | Scene = this): Entity {
        const entity = this.entityPool.aquire();
        entity._setup(name ?? `Unnamed Entity ${entity.id}`, parent);
        return entity;
    }

    /**
     * Destroys the entity and all it's children and release them back to the entity pool.
     *
     * @param entity - Entity to destroy.
     */
    destroyEntity(entity: Entity): void {
        entity._destroy();
        this.entityPool.release(entity);

        entity.forEachChildrenRecursive((child) => {
            child._destroy();
            this.entityPool.release(child);
        });
    }

    /**
     * Gets all the entities that tagged with the tag.
     *
     * @param tag - The tag to use.
     * @return An array of entities with the tag.
     */
    getEntitesByTag(tag: string): Entity[] {
        return mapGet(this._tagToEntities, tag, Array as ArrayConstructor<Entity>);
    }

    /**
     * Gets called whenever a component gets added to an entity.
     *
     * @private
     */
    _entityComponentAdd(entity: Entity, typeName: string): void {
        const systems = mapGet(this._typeNameToSystem, typeName, Array as ArrayConstructor<System>);
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
        const systems = mapGet(this._typeNameToSystem, typeName, Array as ArrayConstructor<System>);
        systems.forEach((system) => {
            const entityIndex = entity._systemIndexMap.get(system.constructor.name);
            if (entityIndex === undefined) return;

            // swap last element to avoid shifting entities
            const lastEntity = lastItemSwapRemove(system.entities, entityIndex);
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
        const entities = mapGet(this._tagToEntities, tag, Array as ArrayConstructor<Entity>);
        const index = entity._tagIndexMap.get(tag);
        assert(index !== undefined, `Tag ${tag} does not exist!`);

        const lastEntity = lastItemSwapRemove(entities, index);
        lastEntity._tagIndexMap.set(tag, index);
        entity._tagIndexMap.delete(tag);
    }

    /**
     * Gets called whenever a tag gets added to an entity.
     *
     * @private
     */
    _entityTagAdd(entity: Entity, tag: string): void {
        const entities = mapGet(this._tagToEntities, tag, Array as ArrayConstructor<Entity>);
        entities.push(entity);
        entity._tagIndexMap.set(tag, entities.length - 1);
    }

    /**
     * Gets called whenever a component type gets added to a system.
     *
     * @private
     */
    _systemTypeNameAdd(system: System, typeName: string): void {
        const systems = mapGet(this._typeNameToSystem, typeName, Array as ArrayConstructor<System>);
        systems.push(system);
        system.typeNames.push(typeName);
    }
}
