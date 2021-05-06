import { assert } from "src/utils/misc";
import { Renderer } from "../renderer";
import { Shader } from "../shader/shader";
import { shaderDataTypeToWebGLType } from "../shader/shader_utils";
import { Geometry } from "./geometry";

export class GeometryExtension {
    renderer: Renderer;
    boundGeometry: Geometry | null = null;

    constructor(renderer: Renderer) {
        this.renderer = renderer;
    }

    bindGeometry(geometry: Geometry, shader: Shader): void {
        const { gl, contextUID } = this.renderer;

        const webglVao = geometry.glVAOs[contextUID]?.[shader.id];
        if (webglVao === undefined) {
            this.initGeometryVAO(geometry, shader);
            return;
        }

        if (this.boundGeometry !== geometry) {
            gl.bindVertexArray(webglVao);
            this.boundGeometry = geometry;
        }

        this.updateGeometryBuffers(geometry);
    }

    unbindGeometry(): void {
        this.boundGeometry = null;
        this.renderer.gl.bindVertexArray(null);
    }

    initGeometryVAO(geometry: Geometry, shader: Shader): WebGLVertexArrayObject {
        const { gl, contextUID } = this.renderer;

        if (geometry.glVAOs[contextUID] === undefined) geometry.glVAOs[contextUID] = {};

        const webglVAO = gl.createVertexArray();
        assert(webglVAO !== null, "Failed to create WebGL vertex array!");
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        geometry.glVAOs[contextUID]![shader.id] = webglVAO;

        gl.bindVertexArray(webglVAO);
        this.boundGeometry = geometry;

        // first update of buffers, also binds them to tell webgl the attributes
        this.updateGeometryBuffers(geometry);

        this.activateVAO(geometry, shader);
        return webglVAO;
    }

    activateVAO(geometry: Geometry, shader: Shader): void {
        const { gl, extensions } = this.renderer;

        const glProgram = extensions.shader.bindShader(shader);
        geometry.vertexBuffers.forEach((buffer) => {
            assert(buffer.layout !== undefined, "Buffer does not contain a layout!");

            for (const element of buffer.layout.elements) {
                const attributeData = glProgram.attributeDatas[element.name];
                if (attributeData === undefined) continue;

                const webglType = shaderDataTypeToWebGLType(element.dataType);
                gl.enableVertexAttribArray(attributeData.location);
                if (webglType === gl.INT) {
                    gl.vertexAttribIPointer(
                        attributeData.location,
                        element.componentCount,
                        webglType,
                        buffer.layout.stride,
                        element.offset
                    );
                } else {
                    gl.vertexAttribPointer(
                        attributeData.location,
                        element.componentCount,
                        webglType,
                        element.normalized,
                        buffer.layout.stride,
                        element.offset
                    );
                }
            }
        });
    }

    /**
     * Updates the buffers attached to the specified geometry if needed.
     *
     * @param geometry - The geometry containing buffers to update.
     */
    updateGeometryBuffers(geometry: Geometry): void {
        const { extensions } = this.renderer;

        if (geometry.indexBuffer !== undefined)
            extensions.buffer.updateBuffer(geometry.indexBuffer);
        geometry.vertexBuffers.forEach((buffer) => {
            extensions.buffer.updateBuffer(buffer);
        });
    }
}
