import { BatchRendererExtension } from "src/renderer/batch_renderer_extension";
import { Application, ApplicationUpdateEvent } from "src/core/application";
import { CameraComponent } from "src/ecs/components/camera_component";
import { Entity } from "../entity";
import { SpriteComponent } from "src/ecs/components/sprite_component";
import { System } from "../system";
import { TransformComponent } from "src/ecs/components/transform_component";
import { Vector2 } from "src/math/vector2";

class SpriteRenderer extends BatchRendererExtension {
    // prettier-ignore
    static vertexPositions: Float32Array = new Float32Array([
        -0.5, -0.5,   
         0.5, -0.5,   
         0.5,  0.5,   
        -0.5,  0.5,  ]);

    // prettier-ignore
    static texCoords: Float32Array = new Float32Array([
        0.0, 0.0, 
        1.0, 0.0, 
        1.0, 1.0, 
        0.0, 1.0, 
    ]);

    private _cacheVector: Vector2 = new Vector2();

    drawSprite(entity: Entity): void {
        if (this.indicesCount >= BatchRendererExtension.maxIndices) this.nextBatch();
        const matrix = TransformComponent.getGlobalTransformMatrix(entity);
        const sprite = entity.getComponent(SpriteComponent);

        for (let i = 0; i < 4; i++) {
            const index = i * 2;
            this._cacheVector
                .set(
                    SpriteRenderer.vertexPositions[index],
                    SpriteRenderer.vertexPositions[index + 1]
                )
                .transformMatrix3(matrix);
            this.vertices[this.verticesIndex++] = this._cacheVector.x;
            this.vertices[this.verticesIndex++] = this._cacheVector.y;
            this.vertices[this.verticesIndex++] = SpriteRenderer.texCoords[index];
            this.vertices[this.verticesIndex++] = SpriteRenderer.texCoords[index + 1];
            this.vertices[this.verticesIndex++] = this.getTextureSlot(sprite.texture);
            this.vertices[this.verticesIndex++] = sprite.rgbaColor[0];
            this.vertices[this.verticesIndex++] = sprite.rgbaColor[1];
            this.vertices[this.verticesIndex++] = sprite.rgbaColor[2];
            this.vertices[this.verticesIndex++] = sprite.rgbaColor[3];
        }

        this.indicesCount += 6;
    }
}

/**
 * Register this system to render sprites.
 *
 * @memberof ESSEM
 */
export class SpriteRendererSystem extends System {
    spriteRenderer!: SpriteRenderer;

    setup(app: Application): void {
        this.setComponents([TransformComponent, SpriteComponent]);
        app.eventManager.addListener(ApplicationUpdateEvent, this.onUpdate.bind(this));
        this.spriteRenderer = new SpriteRenderer(app.renderer);
    }

    onUpdate(): void {
        const mainCamera = this.scene.getEntitesByTag("MainCamera")[0];
        if (mainCamera === undefined) return;

        const viewProjection = mainCamera.getComponent(CameraComponent).projectionMatrix;
        viewProjection.multiply(
            mainCamera.getComponent(TransformComponent).transformMatrix.invert()
        );

        this.spriteRenderer.beginScene(viewProjection);
        this.entities.forEach((entity) => {
            this.spriteRenderer.drawSprite(entity);
        });

        this.spriteRenderer.endScene();
    }
}
