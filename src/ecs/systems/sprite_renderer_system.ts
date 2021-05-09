import { Application, ApplicationRenderEvent } from "src/core/application";
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
        app.eventManager.addListener(ApplicationRenderEvent, this.onRender.bind(this));
    }

    onRender(): void {
        const mainCamera = this.scene.getEntitesByTag("MainCamera")[0];
        if (mainCamera === undefined) return;
        const cameraComp = mainCamera.getComponent(CameraComponent);

        const batchExt = this.renderer.extensions.batch;

        batchExt.beginScene(cameraComp.viewProjMatrix);
        this.entities.forEach((entity) => {
            batchExt.render(this.calculateVertices(entity));
        });

        batchExt.endScene();
    }

    calculateVertices(entity: Entity): SpriteComponent {
        TransformComponent.updateGlobalTransform(entity);
        const transform = entity.getComponent(TransformComponent);
        const sprite = entity.getComponent(SpriteComponent);

        if (transform._globalUpdateID !== sprite._transformUpdateID) {
            const m = transform.globalMatrix;
            const w0 = -sprite.texture.anchor.x * sprite.texture.width;
            const w1 = w0 + sprite.texture.width;
            const h0 = -sprite.texture.anchor.y * sprite.texture.height;
            const h1 = h0 + sprite.texture.height;

            // not using vectors apply matrix function because this faster
            sprite.vertexData[0] = m.xScale * w1 + m.xSkew * h1 + m.xTrans;
            sprite.vertexData[1] = m.yScale * h1 + m.ySkew * w1 + m.yTrans;
            sprite.vertexData[2] = m.xScale * w0 + m.xSkew * h1 + m.xTrans;
            sprite.vertexData[3] = m.yScale * h1 + m.ySkew * w0 + m.yTrans;
            sprite.vertexData[4] = m.xScale * w0 + m.xSkew * h0 + m.xTrans;
            sprite.vertexData[5] = m.yScale * h0 + m.ySkew * w0 + m.yTrans;
            sprite.vertexData[6] = m.xScale * w1 + m.xSkew * h0 + m.xTrans;
            sprite.vertexData[7] = m.yScale * h0 + m.ySkew * w1 + m.yTrans;
            sprite._transformUpdateID = transform._globalUpdateID;
        }

        sprite.uvs = sprite.texture.uvs;
        return sprite;
    }
}
