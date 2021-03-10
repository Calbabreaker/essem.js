import { Renderer } from "../renderer/renderer";

export class Canvas {
    element: HTMLCanvasElement;
    renderer: Renderer;

    constructor() {
        this.element = document.createElement("canvas");
        document.body.appendChild(this.element);

        this.renderer = new Renderer(this.element);
    }
}
