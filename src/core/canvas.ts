import { Event, EventManager } from "./event_manager";

export class CanvasResizedEvent extends Event {
    width: number;
    height: number;
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

export class Canvas {
    element: HTMLCanvasElement;

    fixedSize: boolean;
    aspectRatio: number | null;
    width!: number;
    height!: number;

    private _eventManager: EventManager;

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

        window.addEventListener("resize", () => {
            if (!this.fixedSize) {
                this.resizeFull();
            }
        });
    }

    resizeCanvas(width: number, height: number, sendEvent = true) {
        this.width = width;
        this.height = height;
        this.element.width = width;
        this.element.height = height;

        if (sendEvent) {
            this._eventManager.sendEvent(new CanvasResizedEvent(width, height));
        }
    }

    // resizes with accordence to aspect ratio
    resizeFull() {
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
