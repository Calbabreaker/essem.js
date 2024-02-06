import { GLProgram } from "./gl_program";
import { Renderer } from "../renderer";
import { Shader } from "./shader";
import { assert } from "src/utils/misc";
import { SHADER_TYPES } from "src/utils/constants";
import { glslToShaderDataType, IShaderInfo, shaderDataTypeDefaultValue } from "./shader_utils";
import { uploadUniform } from "./uniforms";

export class ShaderExtension {
    renderer: Renderer;
    boundShader: Shader | null = null;

    constructor(renderer: Renderer) {
        this.renderer = renderer;
    }

    bindShader(shader: Shader): GLProgram {
        const { gl, contextUID } = this.renderer;

        const glProgram = shader.glPrograms[contextUID] ?? this.initShader(shader);
        if (shader !== this.boundShader) {
            gl.useProgram(glProgram.handle);
            this.boundShader = shader;
        }

        this.syncUniforms(shader, glProgram);
        return glProgram;
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
            `WebGL program failed to link!\n${gl.getProgramInfoLog(webglProgram)}`,
        );

        gl.deleteShader(glVertexShader);
        gl.deleteShader(glFragmentShader);

        const glProgram = new GLProgram(webglProgram);
        this.detectShaderUniforms(shader, glProgram);
        this.detectShaderAttributes(shader, glProgram);

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
            `Failed to compile ${shaderTypeName} shader!\n${gl.getShaderInfoLog(webglShader)}`,
        );

        return webglShader;
    }

    syncUniforms(shader: Shader, glProgram: GLProgram): void {
        const { gl } = this.renderer;

        assert(shader.uniformInfos !== undefined, "Has not detected uniforms on shader yet!");
        shader.uniformInfos.forEach((info) => {
            const uniformData = glProgram.uniformDatas[info.name];
            const value = shader.uniforms[info.name];
            if (value !== undefined) uploadUniform(gl, value, info, uniformData);
        });
    }

    detectShaderUniforms(shader: Shader, glProgram: GLProgram): void {
        const { gl } = this.renderer;

        const uniformInfos = [];
        const uniformCount = gl.getProgramParameter(glProgram.handle, gl.ACTIVE_UNIFORMS);
        for (let i = 0; i < uniformCount; i++) {
            const rawUniformInfo = gl.getActiveUniform(glProgram.handle, i) as WebGLActiveInfo;
            const info = getShaderInfo(rawUniformInfo);
            uniformInfos.push(info);

            const location = gl.getUniformLocation(
                glProgram.handle,
                info.name,
            ) as WebGLUniformLocation;

            glProgram.uniformDatas[info.name] = {
                location,
                cachedValue: shaderDataTypeDefaultValue(info.dataType, info.isArray, info.size),
            };
        }

        if (shader.uniformInfos === undefined) shader.uniformInfos = uniformInfos;
    }

    detectShaderAttributes(shader: Shader, glProgram: GLProgram): void {
        const { gl } = this.renderer;

        const attributeInfos = [];
        const attributeCount = gl.getProgramParameter(glProgram.handle, gl.ACTIVE_ATTRIBUTES);
        for (let i = 0; i < attributeCount; i++) {
            const rawAttributeData = gl.getActiveAttrib(glProgram.handle, i) as WebGLActiveInfo;
            const info = getShaderInfo(rawAttributeData);
            attributeInfos.push(info);

            const location = gl.getAttribLocation(glProgram.handle, info.name);

            glProgram.attributeDatas[info.name] = {
                location,
            };
        }

        if (shader.attributeInfos === undefined) shader.attributeInfos = attributeInfos;
    }
}

function getShaderInfo(rawShaderInfo: WebGLActiveInfo): IShaderInfo {
    // gets rid of the array descriptor
    const name = rawShaderInfo.name.replace(/\[.*?\]$/, "");
    const dataType = glslToShaderDataType(rawShaderInfo.type);
    const componentCount = parseInt(dataType.charAt(dataType.length - 1));

    return {
        name,
        dataType: dataType,
        isArray: rawShaderInfo.size > 1,
        size: componentCount * rawShaderInfo.size,
    };
}
