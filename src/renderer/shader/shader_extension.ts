import { GLProgram } from "./gl_program";
import { Renderer } from "../renderer";
import { Shader } from "./shader";
import { assert } from "src/utils/misc";
import { SHADER_TYPES } from "src/utils/constants";
import { glslToShaderDataType, shaderDataTypeDefaultValue } from "./shader_utils";
import { IUniformInfo, uploadUniform } from "./uniforms";

export class ShaderExtension {
    renderer: Renderer;
    boundShader: Shader | null = null;

    constructor(renderer: Renderer) {
        this.renderer = renderer;
    }

    bindShader(shader: Shader): void {
        const { gl, contextUID } = this.renderer;

        const glProgram = shader.glPrograms[contextUID] ?? this.initShader(shader);
        if (shader !== this.boundShader) {
            gl.useProgram(glProgram.handle);
            this.boundShader = shader;
        }

        this.syncUniforms(shader, glProgram);
    }

    unbindShader(): void {
        this.renderer.gl.useProgram(null);
        this.boundShader = null;
    }

    destroyShader(shader: Shader): void {
        const { gl, contextUID } = this.renderer;

        const glProgram = shader.glPrograms[contextUID];
        if (glProgram !== undefined) {
            if (this.boundShader === shader) this.unbindShader();
            gl.deleteProgram(glProgram.handle);
            delete shader.glPrograms[contextUID];
        }
    }

    initShader(shader: Shader): GLProgram {
        const { gl, contextUID } = this.renderer;

        const webglProgram = gl.createProgram();
        assert(webglProgram !== null, "Failed to create WebGL program!");

        const glVertexShader = this.compileGLShader(gl.VERTEX_SHADER, shader.vertexSrc);
        const glFragmentShader = this.compileGLShader(gl.FRAGMENT_SHADER, shader.fragmentSrc);
        gl.attachShader(webglProgram, glVertexShader);
        gl.attachShader(webglProgram, glFragmentShader);

        gl.linkProgram(webglProgram);
        assert(
            gl.getProgramParameter(webglProgram, gl.LINK_STATUS),
            `WebGL program failed to link!\n${gl.getProgramInfoLog(webglProgram)}`
        );

        gl.deleteShader(glVertexShader);
        gl.deleteShader(glFragmentShader);

        const glProgram = new GLProgram(webglProgram);
        this.dectectShaderUniforms(shader, glProgram);

        shader.glPrograms[contextUID] = glProgram;
        return glProgram;
    }

    compileGLShader(type: SHADER_TYPES, source: string): WebGLShader {
        const { gl } = this.renderer;

        const webglShader = gl.createShader(type);
        const shaderTypeName = type === SHADER_TYPES.VERTEX_SHADER ? "vertex" : "fragment";
        assert(webglShader !== null, `Could not create ${shaderTypeName} shader!`);

        gl.shaderSource(webglShader, source);
        gl.compileShader(webglShader);

        assert(
            gl.getShaderParameter(webglShader, gl.COMPILE_STATUS),
            `Failed to compile ${shaderTypeName} shader!\n${gl.getShaderInfoLog(webglShader)}`
        );

        return webglShader;
    }

    syncUniforms(shader: Shader, glProgram: GLProgram): void {
        const { gl } = this.renderer;

        const group = shader.uniformGroup;
        group.uniformInfos.forEach((info) => {
            const uniformData = glProgram.uniformDatas[info.name];
            const value = shader.uniformGroup.uniforms[info.name];
            uploadUniform(gl, value, info, uniformData);
        });
    }

    dectectShaderUniforms(shader: Shader, glProgram: GLProgram): void {
        const group = shader.uniformGroup;
        if (group.hasDetectedUniforms) return;

        const { gl } = this.renderer;

        const uniformCount = gl.getProgramParameter(glProgram.handle, gl.ACTIVE_UNIFORMS);
        for (let i = 0; i < uniformCount; i++) {
            const rawUniformData = gl.getActiveUniform(glProgram.handle, i) as WebGLActiveInfo;
            // gets rid of the array descriptor
            const name = rawUniformData.name.replace(/\[.*?\]$/, "");
            const dataType = glslToShaderDataType(rawUniformData.type);

            const componentCount = parseInt(dataType.slice(-1));

            const uniformInfo: IUniformInfo = {
                name,
                dataType: dataType,
                isArray: rawUniformData.size > 1,
                size: componentCount * rawUniformData.size,
            };

            group.uniformInfos.push(uniformInfo);

            const location = gl.getUniformLocation(glProgram.handle, name) as WebGLUniformLocation;
            glProgram.uniformDatas[name] = {
                location,
                cachedValue: shaderDataTypeDefaultValue(
                    dataType,
                    uniformInfo.isArray,
                    uniformInfo.size
                ),
            };
        }

        group.hasDetectedUniforms = true;
    }
}
