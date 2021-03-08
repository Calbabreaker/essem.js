import { Component, Manager } from "../ecs/manager";
import { Scene } from "../ecs/scene";
import { System } from "../ecs/system";
import { AnyCtor } from "../utils/types";

export class Application {
    private _manager: Manager;

    lastFrameTime: number = 0;
    running: boolean = true;

    constructor() {
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

    private _onUpdate() {
        const now = performance.now();
        const delta = now - this.lastFrameTime;

        this._manager.runSystems(delta);

        this.lastFrameTime = now;
    }

    shutdown() {
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
