import { Manager } from "src/ecs/manager";

export class Application {
    // @ts-ignore:
    private _manager: Manager;

    constructor() {
        this._manager = new Manager();
    }

    test(): void {
        console.log("Testing");

        class Transform2D {
            x: number;
            y: number;
            name: string = "hello";
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
