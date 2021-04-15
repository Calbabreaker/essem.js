import { Application } from "src/core/application";
import { Canvas, CanvasResizedEvent } from "src/core/canvas";
import { Entity } from "../entity";
import { System } from "../system";
import { CameraComponent } from "src/ecs/components/camera_component";
import { TransformComponent } from "src/ecs/components/transform_component";

/**
 * Register this system when handling cameras.
 *
 * @memberof ESSEM
 */
export class CameraSystem extends System {
    canvas!: Canvas;

    setup(app: Application): void {
        this.setComponents(TransformComponent, CameraComponent);
        app.eventManager.addListener(CanvasResizedEvent, this.onResized.bind(this));
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
}
