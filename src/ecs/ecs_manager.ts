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
            if (entity.hasAllComponents(system.typeNames)) {
                system.entities.add(entity);
                if (system.onEntityAdd !== undefined) {
                    system.onEntityAdd(entity);
                }
            }
        });
    }

    entityComponentRemove(entity: Entity, typeName: string): void {
        const systems = mapGet(this.typeNameToSystem, typeName, Array) as System[];
        systems.forEach((system) => {
            system.entities.delete(entity);
        });
    }
}
