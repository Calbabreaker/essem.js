import { Canvas } from "src/core/canvas";
import { EventManager } from "src/core/event_manager";

describe("ESSEM.Canvas", () => {
    const eventManager = new EventManager();

    test("should generate Canvas", () => {
        const canvas = new Canvas(undefined, eventManager);

        expect(canvas.width).toBe(400);
        expect(canvas.height).toBe(400);
        expect(canvas.element).toBeInstanceOf(HTMLCanvasElement);
        expect(canvas.fixedSize).toBe(true);
        expect(canvas.aspectRatio).toBe(null);
    });

    test("should set correct options", () => {
        const options = { width: 100, height: 100, fixedSize: true, aspectRatio: 16 / 9 };
        const canvas = new Canvas(options, eventManager);

        expect(canvas.width).toBe(options.width);
        expect(canvas.height).toBe(options.width);
        expect(canvas.fixedSize).toBe(options.fixedSize);
        expect(canvas.aspectRatio).toBe(options.aspectRatio);
    });
});
