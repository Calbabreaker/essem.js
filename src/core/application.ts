import { Renderer } from "../renderer/renderer";
import { ECSManager } from "../ecs/ecs_manager";
import { Scene } from "../ecs/scene";
import { System } from "../ecs/system";
import { Canvas, CanvasResizedEvent, ICanvasOptions } from "./canvas";
import { Event, EventManager } from "./event_manager";
import { Loader } from "./loader";
import { sayHello } from "../utils/browser";

export class ApplicationInitEvent extends Event {}

export class ApplicationUpdateEvent extends Event {
    delta: number;
    constructor(delta: number) {
        super();
        this.delta = delta;
    }
}
export interface IApplicationOptions {
    canvasOptions?: ICanvasOptions;
}

export class Application {
    private _ecsManager: ECSManager;
    events: EventManager;
    canvas: Canvas;
    renderer: Renderer;
    loader: Loader;

    lastFrameTime = 0;
    running = true;

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

    private _onUpdate() {
        const now = performance.now();
        const delta = now - this.lastFrameTime;

        const gl = this.renderer.gl;
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        this.events.sendEvent(new ApplicationUpdateEvent(delta));

        this.lastFrameTime = now;
    }

    shutdown(): void {
        this.running = false;
    }

    registerSystem(...systemClasses: { new (manager: ECSManager): System }[]): this {
        for (const systemClass of systemClasses) {
            const system = this._ecsManager.registerSystem(systemClass);
            system.setup(this);
        }

        return this;
    }

    createScene(): Scene {
        const scene = new Scene(this._ecsManager);
        return scene;
    }
}
