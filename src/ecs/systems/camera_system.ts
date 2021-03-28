import { Application } from "../../core/application";
import { Canvas, CanvasResizedEvent } from "../../core/canvas";
import { CameraComponent, TransformComponent } from "../components";
import { Entity } from "../entity";
import { System } from "../system";

export class CameraSystem extends System {
    canvas!: Canvas;

    setup(app: Application): void {
        this.setComponents(TransformComponent, CameraComponent);
        app.events.addListener(CanvasResizedEvent, this.onResized.bind(this));
        this.canvas = app.canvas;
    }

    onEntityAdd(entity: Entity): void {
        const cameraComponent = entity.getComponent(CameraComponent);
        if (!cameraComponent.fixedAspectRatio) {
            cameraComponent.setViewportSize(this.canvas.width, this.canvas.height);
        }
    }

    onResized(event: CanvasResizedEvent): void {
        this.entities.forEach((entity) => {
            const cameraComponent = entity.getComponent(CameraComponent);
            if (!cameraComponent.fixedAspectRatio) {
                cameraComponent.setViewportSize(event.width, event.height);
            }
        });
    }

    static mainCamera: Entity | null = null;
}
