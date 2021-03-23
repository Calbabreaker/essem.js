import { System } from "../system";
import { Application, ApplicationUpdateEvent } from "../../core/application";
import { CameraComponent, SpriteComponent, TransformComponent } from "../components";
import { AbstractBatchRenderer } from "../../renderer/abstract_batch_renderer";
import { CameraSystem } from "./camera_system";
import { assert } from "../../utils/misc";
export class SpriteRenderer extends AbstractBatchRenderer {
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

    drawSprite(sprite: SpriteComponent, transform: TransformComponent) {
        if (this.indicesCount >= AbstractBatchRenderer.maxIndices) this.nextBatch();

        for (let i = 0; i < 4; i++) {
            const index = i * 2;
            this.vertices[this.verticesIndex++] = SpriteRenderer.vertexPositions[index + 0];
            this.vertices[this.verticesIndex++] = SpriteRenderer.vertexPositions[index + 1];
            this.vertices[this.verticesIndex++] = SpriteRenderer.texCoords[index + 0];
            this.vertices[this.verticesIndex++] = SpriteRenderer.texCoords[index + 1];
            this.vertices[this.verticesIndex++] = this.getTextureSlot(sprite.texture);
        }

        transform;
        this.indicesCount += 6;
    }
}

export class SpriteRendererSystem extends System {
    spriteRenderer!: SpriteRenderer;

    setup(app: Application): void {
        this.setComponents(TransformComponent, SpriteComponent);
        app.events.addListener(ApplicationUpdateEvent, this.onUpdate.bind(this));
        this.spriteRenderer = new SpriteRenderer(app.renderer);
    }

    onUpdate(): void {
        const mainCamera = CameraSystem.mainCamera;
        assert(mainCamera !== null, "No main camera has been set!");

        const viewProjection = mainCamera.getComponent(CameraComponent).projectionMatrix;
        viewProjection.multiply(
            mainCamera.getComponent(TransformComponent).transformMatrix.invert()
        );

        this.spriteRenderer.beginScene(viewProjection);
        this.entities.forEach((entity) => {
            this.spriteRenderer.drawSprite(
                entity.getComponent(SpriteComponent),
                entity.getComponent(TransformComponent)
            );
        });

        this.spriteRenderer.endScene();
    }
}
