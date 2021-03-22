import { Renderer } from "../renderer/renderer";
import { ECSManager } from "../ecs/ecs_manager";
import { Scene } from "../ecs/scene";
import { System } from "../ecs/system";
import { Canvas } from "./canvas";
import { Event, EventManager } from "./event_manager";

export class ApplicationInitEvent extends Event {}

export class ApplicationUpdateEvent extends Event {
    delta: number;
    constructor(delta: number) {
        super();
        this.delta = delta;
    }
}

export class Application {
    private _ecsManager: ECSManager;
    events: EventManager;
    canvas: Canvas;
    renderer: Renderer;

    lastFrameTime = 0;
    running = true;

    constructor() {
        this._ecsManager = new ECSManager();
        this.events = new EventManager();
        this.canvas = new Canvas();
        this.renderer = new Renderer(this.canvas.element);

        window.addEventListener("load", () => {
            this._ecsManager.systems.forEach((system) => system.init(this));
            this.events.sendEvent(new ApplicationInitEvent());

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
            this._ecsManager.registerSystem(systemClass);
        }

        return this;
    }

    createScene(): Scene {
        const scene = new Scene(this._ecsManager);
        return scene;
    }
}
