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
    parentElement?: HTMLElement;

    fixedSize: boolean;
    aspectRatio: number | null;
    width!: number;
    height!: number;

    private _eventManager: EventManager;

    constructor(options: ICanvasOptions = {}, eventManager: EventManager) {
        this.fixedSize = options.fixedSize ?? false;
        this._eventManager = eventManager;

        this.aspectRatio = options.aspectRatio ?? null;
        this.element = document.createElement("canvas");
        this.resizeCanvas(options.width ?? 400, options.height ?? 400, false);
    }

    init() {
        this._resizeFull();

        window.addEventListener("resize", () => {
            this._resizeFull();
        });
    }

    setParent(element: HTMLElement) {
        this.parentElement = element;
        element.appendChild(this.element);
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
    private _resizeFull() {
        if (this.parentElement === undefined || this.fixedSize) return;

        if (this.aspectRatio !== null) {
            let height = this.parentElement.offsetHeight;
            const aspectHeight = this.parentElement.offsetWidth / this.aspectRatio;
            if (aspectHeight < height) height = aspectHeight;

            this.resizeCanvas(height * this.aspectRatio, height);
        } else {
            console.log(this.parentElement.offsetHeight);
            this.resizeCanvas(this.parentElement.offsetWidth, this.parentElement.offsetHeight);
        }
    }
}
