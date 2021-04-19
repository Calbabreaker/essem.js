/*!
 * essem.js - v0.0.0
 * Compiled Mon, 19 Apr 2021 06:21:01 GMT
 *
 * Free to use under the MIT LICENSE.
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.ESSEM = {}));
}(this, (function (exports) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    /**
     * Error class that is used for {@link ESSEM.assert}.
     *
     * @memberof ESSEM
     */
    class AssertionError extends Error {
        constructor(message) {
            super(message);
            this.name = "AssertionError";
        }
    }
    /**
     * Throws an error if condition is false.
     * All uses if this in the essem.js code will get removed in minified files.
     *
     * @memberof ESSEM
     * @param condition - The condition to assert.
     * @param message - The message to use in the Error.
     * @return {void}
     */
    function assert(condition, message) {
        if (!condition)
            throw new AssertionError(message);
    }
    /**
     * Gets an item from the map using a key and sets it with a new instance of the class of it
     * doesn't  exist.
     *
     * @param map - The map to use.
     * @param key - The key of the item.
     * @param defaultClass - The class to create a new instance from.
     * @return The value that was retrieved.
     */
    function mapGet(map, key, defaultClass) {
        if (!map.has(key))
            map.set(key, new defaultClass());
        return map.get(key);
    }
    /**
     * Removes an item from an array by swapping the last element with the removing element and popping
     * the array.
     *
     * @param array - The array to use.
     * @param index - The index to remove.
     * @return The last item of the array that was swapped to the index.
     */
    function lastItemSwapRemove(array, index) {
        const lastItem = array[array.length - 1];
        array[index] = lastItem;
        array.pop();
        return lastItem;
    }
    function getTypeName(type) {
        var _a;
        return (_a = type.name) !== null && _a !== void 0 ? _a : type;
    }

    // caches the result from webgl2Supported function
    let webgl2Supported;
    /**
     * Checks to see if WebGL2 is supported in the browser.
     *
     * @memberof ESSEM
     * @return Whether or not WebGL2 is supported.
     */
    function isWebGL2Supported() {
        if (webgl2Supported === undefined) {
            const canvasElm = document.createElement("canvas");
            const gl = canvasElm.getContext("webgl2");
            webgl2Supported = gl !== undefined;
        }
        return webgl2Supported;
    }
    let saidHello = false;
    /**
     * Says hello in essem.js style. Gets called once when the application finishes initiating.
     *
     * @memberof ESSEM
     */
    function sayHello() {
        if (!saidHello) {
            // TODO: make this look better
            console.log("---\n--- essem.js v0.0.0\n---");
            saidHello = true;
        }
    }
    /**
     * Skips the essem.js hello message.
     *
     * @memberof ESSEM
     */
    function skipHello() {
        saidHello = true;
    }

    /**
     * Converts hexadecimal number to a rbga array.
     *
     * @memberof ESSEM
     * @param hex - Hexadecimal number. Alpha channel is default to 1.
     * @return RGBA array with values from 0 to 1.
     */
    function hexToRGBA(hex) {
        const rgb = new Float32Array(4);
        if (hex <= 0xffffff) {
            rgb[0] = ((hex >> 16) & 0xff) / 255;
            rgb[1] = ((hex >> 8) & 0xff) / 255;
            rgb[2] = (hex & 0xff) / 255;
            rgb[3] = 1;
        }
        else {
            rgb[0] = ((hex >> 24) & 0xff) / 255;
            rgb[1] = ((hex >> 16) & 0xff) / 255;
            rgb[2] = ((hex >> 8) & 0xff) / 255;
            rgb[3] = (hex & 0xff) / 255;
        }
        return rgb;
    }

    class Renderer {
        constructor(canvasElement) {
            if (isWebGL2Supported()) {
                const gl = canvasElement.getContext("webgl2");
                assert(gl !== null, "Failed to create WebGL2 context");
                this.gl = gl;
                this.maxTextureSlots = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
            }
            else {
                alert("WebGL2 is not supported in your browser!");
                throw new Error("WebGL2 not supported!");
            }
        }
        update() {
            const gl = this.gl;
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        }
        set backgroundColor(hexColor) {
            const rgbColor = hexToRGBA(hexColor);
            this.gl.clearColor(rgbColor[0], rgbColor[1], rgbColor[2], rgbColor[3]);
        }
    }

    /**
     * Entity class to handle components in ecs.
     *
     * @memberof ESSEM
     */
    class Entity {
        constructor(id, scene) {
            /**
             * The child entities of the entity mapped by their name.
             */
            this.children = new Map();
            // these variables are private and are accessed by getters
            this._active = false;
            this._activeSelf = false;
            this._destroyed = true;
            this._name = "";
            this._parent = null;
            this._systemIndexMap = new Map();
            this._tagIndexMap = new Map();
            this._componentMap = new Map();
            this.id = id;
            this._scene = scene;
        }
        /**
         * Adds a new component to the entity.
         *
         * @param {Component} component - Any object that is an instance of a class. Same named classes
         *        will be considered as the same component.
         * @return {Component} The component that was added.
         */
        addComponent(component) {
            const typeName = component.constructor.name;
            assert(!this._componentMap.has(typeName), `Component '${typeName}' already exists!`);
            this._componentMap.set(typeName, component);
            if (this.active)
                this._scene._entityComponentAdd(this, typeName);
            return component;
        }
        /**
         * Removes a component from the entity.
         *
         * @param componentType - The component name or class to remove.
         *        Same named classes will be considered as the same component.
         */
        removeComponent(componentType) {
            const typeName = getTypeName(componentType);
            assert(this._componentMap.has(typeName), `Component '${typeName}' does not exist!`);
            if (this.active)
                this._scene._entityComponentRemove(this, typeName);
            this._componentMap.delete(typeName);
        }
        /**
         * Checks to see if the component is on the entity.
         *
         * @param componentType - The component name or class to check.
         *        Same named classes will be considered as the same component.
         * @return Whether or not the entity has the component.
         */
        hasComponent(componentType) {
            const typeName = getTypeName(componentType);
            return this._componentMap.has(typeName);
        }
        /**
         * Checks to see if all the components specified are on the entity.
         *
         * @param componentType - An array of the component names or classes to check.
         *        Same named classes will be considered as the same component.
         * @return Whether or not the entity has all the components.
         */
        hasAllComponents(componentTypes) {
            for (let i = 0; i < componentTypes.length; i++) {
                if (!this.hasComponent(componentTypes[i]))
                    return false;
            }
            return true;
        }
        /**
         * Gets a component from the entity.
         *
         * @param {ComponentClass | string} componentType - The component name or class to get.
         *        Same named classes will be considered as the same component.
         * @return {Component} The component that was retrieved.
         */
        getComponent(componentType) {
            const typeName = getTypeName(componentType);
            const component = this._componentMap.get(typeName);
            assert(component !== undefined, `Component '${typeName}' does not exist!`);
            return component;
        }
        addTag(tag) {
            if (this.active) {
                return this._scene._entityTagAdd(this, tag);
            }
            this._tagIndexMap.set(tag, 0);
        }
        hasTag(tag) {
            return this._tagIndexMap.has(tag);
        }
        removeTag(tag) {
            if (this.active)
                this._scene._entityTagRemove(this, tag);
        }
        /**
         * Whether or not the entity is active.
         * Making the entity unactive will remove it from systems and the scene tag collection and put
         * back when active.
         * Setting the value will make all its children be the same active state unless the child is
         * explicitly set to be not active and the parent(s) is set to be active.
         */
        get active() {
            return this._active;
        }
        set active(active) {
            if (this._destroyed ||
                this.active === active ||
                (this.parent instanceof Entity && !this.parent.active)) {
                return;
            }
            this._setActive(active);
            this._activeSelf = active;
            this.forEachChildrenRecursive((child) => {
                child._setActive(active && child.activeSelf);
            });
        }
        /**
         * The local active state.
         * This will be regardless of its parents` active states.
         *
         * @readonly
         */
        get activeSelf() {
            return this._activeSelf;
        }
        _setActive(active) {
            if (this.active === active)
                return;
            this._active = active;
            // remove entity listing from components and tags
            if (this._componentMap.size !== 0) {
                for (const [typeName] of this._componentMap) {
                    active
                        ? this._scene._entityComponentAdd(this, typeName)
                        : this._scene._entityComponentRemove(this, typeName);
                }
            }
            if (this._tagIndexMap.size !== 0) {
                for (const [tag] of this._tagIndexMap) {
                    active ? this.addTag(tag) : this._scene._entityTagRemove(this, tag);
                }
            }
        }
        /**
         * Parent of the entity. Could be either another entity, the scene or none at all.
         */
        get parent() {
            return this._parent;
        }
        set parent(parent) {
            // remove this entity from parent
            if (this._parent !== null) {
                this._parent.children.delete(this._name);
            }
            // add to parent
            if (parent !== null) {
                assert(!parent.children.has(this._name), `Other child with name '${this._name}' already exist!`);
                parent.children.set(this._name, this);
            }
            this._parent = parent;
        }
        /**
         * The name of the entity.
         */
        get name() {
            return this._name;
        }
        set name(name) {
            this._name = name;
            this.parent = this._parent;
        }
        forEachParent(func) {
            if (this._parent instanceof Entity) {
                func(this._parent);
                this._parent.forEachParent(func);
            }
        }
        forEachChildrenRecursive(func) {
            this.children.forEach((child) => {
                func(child);
                if (child.children.size !== 0)
                    child.forEachChildrenRecursive(func);
            });
        }
        /**
         * Whether or not the entity is destroyed.
         *
         * @readonly
         */
        get destroyed() {
            return this._destroyed;
        }
        /**
         * Gets called when creating a new entity from the scene.
         *
         * @private
         */
        _setup(name, parent) {
            if (!this.destroyed)
                return;
            this._activeSelf = true;
            this._setActive(true);
            this._destroyed = false;
            this._parent = parent;
            this.name = name;
        }
        /**
         * Gets called when deleting the entity from the scene.
         *
         * @private
         */
        _destroy() {
            if (this.destroyed)
                return;
            this._setActive(false);
            this._destroyed = true;
            this._componentMap.clear();
            this._tagIndexMap.clear();
            this.parent = null;
        }
    }

    class ObjectPool {
        constructor(objectClass, objectManager) {
            this.availableObjects = [];
            this.totalObjects = 0;
            this.objectClass = objectClass;
            this.objectManager = objectManager;
        }
        aquire() {
            if (this.availableObjects.length === 0) {
                // resize by 20%
                this.reserve(Math.ceil(this.totalObjects * 1.2) - this.totalObjects);
            }
            const newObject = this.availableObjects.pop();
            return newObject;
        }
        release(object) {
            this.availableObjects.push(object);
        }
        reserve(count) {
            for (let i = 0; i < count; i++) {
                this.availableObjects.push(new this.objectClass(i + this.totalObjects, this.objectManager));
            }
            this.totalObjects += count;
        }
    }

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
    class Scene {
        constructor() {
            /**
             * The instances of the systems for the scene that are registered.
             */
            this.systems = [];
            /**
             * A map containing scene entities mapped by their entity names.
             */
            this.children = new Map();
            this._typeNameToSystem = new Map();
            this._tagToEntities = new Map();
            this.entityPool = new ObjectPool(Entity, this);
            this.entityPool.reserve(100);
        }
        /**
         * Creates a new entity that is aquired from a pool for efficency.
         *
         * @param [name=`Unnamed Entity ${entity.id}`] - The name of the entity.
         * @param parent - The parent for the entity. Default is the scene.
         * @return The entity that was created.
         */
        createEntity(name, parent = this) {
            const entity = this.entityPool.aquire();
            entity._setup(name !== null && name !== void 0 ? name : `Unnamed Entity ${entity.id}`, parent);
            return entity;
        }
        /**
         * Destroys the entity and all it's children and release them back to the entity pool.
         *
         * @param entity - Entity to destroy.
         */
        destroyEntity(entity) {
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
        getEntitesByTag(tag) {
            return mapGet(this._tagToEntities, tag, Array);
        }
        /**
         * Gets called whenever a component gets added to an entity.
         *
         * @private
         */
        _entityComponentAdd(entity, typeName) {
            const systems = mapGet(this._typeNameToSystem, typeName, Array);
            systems.forEach((system) => {
                if (entity._systemIndexMap.has(system.constructor.name))
                    return;
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
        _entityComponentRemove(entity, typeName) {
            const systems = mapGet(this._typeNameToSystem, typeName, Array);
            systems.forEach((system) => {
                const entityIndex = entity._systemIndexMap.get(system.constructor.name);
                if (entityIndex === undefined)
                    return;
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
        _entityTagRemove(entity, tag) {
            const entities = mapGet(this._tagToEntities, tag, Array);
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
        _entityTagAdd(entity, tag) {
            const entities = mapGet(this._tagToEntities, tag, Array);
            entities.push(entity);
            entity._tagIndexMap.set(tag, entities.length - 1);
        }
        /**
         * Gets called whenever a component type gets added to a system.
         *
         * @private
         */
        _systemTypeNameAdd(system, typeName) {
            const systems = mapGet(this._typeNameToSystem, typeName, Array);
            systems.push(system);
            system.typeNames.push(typeName);
        }
    }

    /**
     * Checks to see if a and b are approximately equal according to the tolerance.
     *
     * @memberof ESSEM
     * @param a - The first value.
     * @param b - The second value.
     * @param {number} [tolerance=0.001] - The range to check in.
     * @return Whether or not the values are approximately equal.
     */
    function approxEquals(a, b, tolerance = 0.001) {
        return Math.abs(a - b) <= tolerance;
    }
    /**
     * Constant that converts degrees to radians.
     * Use the essem.js provided functions to convert instead.
     *
     * @memberof ESSEM
     * @type number
     */
    const DEG_TO_RAD = Math.PI / 180;
    /**
     * Converts degrees to radians.
     *
     * @memberof ESSEM
     * @param degrees - Degrees to convert.
     * @return Radians.
     */
    function toRadians(degrees) {
        return degrees * DEG_TO_RAD;
    }
    /**
     * Constant that converts radians to degrees.
     * Use the essem.js provided functions to convert instead.
     *
     * @memberof ESSEM
     * @type number
     */
    const RAD_TO_DEG = 180 / Math.PI;
    /**
     * Converts radians to degrees.
     *
     * @memberof ESSEM
     * @param radians - Radians to convert.
     * @return Degrees.
     */
    function toDegrees(radians) {
        return radians * RAD_TO_DEG;
    }
    /**
     * Constant that is equal to PI * 2.
     *
     * @memberof ESSEM
     */
    const TWO_PI = Math.PI * 2;

    /**
     * A 2 component vector with x and y.
     *
     * @memberof ESSEM
     */
    class Vector2 {
        constructor(x = 0, y = 0) {
            /**
             * The cache for toArray.
             */
            this._array = null;
            this.x = x;
            this.y = y;
        }
        set(x = 0, y = 0) {
            this.x = x;
            this.y = y;
            return this;
        }
        setVector(vector) {
            this.x = vector.x;
            this.y = vector.y;
            return this;
        }
        clone() {
            return new Vector2(this.x, this.y);
        }
        toString() {
            return `Vector2(${this.x}, ${this.y})`;
        }
        toArray(out) {
            if (!this._array)
                this._array = new Float32Array(2);
            const array = out !== null && out !== void 0 ? out : this._array;
            array[0] = this.x;
            array[1] = this.y;
            return array;
        }
        add(vector) {
            this.x += vector.x;
            this.y += vector.y;
            return this;
        }
        subtract(vector) {
            this.x -= vector.x;
            this.y -= vector.y;
            return this;
        }
        multiply(scalar) {
            this.x *= scalar;
            this.y *= scalar;
            return this;
        }
        divide(scalar) {
            this.x /= scalar;
            this.y /= scalar;
            return this;
        }
        distanceSquared(vector) {
            const x = this.x - vector.x;
            const y = this.y - vector.y;
            return Math.pow(x, 2) + Math.pow(y, 2);
        }
        distance(vector) {
            return Math.sqrt(this.distanceSquared(vector));
        }
        magnitudeSquared() {
            return Math.pow(this.x, 2) + Math.pow(this.y, 2);
        }
        magnitude() {
            return Math.sqrt(this.magnitudeSquared());
        }
        normalize() {
            this.divide(this.magnitude());
            return this;
        }
        dot(vector) {
            return this.x * vector.x + this.y + vector.y;
        }
        cross(vector) {
            return this.x * vector.y - this.y * vector.x;
        }
        random(magnitude = 1) {
            const rValue = Math.random() * Math.PI * 2;
            this.x = Math.cos(rValue) * magnitude;
            this.y = Math.cos(rValue) * magnitude;
            return this;
        }
        rotate(radians, origin = new Vector2()) {
            const pointX = this.x - origin.x;
            const pointY = this.y - origin.y;
            // perform rotation and translate to correct position
            const sinC = Math.sin(radians);
            const cosC = Math.cos(radians);
            this.x = pointX * cosC - pointY * sinC + origin.x;
            this.y = pointX * sinC + pointY * cosC + origin.y;
            return this;
        }
        angle(origin = new Vector2()) {
            return Math.atan2(this.y - this.y, origin.x - origin.x);
        }
        exactEquals(vector) {
            return this.x === vector.x && this.y === vector.y;
        }
        /**
         * Checks to see if this vector is approximately equal to the input vector
         * according to tolerance.
         *
         * @param vector - The input vector to compare.
         * @param {number} [tolerance=0.001] - The range to check in.
         * @return Whether or not the vectors are approximately equal.
         */
        approxEquals(vector, tolerance = 0.001) {
            return (approxEquals(this.x, vector.x, tolerance) && approxEquals(this.y, vector.y, tolerance));
        }
        transformMatrix3(matrix) {
            const x = this.x;
            this.x = matrix.xScale * x + matrix.xSkew * this.y + matrix.xTrans;
            this.y = matrix.ySkew * x + matrix.yScale * this.y + matrix.yTrans;
            return this;
        }
    }

    /**
     * Event base class that all events must extend from.
     *
     * @memberof ESSEM
     */
    class Event {
        constructor() {
            /**
             * Whether or not the event has been handled. Set this to true to make it stopped
             * being sent to all other event listeners.
             */
            this.handled = false;
        }
    }
    /**
     * Used to add listeners and send events. It is automatically created when creating
     * {@link ESSEM.Application} and it can be accesed from `app.events`.
     *
     * @memberof ESSEM
     */
    class EventManager {
        constructor() {
            this.eventListenersMap = new Map();
        }
        /**
         * Adds a function to act as a listener to listen and receive the specified event.
         *
         * @param eventType - The event class or name for the listener to listen to.
         * @param listenerFunc - The function that will receive the events.
         */
        addListener(eventType, listenerFunc) {
            var _a;
            const eventName = (_a = eventType.name) !== null && _a !== void 0 ? _a : eventType;
            const listeners = mapGet(this.eventListenersMap, eventName, Array);
            listeners.push(listenerFunc);
        }
        /**
         * Send a event for all event's listeners to get.
         *
         * @param event - An instance of the event to send. Same named classes will be considered as
         *                the same event.
         */
        sendEvent(event) {
            const eventName = event.constructor.name;
            const listeners = mapGet(this.eventListenersMap, eventName, Array);
            for (let i = 0; i < listeners.length; i++) {
                if (event.handled)
                    break;
                listeners[i](event);
            }
        }
    }

    /**
     * Event that is sent whenever a key is pressed.
     *
     * @memberof ESSEM
     */
    class KeyPressedEvent extends Event {
        constructor(code, repeated) {
            super();
            this.code = code;
            this.repeated = repeated;
        }
    }
    /**
     * Event that is sent whenever a key is released.
     *
     * @memberof ESSEM
     */
    class KeyReleasedEvent extends Event {
        constructor(code) {
            super();
            this.code = code;
        }
    }
    /**
     * Event that is sent whenever a key is typed.
     * This uses the actual key that the user types.
     *
     * @memberof ESSEM
     */
    class KeyTypedEvent extends Event {
        constructor(key) {
            super();
            this.key = key;
        }
    }
    /**
     * Event that is sent whenever a the mouse is pressed.
     *
     * @memberof ESSEM
     */
    class MousePressedEvent extends Event {
        constructor(button) {
            super();
            this.button = button;
        }
    }
    /**
     * Event that is sent whenever a the mouse is released.
     *
     * @memberof ESSEM
     */
    class MouseReleasedEvent extends Event {
        constructor(button) {
            super();
            this.button = button;
        }
    }
    /**
     * Event that is sent whenever a the mouse is moved.
     *
     * @memberof ESSEM
     */
    class MouseMovedEvent extends Event {
        constructor(x, y) {
            super();
            this.offsetX = x;
            this.offsetY = y;
        }
    }
    /**
     * Event that is sent whenever a the mouse wheel is scrolled.
     *
     * @memberof ESSEM
     */
    class MouseScrolledEvent extends Event {
        constructor(x, y) {
            super();
            this.offsetX = x;
            this.offsetY = y;
        }
    }

    /**
     * Event that gets sent whenever the canvas resizes.
     * This won't get called if just the window does though.
     *
     * @memberof ESSEM
     */
    class CanvasResizedEvent extends Event {
        constructor(width, height) {
            super();
            this.width = width;
            this.height = height;
        }
    }
    /**
     * Used for the canvas element and input events. It is automatically created when creating
     * {@link ESSEM.Application} and it can be accesed from `app.canvas`.
     *
     * @memberof ESSEM
     */
    class Canvas {
        /**
         * @param {object} [options={}] - Parameters as an object for the Canvas.
         * @param {number} [options.aspectRatio] - Aspect ratio for the canvas to resize to if fixedSize
         *                                         is true. Leave empty for no aspect ratio.
         * @param {boolean} [options.fixedSize=true] - Will resize to fit window if true.
         * @param {number} [options.width=400] - Initial width.
         * @param {number} [options.height=400] - Initial height.
         */
        constructor(options = {}, eventManager) {
            var _a, _b, _c, _d;
            this._pressedKeys = new Map();
            this._pressedMouseButtons = new Map();
            this._mousePosition = new Vector2();
            this.fixedSize = (_a = options.fixedSize) !== null && _a !== void 0 ? _a : true;
            this._eventManager = eventManager;
            this.aspectRatio = (_b = options.aspectRatio) !== null && _b !== void 0 ? _b : null;
            this.element = document.createElement("canvas");
            if (!this.fixedSize) {
                this.resizeFull();
            }
            else {
                this.resizeCanvas((_c = options.width) !== null && _c !== void 0 ? _c : 400, (_d = options.height) !== null && _d !== void 0 ? _d : 400);
            }
            window.addEventListener("keydown", (event) => {
                this._pressedKeys.set(event.code, true);
                this._eventManager.sendEvent(new KeyPressedEvent(event.code, event.repeat));
            });
            window.addEventListener("keyup", (event) => {
                this._pressedKeys.set(event.code, false);
                this._eventManager.sendEvent(new KeyReleasedEvent(event.code));
            });
            window.addEventListener("keypress", (event) => {
                this._eventManager.sendEvent(new KeyTypedEvent(event.key));
            });
            window.addEventListener("mousedown", (event) => {
                this._eventManager.sendEvent(new MousePressedEvent(event.button));
                this._pressedMouseButtons.set(event.button, true);
            });
            window.addEventListener("mouseup", (event) => {
                this._eventManager.sendEvent(new MouseReleasedEvent(event.button));
                this._pressedMouseButtons.set(event.button, false);
            });
            window.addEventListener("mousemove", (event) => {
                this._eventManager.sendEvent(new MouseMovedEvent(event.offsetX, event.offsetY));
                this._mousePosition.set(event.clientX, event.clientY);
            });
            window.addEventListener("wheel", (event) => {
                this._eventManager.sendEvent(new MouseScrolledEvent(event.offsetX, event.offsetY));
            });
            window.addEventListener("resize", () => {
                if (!this.fixedSize) {
                    this.resizeFull();
                }
            });
        }
        /**
         * Resizes the canvas to the specified width and height.
         *
         * @param width - The width to resize to.
         * @param height - The height to resize to.
         * @param {boolean} [sendEvent=true] - Whether or not to send a CanvasResizedEvent.
         */
        resizeCanvas(width, height, sendEvent = true) {
            this.width = width;
            this.height = height;
            this.element.width = width;
            this.element.height = height;
            if (sendEvent) {
                this._eventManager.sendEvent(new CanvasResizedEvent(width, height));
            }
        }
        /**
         * Checks if the specified key is held down.
         *
         * @param keyCode - The key code (from window.KeyboardEvent) to check.
         * @return Whether or not the key was held down.
         */
        isKeyPressed(keyCode) {
            var _a;
            return (_a = this._pressedKeys.get(keyCode)) !== null && _a !== void 0 ? _a : false;
        }
        /**
         * Checks if the specified mouse button is held down.
         *
         * @param button - The mouse button code (from window.MouseEvent) to check.
         * @return Whether or not the mouse button was held down.
         */
        isMousePressed(button) {
            var _a;
            return (_a = this._pressedMouseButtons.get(button)) !== null && _a !== void 0 ? _a : false;
        }
        /**
         * Gets the current mouse position.
         *
         * @return The current mouse position.
         */
        getMousePosition() {
            return this._mousePosition.clone();
        }
        /**
         * Resizes the canvas to fit the window with accordence to the aspect ratio.
         */
        resizeFull() {
            if (this.aspectRatio !== null) {
                let height = window.innerHeight;
                const aspectWidth = window.innerWidth / this.aspectRatio;
                if (aspectWidth < height)
                    height = aspectWidth;
                this.resizeCanvas(height * this.aspectRatio, height);
            }
            else {
                this.resizeCanvas(window.innerWidth, window.innerHeight);
            }
        }
    }

    class AudioClip {
        constructor(buffer, context) {
            this.volume = 1;
            this.loop = false;
            this.playing = false;
            this.source = null;
            this.gain = null;
            this.buffer = buffer;
            this._context = context;
        }
        static fromURL(url, context) {
            return __awaiter(this, void 0, void 0, function* () {
                const response = yield fetch(url);
                const arrayBuffer = yield response.arrayBuffer();
                const decodedAudio = yield context.decodeAudioData(arrayBuffer);
                return new AudioClip(decodedAudio, context);
            });
        }
        play() {
            const source = this._context.createBufferSource();
            source.buffer = this.buffer;
            source.start(this._context.currentTime);
            source.loop = this.loop;
            source.onended = () => (this.playing = false);
            const gain = this._context.createGain();
            source.connect(gain);
            gain.connect(this._context.destination);
            gain.gain.value = this.volume;
            this.playing = true;
            this.source = source;
            this.gain = gain;
        }
        stop() {
            assert(this.source !== null, "Can't stop when the audio clip has not started.");
            this.source.stop(this._context.currentTime);
        }
        toggle() {
            this.playing ? this.stop() : this.play();
        }
    }

    /**
     * Class that is used to render images.
     *
     * @memberof ESSEM
     */
    class Texture {
        constructor(source) {
            this.glTexture = null;
            this.source = source;
            this.aspectRatio = this.source.width / this.source.height;
        }
        /**
         * Inits the texture. This will get automatically called when binding the texture.
         *
         * @param gl - An WebGL2 rendering context for the texture to use.
         */
        init(gl) {
            this.glTexture = gl.createTexture();
            assert(this.glTexture !== null, "Could not create glTexture!");
            this.bind(gl);
            // TODO: add options for this
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.source.width, this.source.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, this.source);
        }
        /**
         * Binds the texture.
         *
         * @param gl - An WebGL2 rendering context for the texture to use.
         * @param slot - The texture slot for the texture to be binded to (optional).
         */
        bind(gl, slot) {
            if (slot) {
                gl.activeTexture(gl.TEXTURE0 + slot);
            }
            if (this.glTexture === null) {
                this.init(gl);
            }
            else {
                gl.bindTexture(gl.TEXTURE_2D, this.glTexture);
            }
        }
        dispose(gl) {
            gl.deleteTexture(this.glTexture);
            this.glTexture = null;
        }
        static fromURL(url) {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => {
                    const image = new Image();
                    image.src = url;
                    image.onload = () => {
                        const texture = new Texture(image);
                        resolve(texture);
                    };
                    image.onerror = (event) => reject(event);
                });
            });
        }
    }
    Texture.WHITE = createWhiteTexture();
    function createWhiteTexture() {
        const canvas = document.createElement("canvas");
        canvas.width = 16;
        canvas.height = 16;
        const context = canvas.getContext("2d");
        context.fillStyle = "white";
        context.fillRect(0, 0, 16, 16);
        return new Texture(canvas);
    }

    /**
     * Used for loading resources such as images. It is automatically created when creating
     * {@link ESSEM.Application} and it can be accesed from `app.loader`.
     *
     * @memberof ESSEM
     */
    class Loader {
        constructor(audioContext) {
            this.resourceURLs = [];
            this.resources = {};
            this._audioContext = audioContext;
        }
        add(resourceType, url) {
            var _a;
            const resourceTypeName = (_a = resourceType.name) !== null && _a !== void 0 ? _a : resourceType;
            this.resourceURLs.push([resourceTypeName, url]);
            return this;
        }
        loadAll() {
            return __awaiter(this, void 0, void 0, function* () {
                for (const [resourceTypeName, url] of this.resourceURLs) {
                    switch (resourceTypeName) {
                        case "AudioClip":
                            this.resources[url] = yield AudioClip.fromURL(url, this._audioContext);
                            break;
                        case "Texture":
                            this.resources[url] = yield Texture.fromURL(url);
                    }
                }
                this.resourceURLs = [];
            });
        }
    }

    /** * Event that is sent whenever the Application initiates.
     *
     * @memberof ESSEM
     */
    class ApplicationInitEvent extends Event {
    }
    /**
     * Event that is sent whenever the Application updates.
     *
     * @memberof ESSEM
     */
    class ApplicationUpdateEvent extends Event {
        /**
         * @param delta - The delta time of the update.
         */
        constructor(delta) {
            super();
            this.delta = delta;
        }
    }
    /**
     * Class that is used for everything in essem.js.
     *
     * ## Example
     * ```js
     * // Create the application
     * const app = new ESSEM.Application();
     *
     * // Add the canvas element to the DOM
     * document.body.appendChild(app.canvas.element);
     *
     * // Create scene, add entities, add components ect.
     * const scene = app.createScene();
     * ```
     *
     * @memberof ESSEM
     */
    class Application {
        /**
         * @param {object} [options={}] - Optional parameters for Application.
         * @param {object} [options.canvasOptions={}] - Optional parameters for the canvas.
         *        See {@link ESSEM.Canvas}
         */
        constructor(options = {}) {
            this.audioContext = new AudioContext();
            this.eventManager = new EventManager();
            this.lastFrameTime = 0;
            this.running = true;
            this._systemClasses = [];
            this.canvas = new Canvas(options.canvasOptions, this.eventManager);
            this.loader = new Loader(this.audioContext);
            this.renderer = new Renderer(this.canvas.element);
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                yield this.loader.loadAll();
                this.eventManager.sendEvent(new ApplicationInitEvent());
                this.eventManager.addListener(CanvasResizedEvent, (event) => {
                    this.renderer.gl.viewport(0, 0, event.width, event.height);
                });
                sayHello();
                const loop = () => {
                    if (this.running) {
                        this._onUpdate();
                        requestAnimationFrame(loop);
                    }
                };
                requestAnimationFrame(loop);
            }));
        }
        /**
         * The update function that gets called every requestAnimationFrame loop.
         *
         * @private
         */
        _onUpdate() {
            const now = performance.now();
            const delta = now - this.lastFrameTime;
            this.renderer.update();
            this.eventManager.sendEvent(new ApplicationUpdateEvent(delta));
            this.lastFrameTime = now;
        }
        /**
         * Registers a parameterized array of system classes.
         * Use like this: `app.registerSystem(System1, System2, ...);`
         * Do all the registering at the start or the system will not work.
         *
         * @param {...SystemClass} systemClasses - An parameterized array of classes that extends
         *        {@link ESSEM.System}
         */
        registerSystem(...systemClasses) {
            this._systemClasses.push(...systemClasses);
        }
        /**
         * Creates a new scene.
         *
         * @return A new Scene.
         */
        createScene() {
            const scene = new Scene();
            const systems = [];
            this._systemClasses.forEach((systemClass) => {
                const system = new systemClass(scene);
                system.setup(this);
                systems.push(system);
            });
            scene.systems = systems;
            return scene;
        }
    }

    /**
     * The matrix as this class make it a lot faster since there are less values to work with.
     *
     * Here's a representation of it:
     * ```js
     * | xScale | xSkew | xTrans |
     * | ySkew  | yScale| yTrans |
     * | 0      | 0     | 1      |
     * ```
     *
     * @memberof ESSEM
     */
    class Matrix3 {
        constructor(xScale = 1, ySkew = 0, xSkew = 0, yScale = 1, xTrans = 0, yTrans = 0) {
            this._array = null;
            this.xScale = xScale;
            this.ySkew = ySkew;
            this.xSkew = xSkew;
            this.yScale = yScale;
            this.xTrans = xTrans;
            this.yTrans = yTrans;
        }
        clone() {
            return new Matrix3(this.xScale, this.ySkew, this.xSkew, this.yScale, this.xTrans, this.yTrans);
        }
        toString() {
            return (`Matrix3(\n\t` +
                `${this.xScale}, ${this.xSkew}, ${this.xTrans},\n\t` +
                `${this.ySkew}, ${this.yScale}, ${this.yTrans},\n\t` +
                `0, 0, 1\n)`);
        }
        toArray(transpose = true, out) {
            if (!this._array)
                this._array = new Float32Array(9);
            const array = out !== null && out !== void 0 ? out : this._array;
            if (transpose) {
                array[0] = this.xScale;
                array[1] = this.ySkew;
                array[2] = 0;
                array[3] = this.xSkew;
                array[4] = this.yScale;
                array[5] = 0;
                array[6] = this.xTrans;
                array[7] = this.yTrans;
                array[8] = 1;
            }
            else {
                array[0] = this.xScale;
                array[1] = this.xSkew;
                array[2] = this.xTrans;
                array[3] = this.ySkew;
                array[4] = this.yScale;
                array[5] = this.yTrans;
                array[6] = 0;
                array[7] = 0;
                array[8] = 1;
            }
            return array;
        }
        invert() {
            const xScale = this.xScale;
            const ySkew = this.ySkew;
            const xSkew = this.xSkew;
            const yScale = this.yScale;
            const xTrans = this.xTrans;
            const det = xScale * yScale - ySkew * xSkew;
            if (det === 0)
                return this;
            this.xScale = yScale / det;
            this.ySkew = -ySkew / det;
            this.xSkew = -xSkew / det;
            this.yScale = xScale / det;
            this.xTrans = (xSkew * this.yTrans - yScale * xTrans) / det;
            this.yTrans = -(xScale * this.yTrans - xSkew * xTrans) / det;
            return this;
        }
        identity() {
            this.xScale = 1;
            this.ySkew = 0;
            this.xSkew = 0;
            this.yScale = 1;
            this.xTrans = 0;
            this.yTrans = 0;
            return this;
        }
        multiply(matrix) {
            const xScale = this.xScale;
            const ySkew = this.ySkew;
            const xSkew = this.xSkew;
            const yScale = this.yScale;
            this.xScale = xScale * matrix.xScale + xSkew * matrix.ySkew;
            this.ySkew = ySkew * matrix.xScale + yScale * matrix.ySkew;
            this.xSkew = xScale * matrix.xSkew + xSkew * matrix.yScale;
            this.yScale = ySkew * matrix.xSkew + yScale * matrix.yScale;
            this.xTrans = xScale * matrix.xTrans + xSkew * matrix.yTrans + this.xTrans;
            this.yTrans = ySkew * matrix.xTrans + yScale * matrix.yTrans + this.yTrans;
            return this;
        }
        multiplyFront(matrix) {
            const xTrans = this.xTrans;
            if (matrix.xScale !== 1 ||
                matrix.ySkew !== 0 ||
                matrix.xSkew !== 0 ||
                matrix.yScale !== 1) {
                const xScale1 = this.xScale;
                const xSkew = this.xSkew;
                this.xScale = xScale1 * matrix.xScale + this.ySkew * matrix.xSkew;
                this.ySkew = xScale1 * matrix.ySkew + this.ySkew * matrix.yScale;
                this.xSkew = xSkew * matrix.xScale + this.yScale * matrix.xSkew;
                this.yScale = xSkew * matrix.ySkew + this.yScale * matrix.yScale;
            }
            this.xTrans = xTrans * matrix.xScale + this.yTrans * matrix.xSkew + matrix.xTrans;
            this.yTrans = xTrans * matrix.ySkew + this.yTrans * matrix.yScale + matrix.yTrans;
            return this;
        }
        translate(x, y) {
            this.xTrans += x;
            this.yTrans += y;
            return this;
        }
        scale(x, y) {
            this.xScale *= x;
            this.yScale *= y;
            this.xSkew *= x;
            this.ySkew *= y;
            this.xTrans *= x;
            this.yTrans *= y;
            return this;
        }
        rotate(angle) {
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            const xScale = this.xScale;
            const xSkew = this.xSkew;
            const xTrans = this.xTrans;
            this.xScale = xScale * cos - this.ySkew * sin;
            this.ySkew = xScale * sin + this.ySkew * cos;
            this.xSkew = xSkew * cos - this.yScale * sin;
            this.yScale = xSkew * sin + this.yScale * cos;
            this.xTrans = xTrans * cos - this.yTrans * sin;
            this.yTrans = xTrans * sin + this.yTrans * cos;
            return this;
        }
        // TODO: perhaps make this not use matrix funcions?
        transform(position, scale, rotation) {
            this.identity();
            if (rotation !== 0) {
                this.rotate(rotation);
            }
            this.translate(position.x, position.y).scale(scale.x, scale.y);
            return this;
        }
        projection(left, right, bottom, top) {
            const rl = right - left;
            const tp = top - bottom;
            this.xScale = 2 / rl;
            this.yScale = 2 / tp;
            this.xTrans = (right + left) / rl;
            this.yTrans = (top + bottom) / tp;
            this.xSkew = 0;
            this.ySkew = 0;
            return this;
        }
    }

    /**
     * Component to handle camera stuff
     * All render systems will look for a entity tagged 'MainCamera' as the camera to render with.
     *
     * @memberof ESSEM
     */
    class CameraComponent {
        constructor(zoom = 5, fixedAspectRatio = false) {
            this.aspectRatio = 0;
            this._projectionMatrix = new Matrix3();
            this.size = zoom;
            this.fixedAspectRatio = fixedAspectRatio;
        }
        setViewportSize(width, height) {
            this.aspectRatio = width / height;
        }
        getProjectionMatrix() {
            return this._projectionMatrix.projection(-this.size * this.aspectRatio, this.size * this.aspectRatio, this.size, -this.size);
        }
    }

    /**
     * Component that handles sprite info like textures and colours.
     *
     * @memberof ESSEM
     */
    class SpriteComponent {
        /**
         * @param texture - Texture to use. This should be resued between other components.
         * @param color -
         */
        constructor(texture, color = 0xffffff) {
            this.texture = texture;
            this.color = color;
        }
        /**
         * Colour of the sprite in hexadecimal.
         */
        set color(hex) {
            this._hexColor = hex;
            this.rgbaColor = hexToRGBA(hex);
        }
        get color() {
            return this._hexColor;
        }
    }

    /**
     * Component that holds the position, scale and rotation of an entity.
     *
     * @memberof ESSEM
     */
    class TransformComponent {
        /**
         * @param position - Starting position.
         * @param scale - Starting scale.
         * @param rotation - Starting rotation.
         */
        constructor(position = new Vector2(), scale = new Vector2(1, 1), rotation = 0) {
            this._transformMatrix = new Matrix3();
            this._transformValid = false;
            this._position = position;
            this._scale = scale;
            this._rotation = rotation;
        }
        /**
         * Matrix that holds the transform of the component.
         * This value will be cached and invalidated when making any changes to the component.
         *
         * @readonly
         */
        get transformMatrix() {
            if (!this._transformValid) {
                this._transformMatrix.transform(this._position, this._scale, this._rotation);
                this._transformValid = true;
            }
            return this._transformMatrix;
        }
        /**
         * Rotation of the component.
         */
        set rotation(rotation) {
            this._transformValid = false;
            this._rotation = rotation;
        }
        get rotation() {
            return this._rotation;
        }
        /**
         * Position of the component.
         */
        set position(position) {
            this._transformValid = false;
            this._position = position;
        }
        get position() {
            this._transformValid = false;
            return this._position;
        }
        /**
         * Scale of the component.
         */
        set scale(scale) {
            this._transformValid = false;
            this._scale = scale;
        }
        get scale() {
            this._transformValid = false;
            return this._scale;
        }
        static getGlobalPosition(entity) {
            const vector = entity.getComponent(TransformComponent)._position.clone();
            entity.forEachParent((parent) => {
                vector.add(parent.getComponent(TransformComponent)._position);
            });
            return vector;
        }
        static getGlobalScale(entity) {
            const vector = entity.getComponent(TransformComponent)._scale.clone();
            entity.forEachParent((parent) => {
                vector.add(parent.getComponent(TransformComponent)._scale);
            });
            return vector;
        }
        static getGlobalRotation(entity) {
            let rotation = entity.getComponent(TransformComponent)._rotation;
            entity.forEachParent((parent) => {
                rotation += parent.getComponent(TransformComponent)._rotation;
            });
            return rotation;
        }
        /**
         * Gets the global transform matrix relative to all the entity's parents.
         *
         * @param entity - Entity to get the global transform matrix of.
         * @return A global transform matrix.
         */
        static getGlobalTransformMatrix(entity) {
            const matrix = entity.getComponent(TransformComponent).transformMatrix;
            entity.forEachParent((parent) => {
                matrix.multiplyFront(parent.getComponent(TransformComponent).transformMatrix);
            });
            return matrix;
        }
    }

    /**
     * System base class to extend to collect all the wanted entities and do stuff to them.
     * * ## Example * ```js
     * // System that logs hello for each entity with a transform component
     * class HelloSystem extends ESSEM.System {
     *     setup(app) {
     *         app.eventManager.addListener(ESSEM.ApplicationUpdateEvent, this.onUpdate.bind(this));
     *         this.setComponents(ESSEM.TransformComponent);
     *     }
     *
     *     onUpdate() {
     *         for (entity of this.entities) {
     *             const transform = entity.getComponent(ESSEM.TransformComponent);
     *             console.log("Hello from: " + tranform.position.toString())
     *         }
     *     }
     * }
     *
     * const app = new ESSEM.Application();
     * app.registerSystem(HelloSystem);
     * const scene = app.createScene()
     *
     * // Logs "Hello from: Vector2(0, 1)" every frame
     * const entity = scene.createEntity();
     * entity.addComponent(new TransformComponent(new ESSEM.Vector2(0, 1)));
     * ```
     *
     * @memberof ESSEM
     */
    class System {
        constructor(scene) {
            /**
             * The entities that have the system's component types.
             */
            this.entities = [];
            /**
             * The name of the component types that has been set.
             */
            this.typeNames = [];
            this.scene = scene;
        }
        /**
         * Sets the component types that the system will use to collect entities.
         * Note that previous sets of component types will not be removed and so new sets will just be
         * added on top.
         *
         * @param componentTypes - Array of component classes or names.
         */
        setComponents(componentTypes) {
            for (const componentType of componentTypes) {
                const typeName = getTypeName(componentType);
                this.scene._systemTypeNameAdd(this, typeName);
            }
        }
    }

    /**
     * Register this system when handling cameras.
     *
     * @memberof ESSEM
     */
    class CameraSystem extends System {
        setup(app) {
            this.setComponents([TransformComponent, CameraComponent]);
            app.eventManager.addListener(CanvasResizedEvent, this.onResized.bind(this));
            this.canvas = app.canvas;
        }
        onEntityAdd(entity) {
            const cameraComponent = entity.getComponent(CameraComponent);
            if (!cameraComponent.fixedAspectRatio) {
                cameraComponent.setViewportSize(this.canvas.width, this.canvas.height);
            }
        }
        onResized(event) {
            this.entities.forEach((entity) => {
                const cameraComponent = entity.getComponent(CameraComponent);
                if (!cameraComponent.fixedAspectRatio) {
                    cameraComponent.setViewportSize(event.width, event.height);
                }
            });
        }
    }

    class Shader {
        constructor(vertexSrc, fragmentSrc, name = "Default") {
            this.glProgram = null;
            this.uniformLocationCache = new Map();
            this.vertexSrc = vertexSrc;
            this.fragmentSrc = fragmentSrc;
            this.name = name;
        }
        init(gl) {
            const glVertexShader = this._compileGLShader(gl, gl.VERTEX_SHADER, this.vertexSrc);
            const glFragmentShader = this._compileGLShader(gl, gl.FRAGMENT_SHADER, this.fragmentSrc);
            this.glProgram = gl.createProgram();
            assert(this.glProgram !== null, `Could not create glProgram!`);
            gl.attachShader(this.glProgram, glVertexShader);
            gl.attachShader(this.glProgram, glFragmentShader);
            gl.linkProgram(this.glProgram);
            if (!gl.getProgramParameter(this.glProgram, gl.LINK_STATUS)) {
                const programLog = gl.getProgramInfoLog(this.glProgram);
                throw new Error(`Program failed to link in '${this.name}' shader!\n${programLog}`);
            }
            gl.deleteShader(glVertexShader);
            gl.deleteShader(glFragmentShader);
        }
        bind(gl) {
            if (!this.glProgram) {
                this.init(gl);
            }
            gl.useProgram(this.glProgram);
        }
        dispose(gl) {
            gl.deleteProgram(this.glProgram);
        }
        getUniformLocation(gl, name) {
            const cachedLocation = this.uniformLocationCache.get(name);
            if (cachedLocation !== undefined) {
                return cachedLocation;
            }
            assert(this.glProgram !== null, `Has not initialized yet in '${this.name}' shader!`);
            const location = gl.getUniformLocation(this.glProgram, name);
            assert(location !== null, `Uniform '${name}' does not appear to exist!`);
            this.uniformLocationCache.set(name, location);
            return location;
        }
        setFloat1(gl, name, value) {
            gl.uniform1f(this.getUniformLocation(gl, name), value);
        }
        setFloat2(gl, name, value) {
            gl.uniform2f(this.getUniformLocation(gl, name), value.x, value.y);
        }
        setInt1(gl, name, value) {
            gl.uniform1i(this.getUniformLocation(gl, name), value);
        }
        setIntArray(gl, name, value) {
            gl.uniform1iv(this.getUniformLocation(gl, name), value);
        }
        setMatrix3(gl, name, value) {
            gl.uniformMatrix3fv(this.getUniformLocation(gl, name), false, value.toArray(true));
        }
        _compileGLShader(gl, type, source) {
            const glShader = gl.createShader(type);
            const shaderTypeName = type === gl.VERTEX_SHADER ? "vertex" : "fragment";
            assert(glShader !== null, `Could not create ${shaderTypeName} shader!`);
            gl.shaderSource(glShader, source);
            gl.compileShader(glShader);
            if (!gl.getShaderParameter(glShader, gl.COMPILE_STATUS)) {
                const shaderLog = gl.getShaderInfoLog(glShader);
                throw new Error(`Failed to compile ${shaderTypeName} shader in '${this.name}' shader!\n${shaderLog}`);
            }
            return glShader;
        }
    }

    class VertexArray {
        constructor(gl) {
            this.glIndexBuffer = null;
            this.glVertexBuffers = [];
            const glVertexArray = gl.createVertexArray();
            assert(glVertexArray !== null, "Failed to create vertex array!");
            this.glVertexArray = glVertexArray;
        }
        bind(gl) {
            gl.bindVertexArray(this.glVertexArray);
        }
        addVertexBuffer(gl, vertices, usage = WebGL2RenderingContext.STATIC_DRAW) {
            this.bind(gl);
            const glVertexBuffer = gl.createBuffer();
            assert(glVertexBuffer !== null, "Failed to create vertex buffer!");
            gl.bindBuffer(gl.ARRAY_BUFFER, glVertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, vertices, usage);
            this.glVertexBuffers.push(glVertexBuffer);
            return glVertexBuffer;
        }
        setIndexBuffer(gl, indices) {
            this.bind(gl);
            const glIndexBuffer = gl.createBuffer();
            assert(glIndexBuffer !== null, "Failed to create index buffer!");
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, glIndexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
            this.glIndexBuffer = glIndexBuffer;
            return glIndexBuffer;
        }
        dispose(gl) {
            this.glVertexBuffers.forEach((buffer) => {
                gl.deleteBuffer(buffer);
            });
            gl.deleteBuffer(this.glIndexBuffer);
            gl.deleteVertexArray(this.glVertexArray);
        }
    }

    var textureVertexSrc = "#version 300 es\n\nlayout(location = 0) in vec2 a_position;\nlayout(location = 1) in vec2 a_texCoord;\nlayout(location = 2) in float a_texIndex;\nlayout(location = 3) in vec4 a_color;\n\nuniform mat3 u_viewProjection;\n\nout vec2 v_texCoord;\nout float v_texIndex;\nout vec4 v_color;\n\nvoid main() \n{\n    v_texCoord = a_texCoord;\n    v_texIndex = a_texIndex;\n    v_color = a_color;\n\n    gl_Position = vec4(u_viewProjection * vec3(a_position, 1.0), 1.0);\n}\n";

    var textureFragmentSrc = "#version 300 es\n\nprecision mediump float;\n\nlayout(location = 0) out vec4 color;\n\nin vec2 v_texCoord;\nin float v_texIndex;\nin vec4 v_color;\n\nuniform sampler2D u_textures[32];\n\nvoid main() \n{\n    vec4 texColor = v_color;\n    vec2 coordinate = v_texCoord;\n\n    // have to use switch because WebGL doesn't support dynamic sampler indexing\n    switch(int(v_texIndex))\n\t{\n\t\tcase 0: texColor *= texture(u_textures[0], coordinate); break;\n\t\tcase 1: texColor *= texture(u_textures[1], coordinate); break;\n\t\tcase 2: texColor *= texture(u_textures[2], coordinate); break;\n\t\tcase 3: texColor *= texture(u_textures[3], coordinate); break;\n\t\tcase 4: texColor *= texture(u_textures[4], coordinate); break;\n\t\tcase 5: texColor *= texture(u_textures[5], coordinate); break;\n\t\tcase 6: texColor *= texture(u_textures[6], coordinate); break;\n\t\tcase 7: texColor *= texture(u_textures[7], coordinate); break;\n\t\tcase 8: texColor *= texture(u_textures[8], coordinate); break;\n\t\tcase 9: texColor *= texture(u_textures[9], coordinate); break;\n\t\tcase 10: texColor *= texture(u_textures[10], coordinate); break;\n\t\tcase 11: texColor *= texture(u_textures[11], coordinate); break;\n\t\tcase 12: texColor *= texture(u_textures[12], coordinate); break;\n\t\tcase 13: texColor *= texture(u_textures[13], coordinate); break;\n\t\tcase 14: texColor *= texture(u_textures[14], coordinate); break;\n\t\tcase 15: texColor *= texture(u_textures[15], coordinate); break;\n\t\tcase 16: texColor *= texture(u_textures[16], coordinate); break;\n\t\tcase 17: texColor *= texture(u_textures[17], coordinate); break;\n\t\tcase 18: texColor *= texture(u_textures[18], coordinate); break;\n\t\tcase 19: texColor *= texture(u_textures[19], coordinate); break;\n\t\tcase 20: texColor *= texture(u_textures[20], coordinate); break;\n\t\tcase 21: texColor *= texture(u_textures[21], coordinate); break;\n\t\tcase 22: texColor *= texture(u_textures[22], coordinate); break;\n\t\tcase 23: texColor *= texture(u_textures[23], coordinate); break;\n\t\tcase 24: texColor *= texture(u_textures[24], coordinate); break;\n\t\tcase 25: texColor *= texture(u_textures[25], coordinate); break;\n\t\tcase 26: texColor *= texture(u_textures[26], coordinate); break;\n\t\tcase 27: texColor *= texture(u_textures[27], coordinate); break;\n\t\tcase 28: texColor *= texture(u_textures[28], coordinate); break;\n\t\tcase 29: texColor *= texture(u_textures[29], coordinate); break;\n\t\tcase 30: texColor *= texture(u_textures[30], coordinate); break;\n\t\tcase 31: texColor *= texture(u_textures[31], coordinate); break;\n\t}\n\n    color = texColor;\n}\n";

    class AbstractBatchRenderer {
        constructor(renderer) {
            this.textureToSlotMap = new Map();
            this.vertices = new Float32Array(AbstractBatchRenderer.maxVertices);
            this.indices = new Uint16Array(AbstractBatchRenderer.maxIndices);
            this.verticesIndex = 0;
            this.indicesCount = 0;
            this.textureSlotIndex = 0;
            this.renderer = renderer;
            const gl = renderer.gl;
            this.vertexArray = new VertexArray(gl);
            this.vertexBuffer = this.vertexArray.addVertexBuffer(gl, this.vertices, gl.DYNAMIC_DRAW);
            for (let i = 0, offset = 0; i < AbstractBatchRenderer.maxIndices; i += 6, offset += 4) {
                this.indices[i] = offset;
                this.indices[i + 1] = offset + 1;
                this.indices[i + 2] = offset + 2;
                this.indices[i + 3] = offset + 2;
                this.indices[i + 4] = offset + 3;
                this.indices[i + 5] = offset;
            }
            this.vertexArray.setIndexBuffer(gl, this.indices);
            const stride = AbstractBatchRenderer.vertexSize * Float32Array.BYTES_PER_ELEMENT;
            gl.enableVertexAttribArray(0);
            gl.vertexAttribPointer(0, 2, gl.FLOAT, false, stride, 0);
            gl.enableVertexAttribArray(1);
            gl.vertexAttribPointer(1, 2, gl.FLOAT, false, stride, 2 * Float32Array.BYTES_PER_ELEMENT);
            gl.enableVertexAttribArray(2);
            gl.vertexAttribPointer(2, 1, gl.FLOAT, false, stride, 4 * Float32Array.BYTES_PER_ELEMENT);
            gl.enableVertexAttribArray(3);
            gl.vertexAttribPointer(3, 4, gl.FLOAT, false, stride, 5 * Float32Array.BYTES_PER_ELEMENT);
            // TODO: abstract shader
            this.textureShader = new Shader(textureVertexSrc, textureFragmentSrc, "Sprite");
            this.textureShader.bind(gl);
            const samplers = new Int32Array(renderer.maxTextureSlots).map((_, i) => i);
            this.textureShader.setIntArray(gl, "u_textures", samplers);
            this.textureSlots = new Array(renderer.maxTextureSlots).fill(undefined);
        }
        beginScene(viewProjection) {
            const gl = this.renderer.gl;
            this.textureShader.bind(gl);
            this.textureShader.setMatrix3(gl, "u_viewProjection", viewProjection);
            this.startBatch();
        }
        endScene() {
            this.flush();
        }
        startBatch() {
            this.verticesIndex = 0;
            this.indicesCount = 0;
        }
        nextBatch() {
            this.flush();
            this.startBatch();
            this.textureSlotIndex = 0;
        }
        flush() {
            if (this.indicesCount === 0 || this.verticesIndex === 0)
                return;
            const gl = this.renderer.gl;
            // set buffer data
            const vertices = this.verticesIndex === AbstractBatchRenderer.maxVertices
                ? this.vertices
                : this.vertices.subarray(0, this.verticesIndex);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, vertices);
            // bind textures
            for (let i = 0; i < this.textureSlotIndex; i++) {
                this.textureSlots[i].bind(gl, i);
            }
            // now draw!
            this.vertexArray.bind(gl);
            gl.drawElements(gl.TRIANGLES, this.indicesCount, gl.UNSIGNED_SHORT, 0);
        }
        getTextureSlot(texture) {
            let slot = this.textureToSlotMap.get(texture);
            if (slot === undefined) {
                if (this.textureSlotIndex >= this.renderer.maxTextureSlots)
                    this.nextBatch();
                slot = this.textureSlotIndex;
                this.textureSlots[this.textureSlotIndex] = texture;
                this.textureToSlotMap.set(texture, this.textureSlotIndex);
                this.textureSlotIndex++;
            }
            return slot;
        }
    }
    AbstractBatchRenderer.vertexSize = 9; // position (2) + texCoord (2) + texture index (1) + color (4)
    AbstractBatchRenderer.maxDraws = 1000;
    AbstractBatchRenderer.maxVertices = AbstractBatchRenderer.maxDraws * 4 * AbstractBatchRenderer.vertexSize;
    AbstractBatchRenderer.maxIndices = AbstractBatchRenderer.maxDraws * 6;
    AbstractBatchRenderer.maxVerticesBytes = AbstractBatchRenderer.maxVertices * Float32Array.BYTES_PER_ELEMENT;

    class SpriteRenderer extends AbstractBatchRenderer {
        constructor() {
            super(...arguments);
            this._cacheVector = new Vector2();
        }
        drawSprite(entity) {
            if (this.indicesCount >= AbstractBatchRenderer.maxIndices)
                this.nextBatch();
            const matrix = TransformComponent.getGlobalTransformMatrix(entity);
            const sprite = entity.getComponent(SpriteComponent);
            for (let i = 0; i < 4; i++) {
                const index = i * 2;
                this._cacheVector
                    .set(SpriteRenderer.vertexPositions[index] * sprite.texture.aspectRatio, SpriteRenderer.vertexPositions[index + 1])
                    .transformMatrix3(matrix);
                this.vertices[this.verticesIndex++] = this._cacheVector.x;
                this.vertices[this.verticesIndex++] = this._cacheVector.y;
                this.vertices[this.verticesIndex++] = SpriteRenderer.texCoords[index];
                this.vertices[this.verticesIndex++] = SpriteRenderer.texCoords[index + 1];
                this.vertices[this.verticesIndex++] = this.getTextureSlot(sprite.texture);
                this.vertices[this.verticesIndex++] = sprite.rgbaColor[0];
                this.vertices[this.verticesIndex++] = sprite.rgbaColor[1];
                this.vertices[this.verticesIndex++] = sprite.rgbaColor[2];
                this.vertices[this.verticesIndex++] = sprite.rgbaColor[3];
            }
            this.indicesCount += 6;
        }
    }
    // prettier-ignore
    SpriteRenderer.vertexPositions = new Float32Array([
        -0.5, -0.5,
        0.5, -0.5,
        0.5, 0.5,
        -0.5, 0.5,
    ]);
    // prettier-ignore
    SpriteRenderer.texCoords = new Float32Array([
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
    ]);
    /**
     * Register this system to render sprites.
     *
     * @memberof ESSEM
     */
    class SpriteRendererSystem extends System {
        setup(app) {
            this.setComponents([TransformComponent, SpriteComponent]);
            app.eventManager.addListener(ApplicationUpdateEvent, this.onUpdate.bind(this));
            this.spriteRenderer = new SpriteRenderer(app.renderer);
        }
        onUpdate() {
            const mainCamera = this.scene.getEntitesByTag("MainCamera")[0];
            if (mainCamera === undefined)
                return;
            const viewProjection = mainCamera.getComponent(CameraComponent).getProjectionMatrix();
            viewProjection.multiply(mainCamera.getComponent(TransformComponent).transformMatrix.invert());
            this.spriteRenderer.beginScene(viewProjection);
            this.entities.forEach((entity) => {
                this.spriteRenderer.drawSprite(entity);
            });
            this.spriteRenderer.endScene();
        }
    }

    /**
     * @namespace ESSEM
     */
    /**
     * The version of the essem.js library being used.
     *
     * @memberof ESSEM
     * @type string
     */
    const VERSION = "0.0.0";
    if (window.__ESSEM__) {
        throw new Error("essem.js is already imported!");
    }
    else {
        window.__ESSEM__ = true;
    }

    exports.AbstractBatchRenderer = AbstractBatchRenderer;
    exports.Application = Application;
    exports.ApplicationInitEvent = ApplicationInitEvent;
    exports.ApplicationUpdateEvent = ApplicationUpdateEvent;
    exports.AssertionError = AssertionError;
    exports.AudioClip = AudioClip;
    exports.CameraComponent = CameraComponent;
    exports.CameraSystem = CameraSystem;
    exports.Canvas = Canvas;
    exports.CanvasResizedEvent = CanvasResizedEvent;
    exports.DEG_TO_RAD = DEG_TO_RAD;
    exports.Entity = Entity;
    exports.Event = Event;
    exports.EventManager = EventManager;
    exports.KeyPressedEvent = KeyPressedEvent;
    exports.KeyReleasedEvent = KeyReleasedEvent;
    exports.KeyTypedEvent = KeyTypedEvent;
    exports.Loader = Loader;
    exports.Matrix3 = Matrix3;
    exports.MouseMovedEvent = MouseMovedEvent;
    exports.MousePressedEvent = MousePressedEvent;
    exports.MouseReleasedEvent = MouseReleasedEvent;
    exports.MouseScrolledEvent = MouseScrolledEvent;
    exports.RAD_TO_DEG = RAD_TO_DEG;
    exports.Renderer = Renderer;
    exports.Scene = Scene;
    exports.Shader = Shader;
    exports.SpriteComponent = SpriteComponent;
    exports.SpriteRenderer = SpriteRenderer;
    exports.SpriteRendererSystem = SpriteRendererSystem;
    exports.System = System;
    exports.TWO_PI = TWO_PI;
    exports.Texture = Texture;
    exports.TransformComponent = TransformComponent;
    exports.VERSION = VERSION;
    exports.Vector2 = Vector2;
    exports.VertexArray = VertexArray;
    exports.approxEquals = approxEquals;
    exports.assert = assert;
    exports.getTypeName = getTypeName;
    exports.hexToRGBA = hexToRGBA;
    exports.isWebGL2Supported = isWebGL2Supported;
    exports.lastItemSwapRemove = lastItemSwapRemove;
    exports.mapGet = mapGet;
    exports.sayHello = sayHello;
    exports.skipHello = skipHello;
    exports.toDegrees = toDegrees;
    exports.toRadians = toRadians;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=essem.js.map
