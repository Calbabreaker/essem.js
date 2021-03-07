import { Manager } from "../ecs/manager";
import { Scene } from "../ecs/scene";
import { AnyCtor } from "../utils/types";

export class Application {
    private _manager: Manager;

    constructor() {
        this._manager = new Manager();
    }

    registerComponent<T extends Object>(component: AnyCtor<T>) {
        this._manager.registerComponent(component);
    }

    createScene(): Scene {
        const scene = new Scene(this._manager);
        return scene;
    }
}
