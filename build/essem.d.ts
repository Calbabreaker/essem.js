/*!
 * essem.js - v0.0.0
 * Compiled Mon, 19 Apr 2021 06:21:01 GMT
 *
 * Free to use under the MIT LICENSE.
 */
declare class Renderer {
    readonly gl: WebGL2RenderingContext;
    readonly maxTextureSlots: number;
    constructor(canvasElement: HTMLCanvasElement);
    update(): void;
    set backgroundColor(hexColor: number);
}

declare type AnyCtor<T> = new (...args: any[]) => T;
declare type ArrayCtor<T> = new (...items: T[]) => T[];
declare global {
    interface Window {
        __ESSEM__: boolean;
        ESSEM: {
            [key: string]: unknown;
        };
    }
}

declare type Component = Object;
declare type ComponentClass = AnyCtor<Component>;
/**
 * Entity class to handle components in ecs.
 *
 * @memberof ESSEM
 */
declare class Entity {
    /**
     * The child entities of the entity mapped by their name.
     */
    children: Map<string, Entity>;
    /**
     * Identifier of the entity, only unique to its scene.
     */
    readonly id: number;
    private _active;
    private _activeSelf;
    private _destroyed;
    private _name;
    private _parent;
    _systemIndexMap: Map<string, number>;
    _tagIndexMap: Map<string, number>;
    private _componentMap;
    private _scene;
    constructor(id: number, scene: Scene);
    /**
     * Adds a new component to the entity.
     *
     * @param {Component} component - Any object that is an instance of a class. Same named classes
     *        will be considered as the same component.
     * @return {Component} The component that was added.
     */
    addComponent<T extends Component>(component: T): T;
    /**
     * Removes a component from the entity.
     *
     * @param componentType - The component name or class to remove.
     *        Same named classes will be considered as the same component.
     */
    removeComponent(componentType: ComponentClass | string): void;
    /**
     * Checks to see if the component is on the entity.
     *
     * @param componentType - The component name or class to check.
     *        Same named classes will be considered as the same component.
     * @return Whether or not the entity has the component.
     */
    hasComponent(componentType: ComponentClass | string): boolean;
    /**
     * Checks to see if all the components specified are on the entity.
     *
     * @param componentType - An array of the component names or classes to check.
     *        Same named classes will be considered as the same component.
     * @return Whether or not the entity has all the components.
     */
    hasAllComponents(componentTypes: (ComponentClass | string)[]): boolean;
    /**
     * Gets a component from the entity.
     *
     * @param {ComponentClass | string} componentType - The component name or class to get.
     *        Same named classes will be considered as the same component.
     * @return {Component} The component that was retrieved.
     */
    getComponent<T extends Component>(componentType: AnyCtor<T> | string): T;
    addTag(tag: string): void;
    hasTag(tag: string): boolean;
    removeTag(tag: string): void;
    /**
     * Whether or not the entity is active.
     * Making the entity unactive will remove it from systems and the scene tag collection and put
     * back when active.
     * Setting the value will make all its children be the same active state unless the child is
     * explicitly set to be not active and the parent(s) is set to be active.
     */
    get active(): boolean;
    set active(active: boolean);
    /**
     * The local active state.
     * This will be regardless of its parents` active states.
     *
     * @readonly
     */
    get activeSelf(): boolean;
    private _setActive;
    /**
     * Parent of the entity. Could be either another entity, the scene or none at all.
     */
    get parent(): Entity | Scene | null;
    set parent(parent: Entity | Scene | null);
    /**
     * The name of the entity.
     */
    get name(): string;
    set name(name: string);
    forEachParent(func: (parent: Entity) => void): void;
    forEachChildrenRecursive(func: (child: Entity) => void): void;
    /**
     * Whether or not the entity is destroyed.
     *
     * @readonly
     */
    get destroyed(): boolean;
    /**
     * Gets called when creating a new entity from the scene.
     *
     * @private
     */
    _setup(name: string, parent: Entity | Scene): void;
    /**
     * Gets called when deleting the entity from the scene.
     *
     * @private
     */
    _destroy(): void;
}

declare type SystemClass = new (scene: Scene) => System;
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
declare abstract class System {
    /**
     * The entities that have the system's component types.
     */
    entities: Entity[];
    /**
     * The name of the component types that has been set.
     */
    typeNames: string[];
    /**
     * The scene that the system is active on.
     */
    protected scene: Scene;
    constructor(scene: Scene);
    /**
     * Abstract function that gets called when the system is created. This should be overrided to
     * setup component types and event listeners.
     *
     * @param app - The application that the system was registed from. Use this to register event
     *        listeners and other stuff.
     */
    abstract setup(app: Application): void;
    /**
     * Optional abstract function that gets called whenever a matching entity gets added.
     *
     * @param entity - The entity that was added to this.entites.
     */
    onEntityAdd?(entity: Entity): void;
    /**
     * Sets the component types that the system will use to collect entities.
     * Note that previous sets of component types will not be removed and so new sets will just be
     * added on top.
     *
     * @param componentTypes - Array of component classes or names.
     */
    setComponents(componentTypes: (ComponentClass | string)[]): void;
}

declare type ObjectClassType<T, M> = new (id: number, objectManager: M) => T;
declare class ObjectPool<T, M = undefined> {
    objectClass: ObjectClassType<T, M>;
    objectManager: M;
    availableObjects: T[];
    totalObjects: number;
    constructor(objectClass: ObjectClassType<T, M>, objectManager: M);
    aquire(): T;
    release(object: T): void;
    reserve(count: number): void;
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
declare class Scene {
    /**
     * The instances of the systems for the scene that are registered.
     */
    systems: System[];
    /**
     * A map containing scene entities mapped by their entity names.
     */
    children: Map<string, Entity>;
    entityPool: ObjectPool<Entity, Scene>;
    private _typeNameToSystem;
    private _tagToEntities;
    constructor();
    /**
     * Creates a new entity that is aquired from a pool for efficency.
     *
     * @param [name=`Unnamed Entity ${entity.id}`] - The name of the entity.
     * @param parent - The parent for the entity. Default is the scene.
     * @return The entity that was created.
     */
    createEntity(name?: string, parent?: Entity | Scene): Entity;
    /**
     * Destroys the entity and all it's children and release them back to the entity pool.
     *
     * @param entity - Entity to destroy.
     */
    destroyEntity(entity: Entity): void;
    /**
     * Gets all the entities that tagged with the tag.
     *
     * @param tag - The tag to use.
     * @return An array of entities with the tag.
     */
    getEntitesByTag(tag: string): Entity[];
    /**
     * Gets called whenever a component gets added to an entity.
     *
     * @private
     */
    _entityComponentAdd(entity: Entity, typeName: string): void;
    /**
     * Gets called whenever a component gets removed from an entity.
     *
     * @private
     */
    _entityComponentRemove(entity: Entity, typeName: string): void;
    /**
     * Gets called whenever a tag gets removed from an entity.
     *
     * @private
     */
    _entityTagRemove(entity: Entity, tag: string): void;
    /**
     * Gets called whenever a tag gets added to an entity.
     *
     * @private
     */
    _entityTagAdd(entity: Entity, tag: string): void;
    /**
     * Gets called whenever a component type gets added to a system.
     *
     * @private
     */
    _systemTypeNameAdd(system: System, typeName: string): void;
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
declare class Matrix3 {
    xScale: number;
    ySkew: number;
    xSkew: number;
    yScale: number;
    xTrans: number;
    yTrans: number;
    private _array;
    constructor(xScale?: number, ySkew?: number, xSkew?: number, yScale?: number, xTrans?: number, yTrans?: number);
    clone(): Matrix3;
    toString(): string;
    toArray(transpose?: boolean, out?: Float32Array): Float32Array;
    invert(): this;
    identity(): this;
    multiply(matrix: Matrix3): this;
    multiplyFront(matrix: Matrix3): this;
    translate(x: number, y: number): this;
    scale(x: number, y: number): this;
    rotate(angle: number): this;
    transform(position: Vector2, scale: Vector2, rotation: number): this;
    projection(left: number, right: number, bottom: number, top: number): this;
}

/**
 * A 2 component vector with x and y.
 *
 * @memberof ESSEM
 */
declare class Vector2 {
    /**
     * The x component of the vector.
     */
    x: number;
    /**
     * The y component of the vector.
     */
    y: number;
    /**
     * The cache for toArray.
     */
    private _array;
    constructor(x?: number, y?: number);
    set(x?: number, y?: number): this;
    setVector(vector: Vector2): this;
    clone(): Vector2;
    toString(): string;
    toArray(out?: Float32Array): Float32Array;
    add(vector: Vector2): this;
    subtract(vector: Vector2): this;
    multiply(scalar: number): this;
    divide(scalar: number): this;
    distanceSquared(vector: Vector2): number;
    distance(vector: Vector2): number;
    magnitudeSquared(): number;
    magnitude(): number;
    normalize(): this;
    dot(vector: Vector2): number;
    cross(vector: Vector2): number;
    random(magnitude?: number): this;
    rotate(radians: number, origin?: Vector2): this;
    angle(origin?: Vector2): number;
    exactEquals(vector: Vector2): boolean;
    /**
     * Checks to see if this vector is approximately equal to the input vector
     * according to tolerance.
     *
     * @param vector - The input vector to compare.
     * @param {number} [tolerance=0.001] - The range to check in.
     * @return Whether or not the vectors are approximately equal.
     */
    approxEquals(vector: Vector2, tolerance?: number): boolean;
    transformMatrix3(matrix: Matrix3): this;
}

/**
 * Event base class that all events must extend from.
 *
 * @memberof ESSEM
 */
declare abstract class Event {
    /**
     * Whether or not the event has been handled. Set this to true to make it stopped
     * being sent to all other event listeners.
     */
    handled: boolean;
}
declare type EventListenerFunc<T extends Event = Event> = (event: T) => void;
/**
 * Used to add listeners and send events. It is automatically created when creating
 * {@link ESSEM.Application} and it can be accesed from `app.events`.
 *
 * @memberof ESSEM
 */
declare class EventManager {
    eventListenersMap: Map<string, EventListenerFunc[]>;
    /**
     * Adds a function to act as a listener to listen and receive the specified event.
     *
     * @param eventType - The event class or name for the listener to listen to.
     * @param listenerFunc - The function that will receive the events.
     */
    addListener<T extends Event>(eventType: AnyCtor<T> | string, listenerFunc: EventListenerFunc<T>): void;
    /**
     * Send a event for all event's listeners to get.
     *
     * @param event - An instance of the event to send. Same named classes will be considered as
     *                the same event.
     */
    sendEvent(event: Event): void;
}

/**
 * Event that gets sent whenever the canvas resizes.
 * This won't get called if just the window does though.
 *
 * @memberof ESSEM
 */
declare class CanvasResizedEvent extends Event {
    /**
     * The current width of the canvas.
     */
    readonly width: number;
    /**
     * The current height of the canvas.
     */
    readonly height: number;
    constructor(width: number, height: number);
}
interface ICanvasOptions {
    fixedSize?: boolean;
    width?: number;
    height?: number;
    aspectRatio?: number;
}
/**
 * Used for the canvas element and input events. It is automatically created when creating
 * {@link ESSEM.Application} and it can be accesed from `app.canvas`.
 *
 * @memberof ESSEM
 */
declare class Canvas {
    /**
     * The DOM element of the canvas. Add this into your page by doing
     * `document.body.appendChild(canvas)` in order to see yourr graphics.
     */
    element: HTMLCanvasElement;
    /**
     * Whether or not the canvas is fixed and cannot resize to fit window.
     */
    fixedSize: boolean;
    /**
     * The aspect ratio that the canvas will fit to if it resizes.
     */
    aspectRatio: number | null;
    /**
     * The current width of the canvas.
     */
    width: number;
    /**
     * The current height of the canvas.
     */
    height: number;
    private _eventManager;
    private _pressedKeys;
    private _pressedMouseButtons;
    private _mousePosition;
    /**
     * @param {object} [options={}] - Parameters as an object for the Canvas.
     * @param {number} [options.aspectRatio] - Aspect ratio for the canvas to resize to if fixedSize
     *                                         is true. Leave empty for no aspect ratio.
     * @param {boolean} [options.fixedSize=true] - Will resize to fit window if true.
     * @param {number} [options.width=400] - Initial width.
     * @param {number} [options.height=400] - Initial height.
     */
    constructor(options: ICanvasOptions | undefined, eventManager: EventManager);
    /**
     * Resizes the canvas to the specified width and height.
     *
     * @param width - The width to resize to.
     * @param height - The height to resize to.
     * @param {boolean} [sendEvent=true] - Whether or not to send a CanvasResizedEvent.
     */
    resizeCanvas(width: number, height: number, sendEvent?: boolean): void;
    /**
     * Checks if the specified key is held down.
     *
     * @param keyCode - The key code (from window.KeyboardEvent) to check.
     * @return Whether or not the key was held down.
     */
    isKeyPressed(keyCode: string): boolean;
    /**
     * Checks if the specified mouse button is held down.
     *
     * @param button - The mouse button code (from window.MouseEvent) to check.
     * @return Whether or not the mouse button was held down.
     */
    isMousePressed(button: number): boolean;
    /**
     * Gets the current mouse position.
     *
     * @return The current mouse position.
     */
    getMousePosition(): Vector2;
    /**
     * Resizes the canvas to fit the window with accordence to the aspect ratio.
     */
    resizeFull(): void;
}

declare class AudioClip {
    volume: number;
    loop: boolean;
    playing: boolean;
    readonly buffer: AudioBuffer;
    source: AudioBufferSourceNode | null;
    gain: GainNode | null;
    private _context;
    constructor(buffer: AudioBuffer, context: AudioContext);
    static fromURL(url: string, context: AudioContext): Promise<AudioClip>;
    play(): void;
    stop(): void;
    toggle(): void;
}

declare type TextureSource = HTMLImageElement | HTMLCanvasElement;
/**
 * Class that is used to render images.
 *
 * @memberof ESSEM
 */
declare class Texture {
    source: TextureSource;
    glTexture: WebGLTexture | null;
    aspectRatio: number;
    constructor(source: TextureSource);
    /**
     * Inits the texture. This will get automatically called when binding the texture.
     *
     * @param gl - An WebGL2 rendering context for the texture to use.
     */
    init(gl: WebGL2RenderingContext): void;
    /**
     * Binds the texture.
     *
     * @param gl - An WebGL2 rendering context for the texture to use.
     * @param slot - The texture slot for the texture to be binded to (optional).
     */
    bind(gl: WebGL2RenderingContext, slot?: number): void;
    dispose(gl: WebGL2RenderingContext): void;
    static fromURL(url: string): Promise<Texture>;
    static readonly WHITE: Texture;
}

declare type ResourceTypes = Texture | AudioClip;
declare type ResourceTypeNames = "Texture" | "AudioClip";
/**
 * Used for loading resources such as images. It is automatically created when creating
 * {@link ESSEM.Application} and it can be accesed from `app.loader`.
 *
 * @memberof ESSEM
 */
declare class Loader {
    private _audioContext;
    resourceURLs: [ResourceTypeNames, string][];
    resources: {
        [key: string]: ResourceTypes;
    };
    constructor(audioContext: AudioContext);
    add(resourceType: AnyCtor<ResourceTypes> | ResourceTypeNames, url: string): this;
    loadAll(): Promise<void>;
}

/** * Event that is sent whenever the Application initiates.
 *
 * @memberof ESSEM
 */
declare class ApplicationInitEvent extends Event {
}
/**
 * Event that is sent whenever the Application updates.
 *
 * @memberof ESSEM
 */
declare class ApplicationUpdateEvent extends Event {
    /**
     * The delta time of the update.
     */
    delta: number;
    /**
     * @param delta - The delta time of the update.
     */
    constructor(delta: number);
}
interface IApplicationOptions {
    canvasOptions?: ICanvasOptions;
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
declare class Application {
    audioContext: AudioContext;
    canvas: Canvas;
    eventManager: EventManager;
    loader: Loader;
    renderer: Renderer;
    lastFrameTime: number;
    running: boolean;
    private _systemClasses;
    /**
     * @param {object} [options={}] - Optional parameters for Application.
     * @param {object} [options.canvasOptions={}] - Optional parameters for the canvas.
     *        See {@link ESSEM.Canvas}
     */
    constructor(options?: IApplicationOptions);
    /**
     * The update function that gets called every requestAnimationFrame loop.
     *
     * @private
     */
    private _onUpdate;
    /**
     * Registers a parameterized array of system classes.
     * Use like this: `app.registerSystem(System1, System2, ...);`
     * Do all the registering at the start or the system will not work.
     *
     * @param {...SystemClass} systemClasses - An parameterized array of classes that extends
     *        {@link ESSEM.System}
     */
    registerSystem(...systemClasses: SystemClass[]): void;
    /**
     * Creates a new scene.
     *
     * @return A new Scene.
     */
    createScene(): Scene;
}

/**
 * Event that is sent whenever a key is pressed.
 *
 * @memberof ESSEM
 */
declare class KeyPressedEvent extends Event {
    /**
     * The key code (from window.KeyboardEvent) of the event.
     */
    readonly code: string;
    /**
     * If the key was repeated.
     */
    readonly repeated: boolean;
    constructor(code: string, repeated: boolean);
}
/**
 * Event that is sent whenever a key is released.
 *
 * @memberof ESSEM
 */
declare class KeyReleasedEvent extends Event {
    /**
     * The key code (from window.KeyboardEvent) of the event.
     */
    readonly code: string;
    constructor(code: string);
}
/**
 * Event that is sent whenever a key is typed.
 * This uses the actual key that the user types.
 *
 * @memberof ESSEM
 */
declare class KeyTypedEvent extends Event {
    /**
     * The key of the event as in what the user actually typed. Eg: shift + x with be X.
     */
    readonly key: string;
    constructor(key: string);
}
/**
 * Event that is sent whenever a the mouse is pressed.
 *
 * @memberof ESSEM
 */
declare class MousePressedEvent extends Event {
    readonly button: number;
    constructor(button: number);
}
/**
 * Event that is sent whenever a the mouse is released.
 *
 * @memberof ESSEM
 */
declare class MouseReleasedEvent extends Event {
    readonly button: number;
    constructor(button: number);
}
/**
 * Event that is sent whenever a the mouse is moved.
 *
 * @memberof ESSEM
 */
declare class MouseMovedEvent extends Event {
    /**
     * How much the mouse has moved on the x axis.
     */
    readonly offsetX: number;
    /**
     * How much the mouse has moved on the y axis.
     */
    readonly offsetY: number;
    constructor(x: number, y: number);
}
/**
 * Event that is sent whenever a the mouse wheel is scrolled.
 *
 * @memberof ESSEM
 */
declare class MouseScrolledEvent extends Event {
    /**
     * How much the mouse wheel has scrolled on the x axis.
     */
    readonly offsetX: number;
    /**
     * How much the mouse wheel has scrolled on the y axis.
     */
    readonly offsetY: number;
    constructor(x: number, y: number);
}

/**
 * Component to handle camera stuff
 * All render systems will look for a entity tagged 'MainCamera' as the camera to render with.
 *
 * @memberof ESSEM
 */
declare class CameraComponent {
    aspectRatio: number;
    fixedAspectRatio: boolean;
    size: number;
    private _projectionMatrix;
    constructor(zoom?: number, fixedAspectRatio?: boolean);
    setViewportSize(width: number, height: number): void;
    getProjectionMatrix(): Matrix3;
}

/**
 * Component that handles sprite info like textures and colours.
 *
 * @memberof ESSEM
 */
declare class SpriteComponent {
    /**
     * The texture of the sprite in use.
     */
    readonly texture: Texture;
    /**
     * The RGBA colour of the sprite as a 4 length Float32Array.
     */
    rgbaColor: Float32Array;
    private _hexColor;
    /**
     * @param texture - Texture to use. This should be resued between other components.
     * @param color -
     */
    constructor(texture: Texture, color?: number);
    /**
     * Colour of the sprite in hexadecimal.
     */
    set color(hex: number);
    get color(): number;
}

/**
 * Component that holds the position, scale and rotation of an entity.
 *
 * @memberof ESSEM
 */
declare class TransformComponent {
    private _position;
    private _scale;
    private _rotation;
    private _transformMatrix;
    private _transformValid;
    /**
     * @param position - Starting position.
     * @param scale - Starting scale.
     * @param rotation - Starting rotation.
     */
    constructor(position?: Vector2, scale?: Vector2, rotation?: number);
    /**
     * Matrix that holds the transform of the component.
     * This value will be cached and invalidated when making any changes to the component.
     *
     * @readonly
     */
    get transformMatrix(): Matrix3;
    /**
     * Rotation of the component.
     */
    set rotation(rotation: number);
    get rotation(): number;
    /**
     * Position of the component.
     */
    set position(position: Vector2);
    get position(): Vector2;
    /**
     * Scale of the component.
     */
    set scale(scale: Vector2);
    get scale(): Vector2;
    static getGlobalPosition(entity: Entity): Vector2;
    static getGlobalScale(entity: Entity): Vector2;
    static getGlobalRotation(entity: Entity): number;
    /**
     * Gets the global transform matrix relative to all the entity's parents.
     *
     * @param entity - Entity to get the global transform matrix of.
     * @return A global transform matrix.
     */
    static getGlobalTransformMatrix(entity: Entity): Matrix3;
}

/**
 * Register this system when handling cameras.
 *
 * @memberof ESSEM
 */
declare class CameraSystem extends System {
    canvas: Canvas;
    setup(app: Application): void;
    onEntityAdd(entity: Entity): void;
    onResized(event: CanvasResizedEvent): void;
}

declare class Shader {
    vertexSrc: string;
    fragmentSrc: string;
    name: string;
    glProgram: WebGLProgram | null;
    uniformLocationCache: Map<string, WebGLUniformLocation>;
    constructor(vertexSrc: string, fragmentSrc: string, name?: string);
    init(gl: WebGL2RenderingContext): void;
    bind(gl: WebGL2RenderingContext): void;
    dispose(gl: WebGL2RenderingContext): void;
    getUniformLocation(gl: WebGL2RenderingContext, name: string): WebGLUniformLocation;
    setFloat1(gl: WebGL2RenderingContext, name: string, value: number): void;
    setFloat2(gl: WebGL2RenderingContext, name: string, value: Vector2): void;
    setInt1(gl: WebGL2RenderingContext, name: string, value: number): void;
    setIntArray(gl: WebGL2RenderingContext, name: string, value: Int32Array): void;
    setMatrix3(gl: WebGL2RenderingContext, name: string, value: Matrix3): void;
    private _compileGLShader;
}

declare class VertexArray {
    glVertexArray: WebGLVertexArrayObject;
    glIndexBuffer: WebGLBuffer | null;
    glVertexBuffers: WebGLBuffer[];
    constructor(gl: WebGL2RenderingContext);
    bind(gl: WebGL2RenderingContext): void;
    addVertexBuffer(gl: WebGL2RenderingContext, vertices: Float32Array | Float64Array, usage?: number): WebGLBuffer;
    setIndexBuffer(gl: WebGL2RenderingContext, indices: Uint8Array | Uint16Array | Uint32Array): WebGLBuffer;
    dispose(gl: WebGL2RenderingContext): void;
}

declare abstract class AbstractBatchRenderer {
    static readonly vertexSize = 9;
    static readonly maxDraws = 1000;
    static readonly maxVertices: number;
    static readonly maxIndices: number;
    static readonly maxVerticesBytes: number;
    renderer: Renderer;
    vertexArray: VertexArray;
    vertexBuffer: WebGLBuffer;
    textureShader: Shader;
    textureSlots: Texture[];
    textureToSlotMap: Map<Texture, number>;
    vertices: Float32Array;
    indices: Uint16Array;
    verticesIndex: number;
    indicesCount: number;
    textureSlotIndex: number;
    constructor(renderer: Renderer);
    beginScene(viewProjection: Matrix3): void;
    endScene(): void;
    startBatch(): void;
    nextBatch(): void;
    flush(): void;
    getTextureSlot(texture: Texture): number;
}

declare class SpriteRenderer extends AbstractBatchRenderer {
    static vertexPositions: Float32Array;
    static texCoords: Float32Array;
    private _cacheVector;
    drawSprite(entity: Entity): void;
}
/**
 * Register this system to render sprites.
 *
 * @memberof ESSEM
 */
declare class SpriteRendererSystem extends System {
    spriteRenderer: SpriteRenderer;
    setup(app: Application): void;
    onUpdate(): void;
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
declare function approxEquals(a: number, b: number, tolerance?: number): boolean;
/**
 * Constant that converts degrees to radians.
 * Use the essem.js provided functions to convert instead.
 *
 * @memberof ESSEM
 * @type number
 */
declare const DEG_TO_RAD: number;
/**
 * Converts degrees to radians.
 *
 * @memberof ESSEM
 * @param degrees - Degrees to convert.
 * @return Radians.
 */
declare function toRadians(degrees: number): number;
/**
 * Constant that converts radians to degrees.
 * Use the essem.js provided functions to convert instead.
 *
 * @memberof ESSEM
 * @type number
 */
declare const RAD_TO_DEG: number;
/**
 * Converts radians to degrees.
 *
 * @memberof ESSEM
 * @param radians - Radians to convert.
 * @return Degrees.
 */
declare function toDegrees(radians: number): number;
/**
 * Constant that is equal to PI * 2.
 *
 * @memberof ESSEM
 */
declare const TWO_PI: number;

/**
 * Checks to see if WebGL2 is supported in the browser.
 *
 * @memberof ESSEM
 * @return Whether or not WebGL2 is supported.
 */
declare function isWebGL2Supported(): boolean;
/**
 * Says hello in essem.js style. Gets called once when the application finishes initiating.
 *
 * @memberof ESSEM
 */
declare function sayHello(): void;
/**
 * Skips the essem.js hello message.
 *
 * @memberof ESSEM
 */
declare function skipHello(): void;

/**
 * Converts hexadecimal number to a rbga array.
 *
 * @memberof ESSEM
 * @param hex - Hexadecimal number. Alpha channel is default to 1.
 * @return RGBA array with values from 0 to 1.
 */
declare function hexToRGBA(hex: number): Float32Array;

/**
 * Error class that is used for {@link ESSEM.assert}.
 *
 * @memberof ESSEM
 */
declare class AssertionError extends Error {
    constructor(message?: string);
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
declare function assert(condition: boolean, message?: string): asserts condition;
/**
 * Gets an item from the map using a key and sets it with a new instance of the class of it
 * doesn't  exist.
 *
 * @param map - The map to use.
 * @param key - The key of the item.
 * @param defaultClass - The class to create a new instance from.
 * @return The value that was retrieved.
 */
declare function mapGet<K, V>(map: Map<K, V>, key: K, defaultClass: AnyCtor<V>): V;
/**
 * Removes an item from an array by swapping the last element with the removing element and popping
 * the array.
 *
 * @param array - The array to use.
 * @param index - The index to remove.
 * @return The last item of the array that was swapped to the index.
 */
declare function lastItemSwapRemove<T>(array: T[], index: number): T;
declare function getTypeName<T>(type: AnyCtor<T> | string): string;

/**
 * @namespace ESSEM
 */

/**
 * The version of the essem.js library being used.
 *
 * @memberof ESSEM
 * @type string
 */
declare const VERSION: string;

export { AbstractBatchRenderer, AnyCtor, Application, ApplicationInitEvent, ApplicationUpdateEvent, ArrayCtor, AssertionError, AudioClip, CameraComponent, CameraSystem, Canvas, CanvasResizedEvent, Component, ComponentClass, DEG_TO_RAD, Entity, Event, EventListenerFunc, EventManager, IApplicationOptions, ICanvasOptions, KeyPressedEvent, KeyReleasedEvent, KeyTypedEvent, Loader, Matrix3, MouseMovedEvent, MousePressedEvent, MouseReleasedEvent, MouseScrolledEvent, RAD_TO_DEG, Renderer, Scene, Shader, SpriteComponent, SpriteRenderer, SpriteRendererSystem, System, SystemClass, TWO_PI, Texture, TextureSource, TransformComponent, VERSION, Vector2, VertexArray, approxEquals, assert, getTypeName, hexToRGBA, isWebGL2Supported, lastItemSwapRemove, mapGet, sayHello, skipHello, toDegrees, toRadians };
