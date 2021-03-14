export class Canvas {
    element: HTMLCanvasElement;

    constructor() {
        this.element = document.createElement("canvas");
        document.body.appendChild(this.element);
    }
}
