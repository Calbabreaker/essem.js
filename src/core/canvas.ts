import { Vector2 } from "../math/vector2";
import { KeyCode, MouseCode } from "./codes";
import { Event, EventManager } from "./event_manager";

abstract class KeyboardEvent extends Event {
    readonly key: string;

    constructor(key: string) {
        super();
        this.key = key;
    }
}

export class KeyPressedEvent extends KeyboardEvent {
    readonly repeated: boolean;

    constructor(key: string, repeated: boolean) {
        super(key);
        this.repeated = repeated;
    }
}

export class KeyReleasedEvent extends KeyboardEvent {}

export class KeyTypedEvent extends KeyboardEvent {}

abstract class MouseButtonEvent extends Event {
    readonly button: number;

    constructor(button: number) {
        super();
        this.button = button;
    }
}

export class MousePressedEvent extends MouseButtonEvent {}
export class MouseReleasedEvent extends MouseButtonEvent {}

abstract class MouseChangedEvent extends Event {
    readonly offsetX: number;
    readonly offsetY: number;

    constructor(x: number, y: number) {
        super();
        this.offsetX = x;
        this.offsetY = y;
    }
}

export class MouseMovedEvent extends MouseChangedEvent {}
export class MouseScrolledEvent extends MouseChangedEvent {}

export class CanvasResizedEvent extends Event {
    readonly width: number;
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
 * Canvas for canvas element and the input events.
 *
 * @memberof ESSEM
 */
export class Canvas {
    element: HTMLCanvasElement;

    fixedSize: boolean;
    aspectRatio: number | null;
    width!: number;
    height!: number;

    private _eventManager: EventManager;
    private _pressedKeys: Map<KeyCode, boolean> = new Map();
    private _pressedMouseButtons: Map<MouseCode, boolean> = new Map();
    private _mousePosition: Vector2 = new Vector2();

    /**
     * @param {object} [options={}] - Optional parameters for Canvas.
     * @param {number} [options.aspectRatio] - Aspect ratio for the canvas to resize to fixedSized
     * @param {boolean} [options.fixedSize=true] - Will resize to fit window if true.
     *                                          is true. Leave empty for no aspect ratio.
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
            this._pressedKeys.set(event.code as KeyCode, true);
            this._eventManager.sendEvent(new KeyPressedEvent(event.code, event.repeat));
        });

        window.addEventListener("keyup", (event) => {
            this._pressedKeys.set(event.code as KeyCode, false);
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

    resizeCanvas(width: number, height: number, sendEvent = true): void {
        this.width = width;
        this.height = height;
        this.element.width = width;
        this.element.height = height;

        if (sendEvent) {
            this._eventManager.sendEvent(new CanvasResizedEvent(width, height));
        }
    }

    isKeyPressed(key: KeyCode | string): boolean {
        return this._pressedKeys.get(key as KeyCode) ?? false;
    }

    isMousePressed(button: MouseCode | string): boolean {
        return this._pressedMouseButtons.get(button as MouseCode) ?? false;
    }

    getMousePosition(): Vector2 {
        return this._mousePosition.clone();
    }

    // resizes with accordence to aspect ratio
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
