import { Scene } from "src/ecs/scene";
import { System } from "src/ecs/system";
import { TransformComponent } from "src/ecs/components/transform_component";
import { Entity } from "src";

class HelloSystem extends System {
    setup() {
        this.setComponents([TransformComponent]);
    }
}

describe("ESSEM.System", () => {
    test("should generate System", () => {
        const scene = new Scene();
        const system = new HelloSystem(scene);

        expect(system.entities.length).toBe(0);
        expect(system.typeNames.length).toBe(0);
    });

    test("setup()", () => {
        const scene = new Scene();
        const system = new HelloSystem(scene);
        system.setup();

        expect(system.typeNames[0]).toBe("TransformComponent");
        expect(scene["_typeNameToSystem"].get("TransformComponent")?.[0]).toBe(system);
    });

    test("onEntityAdd()", () => {
        class TestSystem extends System {
            setup() {
                this.setComponents([TransformComponent]);
            }

            onEntityAdd(entity: Entity) {
                expect(entity.hasComponent(TransformComponent)).toBe(true);
            }
        }

        const scene = new Scene();
        const system = new TestSystem(scene);
        system.setup();

        const entity1 = scene.createEntity();
        entity1.addComponent(new TransformComponent());
    });

    test("should have entity if create entity with component", () => {
        const scene = new Scene();
        const system = new HelloSystem(scene);
        system.setup();

        const entity1 = scene.createEntity();
        entity1.addComponent(new TransformComponent());
        const entity2 = scene.createEntity();
        entity2.addComponent(new TransformComponent());

        expect(system.entities[0]).toBe(entity1);
        expect(system.entities[1]).toBe(entity2);
    });
});
