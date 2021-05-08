// will test the browser bundle
// make sure all bundles are built before running

function testBundle(description: string, file: string, testFunc: () => void): void {
    describe(description, () => {
        const script = document.createElement("script");

        beforeAll((done) => {
            script.onload = () => done();
            script.src = require.resolve(file);
            document.head.appendChild(script);
        });

        testFunc();

        test("ESSEM should exist as a global object", () => {
            expect(window.ESSEM).toBeInstanceOf(Object);
            expect(window.__ESSEM__).toBe(true);
            expect(typeof window.ESSEM.VERSION).toBe("string");
            document.head.removeChild(script);
            window.__ESSEM__ = false;
            window.ESSEM = {};
        });
    });
}

describe("Bundle browser", () => {
    testBundle("Unminified", "../build/essem.js", () => {
        test("should run starter example with no errors", (done) => {
            const ESSEM = window.ESSEM;
            const app = new ESSEM.Application();

            const texturePath = require.resolve("../examples/assets/fish.png");
            app.registerSystem(ESSEM.CameraSystem, ESSEM.SpriteRendererSystem);
            app.loader.add(ESSEM.Texture, texturePath);

            document.body.appendChild(app.canvas.element);

            app.eventManager.addListener(ESSEM.ApplicationInitEvent, () => {
                const scene = app.createScene();
                const entity = scene.createEntity();
                entity.addComponent(new ESSEM.TransformComponent());
                entity.addComponent(new ESSEM.SpriteComponent(app.loader.get(texturePath)));

                const camera = scene.createEntity();
                camera.addComponent(new ESSEM.TransformComponent());
                camera.addComponent(new ESSEM.CameraComponent());
                camera.addTag("MainCamera");
            });

            let ticks = 0;
            app.eventManager.addListener(ESSEM.ApplicationUpdateEvent, () => {
                ticks++;
                if (ticks >= 100) done();
            });
        });
    });

    testBundle("Minified", "../build/essem.min.js", () => {
        test("assertions should be disabled", () => {
            const scene = new window.ESSEM.Scene();
            const entity = scene.createEntity();
            expect(() => entity.getComponent("SLDFJ:LSDKFJ")).not.toThrow();
            expect(() => entity.removeComponent("SLDFJ:LSDKFJ")).not.toThrow();
        });
    });
});
