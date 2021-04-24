import { Scene } from "src/ecs/scene";
import { Entity } from "src/ecs/entity";

class ComponentThing {
    hello: boolean;

    constructor(hello: boolean) {
        this.hello = hello;
    }
}

class ValueComponent {
    value: number;
    name: string;

    constructor(value: number, name: string) {
        this.value = value;
        this.name = name;
    }
}

describe("ESSEM.Entity", () => {
    const scene = new Scene();

    test("should generate Entity()", () => {
        const entity = new Entity(scene);

        expect(entity.active).toBe(false);
        expect(entity.name).toBe("");
        expect(entity.parent).toBe(null);
        expect(entity.activeSelf).toBe(false);
        expect(entity.destroyed).toBe(true);
        expect(entity.children.size).toBe(0);
        expect(entity._tagIndexMap.size).toBe(0);
        expect(entity._systemIndexMap.size).toBe(0);
        expect(entity["_componentMap"].size).toBe(0);
    });

    test("addComponent()", () => {
        const entity = new Entity(scene);

        const thing = new ComponentThing(true);
        const value = new ValueComponent(123, "asdf");

        entity.addComponent(thing);
        entity.addComponent(value);

        expect(entity["_componentMap"].size).toBe(2);
        expect(entity["_componentMap"].get("ComponentThing")).toBe(thing);
        expect(entity["_componentMap"].get("ValueComponent")).toBe(value);
    });

    test("removeComponent()", () => {
        const entity = new Entity(scene);

        const thing = new ComponentThing(true);
        const value = new ValueComponent(123, "asdf");

        entity.addComponent(thing);
        entity.addComponent(value);
        entity.removeComponent(ComponentThing);
        entity.removeComponent(ValueComponent);

        expect(entity["_componentMap"].size).toBe(0);
    });

    test("getComponent()", () => {
        const entity = new Entity(scene);

        const thing = new ComponentThing(true);
        const value = new ValueComponent(123, "asdf");

        entity.addComponent(thing);
        entity.addComponent(value);
        expect(entity.getComponent(ValueComponent)).toBe(value);
        expect(entity.getComponent(ComponentThing)).toBe(thing);
    });

    test("hasComponent()", () => {
        const entity = new Entity(scene);

        const thing = new ComponentThing(true);
        const value = new ValueComponent(123, "asdf");

        entity.addComponent(thing);
        entity.addComponent(value);
        expect(entity.hasComponent(ValueComponent)).toBe(true);
        expect(entity.hasComponent("ComponentThing")).toBe(true);
        expect(entity.hasComponent(Entity)).toBe(false);
        expect(entity.hasComponent("asdf")).toBe(false);
    });

    test("hasAllComponents()", () => {
        const entity = new Entity(scene);

        const thing = new ComponentThing(true);
        const value = new ValueComponent(123, "asdf");

        entity.addComponent(thing);
        entity.addComponent(value);
        expect(entity.hasAllComponents([ComponentThing, "ValueComponent"])).toBe(true);
        expect(entity.hasAllComponents([ComponentThing])).toBe(true);
        expect(entity.hasAllComponents(["asdf", ComponentThing])).toBe(false);
        expect(entity.hasAllComponents(["asdf", Entity])).toBe(false);
    });
});
