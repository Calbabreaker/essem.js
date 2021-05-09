import { Application, ApplicationPreRenderEvent } from "src/core/application";
import { Canvas, CanvasResizedEvent } from "src/core/canvas";
import { Entity } from "../entity";
import { System } from "../system";
import { CameraComponent } from "src/ecs/components/camera_component";
import { TransformComponent } from "src/ecs/components/transform_component";

/**
 * Systems that handles cameras.
 * Register this system or cameras will not work.
 *
 * @memberof ESSEM
 */
export class CameraSystem extends System {
    canvas!: Canvas;

    setup(app: Application): void {
        this.setComponents([TransformComponent, CameraComponent]);
        app.eventManager.addListener(CanvasResizedEvent, this.onResized.bind(this));
        app.eventManager.addListener(ApplicationPreRenderEvent, this.onPreRender.bind(this));
        this.canvas = app.canvas;
    }

    onEntityAdd(entity: Entity): void {
        const cameraComponent = entity.getComponent(CameraComponent);
        if (!cameraComponent.fixedAspectRatio) {
            cameraComponent.setViewportSize(this.canvas.width, this.canvas.height);
        }
    }

    onPreRender(): void {
        this.entities.forEach((entity) => {
            const transform = entity.getComponent(TransformComponent);
            const camera = entity.getComponent(CameraComponent);

            camera.updateProjection();
            TransformComponent.updateGlobalTransform(entity);

            if (transform._globalUpdateID !== camera._transformUpdateID) {
                camera.viewProjMatrix.setMatrix(transform.globalMatrix).invert();
                camera.viewProjMatrix.multiplyFront(camera.projectionMatrix);
                camera._transformUpdateID = transform._globalUpdateID;
            }
        });
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
