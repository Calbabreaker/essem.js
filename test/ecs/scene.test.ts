import { Entity } from "src/ecs/entity";
import { Scene } from "src/ecs/scene";

describe("ESSEM.Scene", () => {
    test("should generate Scene", () => {
        const scene = new Scene();

        expect(scene.systems.length).toBe(0);
        expect(scene.children.size).toBe(0);
        expect(scene.entityPool.objectClass).toBe(Entity);
    });

    test("createEntity()", () => {
        const scene = new Scene();

        const entityDefaults = scene.createEntity();
        expect(entityDefaults.name).toBe(`Unnamed Entity ${entityDefaults.id}`);
        expect(entityDefaults.parent).toBe(scene);

        const parentEntity = scene.createEntity("parent");
        const entityNoDefault = scene.createEntity("Hello", parentEntity);
        expect(entityNoDefault.name).toBe("Hello");
        expect(entityNoDefault.parent).toBe(parentEntity);
    });
});
