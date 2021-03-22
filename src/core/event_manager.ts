import { mapGet } from "../utils/misc";
import { AnyCtor } from "../utils/types";

export abstract class Event {
    handled = false;
}

export class EventManager {
    eventListenersMap: Map<string, Function[]> = new Map();

    addListener<T extends Event>(eventType: AnyCtor<T> | string, listenerFunc: (event: T) => void) {
        const eventName = (eventType as AnyCtor<T>).name ?? eventType;
        const listeners = mapGet(this.eventListenersMap, eventName, Array) as Function[];
        listeners.push(listenerFunc);
    }

    sendEvent(event: Event) {
        const eventName = event.constructor.name;
        const listeners = mapGet(this.eventListenersMap, eventName, Array) as Function[];
        for (let i = 0; i < listeners.length; i++) {
            if (event.handled) break;
            listeners[i](event);
        }
    }
}
