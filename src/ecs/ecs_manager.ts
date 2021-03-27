import { mapGet } from "../utils/misc";
import { Entity } from "./entity";
import { System } from "./system";

// basically any object
// eslint-disable-next-line @typescript-eslint/ban-types
export type Component = Object;

export class ECSManager {
    systems: System[] = [];
    typeNameToSystem: Map<string, System[]> = new Map();

    registerSystem<T extends System>(systemClass: { new (manager: ECSManager): T }): System {
        const system = new systemClass(this);
        this.systems.push(system);
        return system;
    }

    entityComponentAdd(entity: Entity, typeName: string): void {
        const systems = mapGet(this.typeNameToSystem, typeName, Array) as System[];
        systems.forEach((system) => {
            if (entity._systemIndexMap.has(system.constructor.name)) return;

            if (entity.hasAllComponents(system.typeNames)) {
                system.entities.push(entity);
                if (system.onEntityAdd !== undefined) {
                    system.onEntityAdd(entity);
                }
            }
        });
    }

    entityComponentRemove(entity: Entity, typeName: string): void {
        const systems = mapGet(this.typeNameToSystem, typeName, Array) as System[];
        systems.forEach((system) => {
            const entityIndex = entity._systemIndexMap.get(system.constructor.name) as number;

            // swap last element to avoid moving entities around
            const lastEntity = system.entities[system.entities.length - 1];
            system.entities[entityIndex] = lastEntity;
            lastEntity._systemIndexMap.set(system.constructor.name, entityIndex);

            system.entities.pop();
        });
    }
}