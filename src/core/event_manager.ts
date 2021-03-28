import { mapGet } from "../utils/misc";
import { AnyCtor } from "../utils/types";

/**
 * Event base class that all events must extend from.
 *
 * @memberof ESSEM
 */
export abstract class Event {
    /**
     * Whether or not the event has been handled. Set this to true to make it handled and stopped
     * being sent to all other event listeners.
     */
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
