import { assert } from "..";
import { AnyCtor } from "../utils/types";
import { Entity } from "./entity";
import { System } from "./system";

// basically any object
// eslint-disable-next-line @typescript-eslint/ban-types
export type Component = Object;

export class Manager {
    systems: System[] = [];
    typeNameToSystem: Map<string, System[]> = new Map();

    registerComponent(componentClass: AnyCtor<Component>): void {
        const typeName = componentClass.name;
        assert(
            !this.typeNameToSystem.has(typeName),
            `Component '${typeName}' is already registered!`
        );
        this.typeNameToSystem.set(typeName, []);
    }

    registerSystem<T extends System>(systemClass: { new (manager: Manager): T }): void {
        const system = new systemClass(this);
        system.onInit();
        this.systems.push(system);
    }

    runSystems(delta: number): void {
        for (const system of this.systems) {
            system.onUpdate(delta);
        }
    }

    entityComponentAdd(entity: Entity, typeName: string): void {
        const systems = this.typeNameToSystem.get(typeName);
        assert(systems !== undefined, `Component ${typeName} has not registered!`);
        for (const system of systems) {
            if (entity.hasAllComponents(system.typeNames)) {
                system.entities.add(entity);
            }
        }
    }

    entityComponentRemove(entity: Entity, typeName: string): void {
        const systems = this.typeNameToSystem.get(typeName);
        assert(systems !== undefined, `Component ${typeName} has not registered!`);
        for (const system of systems) {
            system.entities.delete(entity);
        }
    }
}
