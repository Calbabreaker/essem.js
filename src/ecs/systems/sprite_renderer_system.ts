import { Application, ApplicationUpdateEvent } from "src/core/application";
import { CameraComponent } from "src/ecs/components/camera_component";
import { Entity } from "../entity";
import { SpriteComponent } from "src/ecs/components/sprite_component";
import { System } from "../system";
import { TransformComponent } from "src/ecs/components/transform_component";
import { Renderer } from "src/renderer/renderer";

/**
 * Register this system to render sprites.
 *
 * @memberof ESSEM
 */
export class SpriteRendererSystem extends System {
    renderer!: Renderer;

    setup(app: Application): void {
        this.renderer = app.renderer;
        this.setComponents([TransformComponent, SpriteComponent]);
        app.eventManager.addListener(ApplicationUpdateEvent, this.onUpdate.bind(this));
    }

    onUpdate(): void {
        const mainCamera = this.scene.getEntitesByTag("MainCamera")[0];
        if (mainCamera === undefined) return;

        const viewProjection = mainCamera.getComponent(CameraComponent).projectionMatrix;
        viewProjection.multiply(
            mainCamera.getComponent(TransformComponent).transformMatrix.invert()
        );

        const batchExt = this.renderer.extensions.batch;

        batchExt.beginScene(viewProjection);
        this.entities.forEach((entity) => {
            this.calculateVertices(entity);
            batchExt.render(entity.getComponent(SpriteComponent));
        });

        batchExt.endScene();
    }

    calculateVertices(entity: Entity) {
        const m = TransformComponent.getGlobalTransformMatrix(entity);
        const sprite = entity.getComponent(SpriteComponent);
        const { texture, vertexData } = sprite;

        let w0 = -texture.anchor.x * texture.width;
        let w1 = w0 + texture.width;
        let h0 = -texture.anchor.y * texture.height;
        let h1 = h0 + texture.height;

        // not using vectors apply matrix function because this faster
        vertexData[0] = m.xScale * w1 + m.xSkew * h1 + m.xTrans;
        vertexData[1] = m.yScale * h1 + m.ySkew * w1 + m.yTrans;
        vertexData[2] = m.xScale * w0 + m.xSkew * h1 + m.xTrans;
        vertexData[3] = m.yScale * h1 + m.ySkew * w0 + m.yTrans;
        vertexData[4] = m.xScale * w0 + m.xSkew * h0 + m.xTrans;
        vertexData[5] = m.yScale * h0 + m.ySkew * w0 + m.yTrans;
        vertexData[6] = m.xScale * w1 + m.xSkew * h0 + m.xTrans;
        vertexData[7] = m.yScale * h0 + m.ySkew * w1 + m.yTrans;

        sprite.uvs = sprite.texture.uvs;
    }
}
