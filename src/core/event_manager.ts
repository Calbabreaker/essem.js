import { mapGet } from "../utils/misc";
import { AnyCtor } from "../utils/types";

export abstract class Event {
    handled = false;
}

export type EventListenerFunc<T extends Event = Event> = (event: T) => void;

export class EventManager {
    eventListenersMap: Map<string, EventListenerFunc[]> = new Map();

    addListener<T extends Event>(
        eventType: AnyCtor<T> | string,
        listenerFunc: EventListenerFunc<T>
    ): void {
        const eventName = (eventType as AnyCtor<T>).name ?? eventType;
        const listeners = mapGet(this.eventListenersMap, eventName, Array) as EventListenerFunc[];
        listeners.push(listenerFunc as EventListenerFunc<Event>);
    }

    sendEvent(event: Event): void {
        const eventName = event.constructor.name;
        const listeners = mapGet(this.eventListenersMap, eventName, Array) as EventListenerFunc[];
        for (let i = 0; i < listeners.length; i++) {
            if (event.handled) break;
            listeners[i](event);
        }
    }
}
