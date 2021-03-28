import { Renderer } from "../renderer/renderer";
import { ECSManager } from "../ecs/ecs_manager";
import { Scene } from "../ecs/scene";
import { System } from "../ecs/system";
import { Canvas, CanvasResizedEvent, ICanvasOptions } from "./canvas";
import { Event, EventManager } from "./event_manager";
import { Loader } from "./loader";
import { sayHello } from "../utils/browser";

/**
 * Event that is sent whenever the Application initiates.
 *
 * @memberof ESSEM
 */
export class ApplicationInitEvent extends Event {}

/**
 * Event that is sent whenever the Application updates.
 *
 * @memberof ESSEM
 */
export class ApplicationUpdateEvent extends Event {
    /**
     * The delta time of the update.
     */
    delta: number;

    /**
     * @param delta - The delta time of the update.
     */
    constructor(delta: number) {
        super();
        this.delta = delta;
    }
}

export interface IApplicationOptions {
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
export class Application {
    private _ecsManager: ECSManager;
    events: EventManager;
    canvas: Canvas;
    renderer: Renderer;
    loader: Loader;

    lastFrameTime = 0;
    running = true;

    /**
     * @param {object} [options={}] - Optional parameters for Application.
     * @param {object} [options.canvasOptions={}] - Optional parameters for the canvas. See {@link ESSEM.Canvas}
     */
    constructor(options: IApplicationOptions = {}) {
        this._ecsManager = new ECSManager();
        this.events = new EventManager();
        this.canvas = new Canvas(options.canvasOptions, this.events);
        this.renderer = new Renderer(this.canvas.element);
        this.loader = new Loader();

        window.addEventListener("load", async () => {
            await this.loader.loadAll();
            this.events.sendEvent(new ApplicationInitEvent());

            this.events.addListener(CanvasResizedEvent, (event: CanvasResizedEvent) => {
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
        });
    }
    /**
     * The update function that gets called every requestAnimationFrame loop.
     *
     * @private
     */
    private _onUpdate(): void {
        const now = performance.now();
        const delta = now - this.lastFrameTime;

        const gl = this.renderer.gl;
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        this.events.sendEvent(new ApplicationUpdateEvent(delta));

        this.lastFrameTime = now;
    }

    /**
     * Stops the Application. The canvas is not removed from the DOM so you need to remove it.
     */
    shutdown(): void {
        this.running = false;
    }

    /**
     * Registers a parameterized array of system classes.
     * Use like this: `app.registerSystem(System1, System2, ...);`
     *
     * @param {SystemClass[]} systemClasses - An parameterized array of classes that extends {@link ESSEM.System}
     * @return {Application} This Application. Good for chaining calls.
     */
    registerSystem(...systemClasses: { new (manager: ECSManager): System }[]): this {
        for (const systemClass of systemClasses) {
            const system = this._ecsManager.registerSystem(systemClass);
            system.setup(this);
        }

        return this;
    }

    /**
     * Creates a new scene.
     *
     * @return A new Scene.
     */
    createScene(): Scene {
        const scene = new Scene(this._ecsManager);
        return scene;
    }
}
