import { MousePressedEvent } from "src/core/input_events";
import { EventManager, Event } from "src/core/event_manager";

describe("ESSEM.EventManager", () => {
    test("should generate EventManager", () => {
        const eventManager = new EventManager();

        expect(eventManager.eventListenersMap.size).toBe(0);
        expect(eventManager.eventListenersMap.get("AKSJDSAJD")).toBeUndefined();
    });

    test("should handle custom event", () => {
        const eventManager = new EventManager();

        class HelloEvent extends Event {
            msg: string;

            constructor(msg: string) {
                super();
                this.msg = msg;
            }
        }

        const msg = "yes";

        eventManager.addListener(HelloEvent, (event) => {
            expect(event).toBeInstanceOf(HelloEvent);
            expect(event.msg).toBe(msg);
            expect(event.handled).toBe(false);
        });

        eventManager.sendEvent(new HelloEvent(msg));
        eventManager.sendEvent(new HelloEvent(msg));
    });

    test("should stop being sent if handled is true", () => {
        const eventManager = new EventManager();

        eventManager.addListener(MousePressedEvent, (event) => {
            expect(event.handled).toBe(false);
            event.handled = true;
        });

        const secondListenerFunc = jest.fn();
        eventManager.addListener(MousePressedEvent, secondListenerFunc);
        eventManager.sendEvent(new MousePressedEvent(123));

        expect(secondListenerFunc).not.toHaveBeenCalled();
    });
});
