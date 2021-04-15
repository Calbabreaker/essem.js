import { Vector2 } from "src/math/vector2";
import { Event, EventManager } from "./event_manager";
import {
    KeyPressedEvent,
    KeyReleasedEvent,
    KeyTypedEvent,
    MouseMovedEvent,
    MousePressedEvent,
    MouseReleasedEvent,
    MouseScrolledEvent,
} from "./input_events";

/**
 * Event that gets sent whenever the canvas resizes.
 * This won't get called if just the window does though.
 *
 * @memberof ESSEM
 */
export class CanvasResizedEvent extends Event {
    /**
     * The current width of the canvas.
     */
    readonly width: number;

    /**
     * The current height of the canvas.
     */
    readonly height: number;

    constructor(width: number, height: number) {
        super();
        this.width = width;
        this.height = height;
    }
}

export interface ICanvasOptions {
    fixedSize?: boolean;
    width?: number;
    height?: number;
    aspectRatio?: number;
}

/**
 * Used for the canvas element and input events. It is automatically created when creating
 * {@link ESSEM.Application} and it can be accesed from `app.canvas`.
 *
 * @memberof ESSEM
 */
export class Canvas {
    /**
     * The DOM element of the canvas. Add this into your page by doing
     * `document.body.appendChild(canvas)` in order to see yourr graphics.
     */
    element: HTMLCanvasElement;

    /**
     * Whether or not the canvas is fixed and cannot resize to fit window.
     */
    fixedSize: boolean;

    /**
     * The aspect ratio that the canvas will fit to if it resizes.
     */
    aspectRatio: number | null;

    /**
     * The current width of the canvas.
     */
    width!: number;

    /**
     * The current height of the canvas.
     */
    height!: number;

    private _eventManager: EventManager;
    private _pressedKeys: Map<string, boolean> = new Map();
    private _pressedMouseButtons: Map<number, boolean> = new Map();
    private _mousePosition: Vector2 = new Vector2();

    /**
     * @param {object} [options={}] - Parameters as an object for the Canvas.
     * @param {number} [options.aspectRatio] - Aspect ratio for the canvas to resize to if fixedSize
     *                                         is true. Leave empty for no aspect ratio.
     * @param {boolean} [options.fixedSize=true] - Will resize to fit window if true.
     * @param {number} [options.width=400] - Initial width.
     * @param {number} [options.height=400] - Initial height.
     */
    constructor(options: ICanvasOptions = {}, eventManager: EventManager) {
        this.fixedSize = options.fixedSize ?? true;
        this._eventManager = eventManager;

        this.aspectRatio = options.aspectRatio ?? null;
        this.element = document.createElement("canvas");

        if (!this.fixedSize) {
            this.resizeFull();
        } else {
            this.resizeCanvas(options.width ?? 400, options.height ?? 400);
        }

        window.addEventListener("keydown", (event) => {
            this._pressedKeys.set(event.code, true);
            this._eventManager.sendEvent(new KeyPressedEvent(event.code, event.repeat));
        });

        window.addEventListener("keyup", (event) => {
            this._pressedKeys.set(event.code, false);
            this._eventManager.sendEvent(new KeyReleasedEvent(event.code));
        });

        window.addEventListener("keypress", (event) => {
            this._eventManager.sendEvent(new KeyTypedEvent(event.key));
        });

        window.addEventListener("mousedown", (event) => {
            this._eventManager.sendEvent(new MousePressedEvent(event.button));
            this._pressedMouseButtons.set(event.button, true);
        });

        window.addEventListener("mouseup", (event) => {
            this._eventManager.sendEvent(new MouseReleasedEvent(event.button));
            this._pressedMouseButtons.set(event.button, false);
        });

        window.addEventListener("mousemove", (event) => {
            this._eventManager.sendEvent(new MouseMovedEvent(event.offsetX, event.offsetY));
            this._mousePosition.set(event.clientX, event.clientY);
        });

        window.addEventListener("wheel", (event) => {
            this._eventManager.sendEvent(new MouseScrolledEvent(event.offsetX, event.offsetY));
        });

        window.addEventListener("resize", () => {
            if (!this.fixedSize) {
                this.resizeFull();
            }
        });
    }

    /**
     * Resizes the canvas to the specified width and height.
     *
     * @param width - The width to resize to.
     * @param height - The height to resize to.
     * @param {boolean} [sendEvent=true] - Whether or not to send a CanvasResizedEvent.
     */
    resizeCanvas(width: number, height: number, sendEvent: boolean = true): void {
        this.width = width;
        this.height = height;
        this.element.width = width;
        this.element.height = height;

        if (sendEvent) {
            this._eventManager.sendEvent(new CanvasResizedEvent(width, height));
        }
    }

    /**
     * Checks if the specified key is held down.
     *
     * @param keyCode - The key code (from window.KeyboardEvent) to check.
     * @return Whether or not the key was held down.
     */
    isKeyPressed(keyCode: string): boolean {
        return this._pressedKeys.get(keyCode) ?? false;
    }

    /**
     * Checks if the specified mouse button is held down.
     *
     * @param button - The mouse button code (from window.MouseEvent) to check.
     * @return Whether or not the mouse button was held down.
     */
    isMousePressed(button: number): boolean {
        return this._pressedMouseButtons.get(button) ?? false;
    }

    /**
     * Gets the current mouse position.
     *
     * @return The current mouse position.
     */
    getMousePosition(): Vector2 {
        return this._mousePosition.clone();
    }

    /**
     * Resizes the canvas to fit the window with accordence to the aspect ratio.
     */
    resizeFull(): void {
        if (this.aspectRatio !== null) {
            let height = window.innerHeight;
            const aspectWidth = window.innerWidth / this.aspectRatio;
            if (aspectWidth < height) height = aspectWidth;

            this.resizeCanvas(height * this.aspectRatio, height);
        } else {
            this.resizeCanvas(window.innerWidth, window.innerHeight);
        }
    }
}
