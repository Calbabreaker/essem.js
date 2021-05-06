import { mapGet } from "src/utils/misc";
import { AnyCtor } from "src/utils/types";

/**
 * Event base class that all events must extend from.
 *
 * @memberof ESSEM
 */
export abstract class Event {
    /**
     * Whether or not the event has been handled. Set this to true to make it stopped
     * being sent to all other event listeners.
     */
    handled = false;
}

export type EventListenerFunc<T extends Event = Event> = (event: T) => void;

/**
 * Used to add listeners and send events.
 * It is automatically created when creating {@link ESSEM.Application} and it can be accesed from
 * `app.events`.
 *
 * @memberof ESSEM
 */
export class EventManager {
    eventListenersMap: Map<string, EventListenerFunc[]> = new Map();

    /**
     * Adds a function to act as a listener to listen and receive the specified event.
     *
     * @param eventType - The event class or name for the listener to listen to.
     * @param listenerFunc - The function that will receive the events.
     */
    addListener<T extends Event>(
        eventType: AnyCtor<T> | string,
        listenerFunc: EventListenerFunc<T>
    ): void {
        const eventName = (eventType as AnyCtor<T>).name ?? eventType;
        const listeners = mapGet(this.eventListenersMap, eventName, Array) as EventListenerFunc[];
        listeners.push(listenerFunc as EventListenerFunc<Event>);
    }

    /**
     * Send a event for all event's listeners to get.
     *
     * @param event - An instance of the event to send. Same named classes will be considered as
     *      the same event.
     */
    sendEvent(event: Event): void {
        const eventName = event.constructor.name;
        const listeners = mapGet(this.eventListenersMap, eventName, Array) as EventListenerFunc[];
        for (let i = 0; i < listeners.length; i++) {
            if (event.handled) break;
            listeners[i](event);
        }
    }
}
