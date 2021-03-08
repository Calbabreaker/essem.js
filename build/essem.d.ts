/*!
 * essem - v0.0.0
 * Compiled Mon, 08 Mar 2021 05:57:51 GMT
 *
 * Free to use under the MIT LICENSE.
 */
declare type ObjectPoolCtor<T> = {
    new (): T;
};
declare class ObjectPool<T> {
    ObjectClass: ObjectPoolCtor<T>;
    availiable: T[];
    totalObjects: number;
    constructor(ObjectClass: ObjectPoolCtor<T>, count: number);
    acquire(): T;
    release(object: T): void;
    reserve(count: number): void;
}

declare type AnyCtor<T> = (...args: any[]) => T;

declare class Entity {
    id: number;
    destroyed: boolean;
    componentMap: Map<string, Component>;
    private _manager;
    constructor();
    addComponent(component: Component): Component;
    removeComponent<T extends Component>(componentType: AnyCtor<T> | string): void;
    hasComponent<T extends Component>(componentType: AnyCtor<T> | string): boolean;
    getComponent<T extends Component>(componentType: AnyCtor<T> | string): T;
    destroy(): void;
    _setup(): void;
}

declare abstract class System {
    typeNames: string[];
    private _manager;
    private _entityGetCache;
    constructor(manager: Manager);
    abstract onInit(): void;
    abstract onUpdate(delta: number): void;
    setComponentTypes(componentTypes: AnyCtor<Component>[] | string[]): void;
    getEntities(): Entity[];
}

declare type Component = Record<string, unknown>;
declare class Manager {
    managerEntity: typeof Entity;
    entityPool: ObjectPool<Entity>;
    componentToEntityIDsMap: Map<string, Set<Entity>>;
    systems: System[];
    constructor();
    registerComponent<T extends Component>(componentClass: AnyCtor<T>): void;
    registerSystem<T extends System>(systemClass: {
        new (manager: Manager): T;
    }): void;
    runSystems(delta: number): void;
    createEntity(): Entity;
    destroyEntity(entity: Entity): void;
    getEntityIDSet(typeName: string): Set<Entity>;
    notifySystemEntityChange(): void;
}

declare class Scene {
    private _manager;
    constructor(manager: Manager);
    createEntity(): Entity;
    destroyEntity(entity: Entity): void;
}

declare class Application {
    private _manager;
    lastFrameTime: number;
    running: boolean;
    constructor();
    private _onUpdate;
    shutdown(): void;
    registerComponent<T extends Component>(componentClass: AnyCtor<T>): Application;
    registerSystem<T extends System>(systemClass: {
        new (manager: Manager): T;
    }): Application;
    createScene(): Scene;
}

declare class AssertionError extends Error {
    constructor(message?: string);
}
declare function assert(condition: boolean, message?: string): asserts condition;

declare const VERSION = "$_VERSION";

export { Application, AssertionError, Component, Entity, Manager, ObjectPool, Scene, System, VERSION, assert };
