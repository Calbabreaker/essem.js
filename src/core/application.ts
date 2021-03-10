import { Component, Manager } from "../ecs/manager";
import { Scene } from "../ecs/scene";
import { System } from "../ecs/system";
import { AnyCtor } from "../utils/types";
import { Canvas } from "./canvas";

export class Application {
    private _manager: Manager;
    canvas: Canvas;

    lastFrameTime = 0;
    running = true;

    constructor() {
        this._manager = new Manager();
        this.canvas = new Canvas();

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
        const gl = this.canvas.renderer.gl;
        gl.clearColor(1, 0, 1, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        this.lastFrameTime = now;
    }

    shutdown(): void {
        this.running = false;
    }

    registerComponent<T extends Component>(componentClass: AnyCtor<T>): Application {
        this._manager.registerComponent(componentClass);
        return this;
    }

    registerSystem<T extends System>(systemClass: { new (manager: Manager): T }): Application {
        this._manager.registerSystem(systemClass);
        return this;
    }

    createScene(): Scene {
        const scene = new Scene(this._manager);
        return scene;
    }
}
