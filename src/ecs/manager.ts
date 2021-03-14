import { Entity } from "./entity";
import { System } from "./system";

// basically any object
// eslint-disable-next-line @typescript-eslint/ban-types
export type Component = Object;

export class Manager {
    signitureToSystemMap: Map<string, System> = new Map();
    systems: System[] = [];

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

    notifySystemsEntityChange(entity: Entity, from: string, to: string): void {
        const systemMap = this.signitureToSystemMap;

        if (from) {
            const systemFrom = systemMap.get(from);
            if (systemFrom) systemFrom.entities.delete(entity);
        }

        if (to) {
            const systemTo = systemMap.get(to);
            if (systemTo) systemTo.entities.add(entity);
        }
    }
}
