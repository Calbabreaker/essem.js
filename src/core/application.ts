import { Manager } from "src/ecs/manager";
import { Scene } from "src/ecs/scene";

export class Application {
    private _manager: Manager;

    constructor() {
        this._manager = new Manager();
    }

    createScene(): Scene {
        const scene = new Scene(this._manager);
        return scene;
    }

    test(): void {
        console.log("Testing");

        class Transform2D {
            x: number;
            y: number;
            name = "hello";
        }

        function addComponent<T>(
            Component: { new (): T },
            objVals: Pick<Partial<T>, keyof T> = {} as Pick<Partial<T>, keyof T>
        ): T {
            const component = new Component();
            Object.keys(component).forEach((key) => {
                (component as any)[key] = (objVals as any)[key];
            });

            return component;
        }

        addComponent(Transform2D, { x: 123, y: 12 });
    }
}
