import { System } from "../system";
import { Application } from "../../core/application";
import { SpriteComponent, Transform2DComponent } from "../components";
import { AbstractBatchRenderer } from "../../renderer/abstract_batch_renderer";

export class SpriteRenderer extends AbstractBatchRenderer {
    // prettier-ignore
    static quadVertexPositions: Float32Array = new Float32Array([
         -0.5, -0.5,   
          0.5, -0.5,   
          0.5,  0.5,   
         -0.5,  0.5,  
    ]);

    drawSprite(sprite: SpriteComponent, transform: Transform2DComponent) {
        if (this.indicesCount >= AbstractBatchRenderer.maxIndices) this.nextBatch();

        const vertexPoses = SpriteRenderer.quadVertexPositions;
        for (let i = 0; i < 4; i++) {
            this.vertices[this.verticesIndex++] = vertexPoses[i * 2 + 0];
            this.vertices[this.verticesIndex++] = vertexPoses[i * 2 + 1];
        }

        sprite;
        transform;
        this.indicesCount += 6;
    }
}

export class SpriteRendererSystem extends System {
    spriteRenderer?: SpriteRenderer;

    onInit(app: Application) {
        this.setTypes(Transform2DComponent, SpriteComponent);
        this.spriteRenderer = new SpriteRenderer(app.renderer);
    }

    onUpdate() {
        this.spriteRenderer?.beginScene();
        this.entities.forEach((entity) => {
            this.spriteRenderer?.drawSprite(
                entity.getComponent(SpriteComponent),
                entity.getComponent(Transform2DComponent)
            );
        });

        this.spriteRenderer?.endScene();
    }
}
