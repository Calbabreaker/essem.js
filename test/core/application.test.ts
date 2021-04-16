import { EventManager } from "src/core/event_manager";
import { Application, ApplicationInitEvent, ApplicationUpdateEvent } from "src/core/application";
import { Canvas } from "src/core/canvas";
import { skipHello } from "src/utils/browser";
import { Loader } from "src/core/loader";
import { Renderer } from "src/renderer/renderer";
import { System } from "src/ecs/system";
import { Scene } from "src/ecs/scene";

skipHello();

describe("ESSEM.Application", () => {
    test("should generate Application", () => {
        const app = new Application();

        expect(app.audioContext).toBeInstanceOf(AudioContext);
        expect(app.canvas).toBeInstanceOf(Canvas);
        expect(app.eventManager).toBeInstanceOf(EventManager);
        expect(app.loader).toBeInstanceOf(Loader);
        expect(app.renderer).toBeInstanceOf(Renderer);
        expect(app.running).toBe(true);
    });

    test("should send ApplicationInitEvent", (done) => {
        const app = new Application();
        app.eventManager.addListener(ApplicationInitEvent, () => {
            done();
        });
    });

    test("should send ApplicationUpdateEvent every frame", (done) => {
        window.requestAnimationFrame = (func) => setTimeout(func, 16);
        const app = new Application();

        app.eventManager.addListener(ApplicationUpdateEvent, (event) => {
            expect(typeof event.delta).toBe("number");
            done();
        });
    });

    test("should register system and system be in scene", () => {
        const app = new Application();

        class TestSystem extends System {
            setup() {
                // do nothing
            }
        }

        app.registerSystem(TestSystem);
        expect(app["_systemClasses"][0]).toBe(TestSystem);

        const scene = app.createScene();
        expect(scene.systems[0]).toBeInstanceOf(TestSystem);
    });

    test("should create scene with no systems", () => {
        const app = new Application();
        const scene = app.createScene();

        expect(scene).toBeInstanceOf(Scene);
        expect(scene.systems.length).toBe(0);
    });
});
