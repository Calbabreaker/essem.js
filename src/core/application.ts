import { Renderer } from "../renderer/renderer";
import { Manager } from "../ecs/manager";
import { Scene } from "../ecs/scene";
import { System } from "../ecs/system";
import { Canvas } from "./canvas";

export class Application {
    private _manager: Manager;
    canvas: Canvas;
    renderer: Renderer;

    lastFrameTime = 0;
    running = true;

    constructor() {
        this._manager = new Manager();
        this.canvas = new Canvas();
        this.renderer = new Renderer(this.canvas.element);

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

    private _onUpdate() {
        const now = performance.now();
        const delta = now - this.lastFrameTime;

        this._manager.runSystems(delta);
        const gl = this.renderer.gl;
        gl.clearColor(1, 0, 1, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        this.lastFrameTime = now;
    }

    shutdown(): void {
        this.running = false;
    }

    registerSystem(...systemClasses: { new (manager: Manager): System }[]): this {
        for (const systemClass of systemClasses) {
            this._manager.registerSystem(systemClass);
        }

        return this;
    }

    createScene(): Scene {
        const scene = new Scene(this._manager);
        return scene;
    }
}
