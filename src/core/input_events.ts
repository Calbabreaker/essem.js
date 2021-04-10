import { Event } from "./event_manager";

/**
 * Event that is sent whenever a key is pressed.
 *
 * @memberof ESSEM
 */
export class KeyPressedEvent extends Event {
    /**
     * The key code (from window.KeyboardEvent) of the event.
     */
    readonly code: string;

    /**
     * If the key was repeated.
     */
    readonly repeated: boolean;

    constructor(code: string, repeated: boolean) {
        super();
        this.code = code;
        this.repeated = repeated;
    }
}

/**
 * Event that is sent whenever a key is released.
 *
 * @memberof ESSEM
 */
export class KeyReleasedEvent extends Event {
    /**
     * The key code (from window.KeyboardEvent) of the event.
     */
    readonly code: string;

    constructor(code: string) {
        super();
        this.code = code;
    }
}

/**
 * Event that is sent whenever a key is typed.
 * This uses the actual key that the user types.
 *
 * @memberof ESSEM
 */
export class KeyTypedEvent extends Event {
    /**
     * The key of the event as in what the user actually typed. Eg: shift + x with be X.
     */
    readonly key: string;

    constructor(key: string) {
        super();
        this.key = key;
    }
}

/**
 * Event that is sent whenever a the mouse is pressed.
 *
 * @memberof ESSEM
 */
export class MousePressedEvent extends Event {
    /*
     * Which mouse button code (from window.MouseEvent) was used to click.
     */
    readonly button: number;

    constructor(button: number) {
        super();
        this.button = button;
    }
}

/**
 * Event that is sent whenever a the mouse is released.
 *
 * @memberof ESSEM
 */
export class MouseReleasedEvent extends Event {
    /*
     * Which mouse button code (from window.MouseEvent) was released.
     */
    readonly button: number;

    constructor(button: number) {
        super();
        this.button = button;
    }
}

/**
 * Event that is sent whenever a the mouse is moved.
 *
 * @memberof ESSEM
 */
export class MouseMovedEvent extends Event {
    /**
     * How much the mouse has moved on the x axis.
     */
    readonly offsetX: number;

    /**
     * How much the mouse has moved on the y axis.
     */
    readonly offsetY: number;

    constructor(x: number, y: number) {
        super();
        this.offsetX = x;
        this.offsetY = y;
    }
}

/**
 * Event that is sent whenever a the mouse wheel is scrolled.
 *
 * @memberof ESSEM
 */
export class MouseScrolledEvent extends Event {
    /**
     * How much the mouse wheel has scrolled on the x axis.
     */
    readonly offsetX: number;

    /**
     * How much the mouse wheel has scrolled on the y axis.
     */
    readonly offsetY: number;

    constructor(x: number, y: number) {
        super();
        this.offsetX = x;
        this.offsetY = y;
    }
}
