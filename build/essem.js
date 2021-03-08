/*!
 * essem - v0.0.0
 * Compiled Mon, 08 Mar 2021 05:57:51 GMT
 *
 * Free to use under the MIT LICENSE.
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.ESSEM = {}));
}(this, (function (exports) { 'use strict';

    class ObjectPool {
        constructor(ObjectClass, count) {
            this.availiable = [];
            this.totalObjects = 0;
            this.ObjectClass = ObjectClass;
            this.reserve(count);
        }
        acquire() {
            // check if pool is empty
            if (this.availiable.length === 0) {
                // expand by 20% or minimum 1
                const toExpand = Math.round(this.totalObjects * 1.2) + 1;
                this.reserve(toExpand);
            }
            const object = this.availiable.shift();
            return object;
        }
        release(object) {
            this.availiable.push(object);
        }
        reserve(count) {
            for (let i = 0; i < count; i++) {
                const object = new this.ObjectClass();
                this.availiable.push(object);
            }
            this.totalObjects += count;
        }
    }

    class AssertionError extends Error {
        constructor(message) {
            super(message);
            this.name = "AssertionError";
        }
    }
    function assert(condition, message) {
        if (!condition)
            throw new AssertionError(message);
    }

    class Entity {
        constructor() {
            this.destroyed = false;
            this.componentMap = new Map();
        }
        addComponent(component) {
            const typeName = component.constructor.name;
            const entitySet = this._manager.getEntityIDSet(typeName);
            assert(!this.componentMap.has(typeName), `Component '${typeName}' already exists!`);
            this.componentMap.set(typeName, component);
            entitySet.add(this);
            this._manager.notifySystemEntityChange();
            return component;
        }
        removeComponent(componentType) {
            var _a;
            const typeName = (_a = componentType.name) !== null && _a !== void 0 ? _a : componentType;
            const entitySet = this._manager.getEntityIDSet(typeName);
            assert(this.componentMap.has(typeName), `Component '${typeName}' does not exist!`);
            this.componentMap.delete(typeName);
            entitySet.delete(this);
            this._manager.notifySystemEntityChange();
        }
        hasComponent(componentType) {
            var _a;
            const typeName = (_a = componentType.name) !== null && _a !== void 0 ? _a : componentType;
            return this.componentMap.has(typeName);
        }
        getComponent(componentType) {
            var _a;
            const typeName = (_a = componentType.name) !== null && _a !== void 0 ? _a : componentType;
            const component = this.componentMap.get(typeName);
            assert(component !== undefined, `Component '${typeName}' does not exist!`);
            return component;
        }
        destroy() {
            if (this.destroyed)
                return;
            for (const [typeName] of this.componentMap) {
                const entitySet = this._manager.getEntityIDSet(typeName);
                this.componentMap.delete(typeName);
                entitySet.delete(this);
            }
            this._manager.notifySystemEntityChange();
            this.destroyed = true;
        }
        _setup() {
            if (!this.destroyed)
                return;
            this.destroyed = false;
        }
    }

    class Manager {
        constructor() {
            this.managerEntity = class extends Entity {
            };
            this.systems = [];
            this.managerEntity.prototype["_manager"] = this;
            this.entityPool = new ObjectPool(this.managerEntity, 100);
            this.componentToEntityIDsMap = new Map();
        }
        registerComponent(componentClass) {
            const typeName = componentClass.name;
            assert(!this.componentToEntityIDsMap.has(typeName), `Component '${typeName}' is already registered!`);
            this.componentToEntityIDsMap.set(typeName, new Set());
        }
        registerSystem(systemClass) {
            const system = new systemClass(this);
            system.onInit();
            this.systems.push(system);
        }
        runSystems(delta) {
            for (const system of this.systems) {
                system.onUpdate(delta);
            }
        }
        createEntity() {
            return this.entityPool.acquire();
        }
        destroyEntity(entity) {
            entity.destroy();
            this.entityPool.release(entity);
            this.notifySystemEntityChange();
        }
        getEntityIDSet(typeName) {
            const entitySet = this.componentToEntityIDsMap.get(typeName);
            assert(entitySet !== undefined, `Component '${typeName}' has not been registered!`);
            return entitySet;
        }
        notifySystemEntityChange() {
            for (const system of this.systems) {
                system["_entityGetCache"] = null;
            }
        }
    }

    class Scene {
        constructor(manager) {
            this._manager = manager;
        }
        createEntity() {
            return this._manager.createEntity();
        }
        destroyEntity(entity) {
            this._manager.destroyEntity(entity);
        }
    }

    class Application {
        constructor() {
            this.lastFrameTime = 0;
            this.running = true;
            this._manager = new Manager();
            window.addEventListener("load", () => {
                const loop = () => {
                    if (this.running) {
                        this._onUpdate();
                        requestAnimationFrame(loop);
                    }
                };
                requestAnimationFrame(loop);
            });
        }
        _onUpdate() {
            const now = performance.now();
            const delta = now - this.lastFrameTime;
            this._manager.runSystems(delta);
            this.lastFrameTime = now;
        }
        shutdown() {
            this.running = false;
        }
        registerComponent(componentClass) {
            this._manager.registerComponent(componentClass);
            return this;
        }
        registerSystem(systemClass) {
            this._manager.registerSystem(systemClass);
            return this;
        }
        createScene() {
            const scene = new Scene(this._manager);
            return scene;
        }
    }

    class System {
        constructor(manager) {
            this._manager = manager;
        }
        setComponentTypes(componentTypes) {
            var _a;
            this.typeNames = [];
            for (const componentType of componentTypes) {
                const typeName = (_a = componentType.name) !== null && _a !== void 0 ? _a : componentType;
                assert(this._manager.componentToEntityIDsMap.has(typeName), `Component '${typeName}' has not been registered!`);
                this.typeNames.push(typeName);
            }
        }
        getEntities() {
            if (this._entityGetCache !== null)
                return this._entityGetCache;
            this._entityGetCache = [];
            for (const typeName of this.typeNames) {
                const entitySet = this._manager.componentToEntityIDsMap.get(typeName);
                this._entityGetCache.push(...entitySet);
            }
            return this._entityGetCache;
        }
    }

    const VERSION = "0.0.0";

    exports.Application = Application;
    exports.AssertionError = AssertionError;
    exports.Entity = Entity;
    exports.Manager = Manager;
    exports.ObjectPool = ObjectPool;
    exports.Scene = Scene;
    exports.System = System;
    exports.VERSION = VERSION;
    exports.assert = assert;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=essem.js.map
