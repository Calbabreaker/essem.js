import { Matrix3 } from "src/math/matrix3";
import { Vector2 } from "src/math/vector2";
import { assert } from "src/utils/misc";

export class Shader {
    vertexSrc: string;
    fragmentSrc: string;
    name: string;

    glProgram: WebGLProgram | null = null;
    uniformLocationCache: Map<string, WebGLUniformLocation> = new Map();

    constructor(vertexSrc: string, fragmentSrc: string, name = "Default") {
        this.vertexSrc = vertexSrc;
        this.fragmentSrc = fragmentSrc;
        this.name = name;
    }

    init(gl: WebGL2RenderingContext): void {
        const glVertexShader = this._compileGLShader(gl, gl.VERTEX_SHADER, this.vertexSrc);
        const glFragmentShader = this._compileGLShader(gl, gl.FRAGMENT_SHADER, this.fragmentSrc);

        this.glProgram = gl.createProgram();
        assert(this.glProgram !== null, `Could not create glProgram!`);
        gl.attachShader(this.glProgram, glVertexShader);
        gl.attachShader(this.glProgram, glFragmentShader);

        gl.linkProgram(this.glProgram);
        if (!gl.getProgramParameter(this.glProgram, gl.LINK_STATUS)) {
            const programLog = gl.getProgramInfoLog(this.glProgram);
            throw new Error(`Program failed to link in '${this.name}' shader!\n${programLog}`);
        }

        gl.deleteShader(glVertexShader);
        gl.deleteShader(glFragmentShader);
    }

    bind(gl: WebGL2RenderingContext): void {
        if (!this.glProgram) {
            this.init(gl);
        }

        gl.useProgram(this.glProgram);
    }

    dispose(gl: WebGL2RenderingContext): void {
        gl.deleteProgram(this.glProgram);
    }

    getUniformLocation(gl: WebGL2RenderingContext, name: string): WebGLUniformLocation {
        const cachedLocation = this.uniformLocationCache.get(name);
        if (cachedLocation !== undefined) {
            return cachedLocation;
        }

        assert(this.glProgram !== null, `Has not initialized yet in '${this.name}' shader!`);
        const location = gl.getUniformLocation(this.glProgram, name);
        assert(location !== null, `Uniform '${name}' does not appear to exist!`);

        this.uniformLocationCache.set(name, location);
        return location;
    }

    setFloat1(gl: WebGL2RenderingContext, name: string, value: number): void {
        gl.uniform1f(this.getUniformLocation(gl, name), value);
    }

    setFloat2(gl: WebGL2RenderingContext, name: string, value: Vector2): void {
        gl.uniform2f(this.getUniformLocation(gl, name), value.x, value.y);
    }

    setInt1(gl: WebGL2RenderingContext, name: string, value: number): void {
        gl.uniform1i(this.getUniformLocation(gl, name), value);
    }

    setIntArray(gl: WebGL2RenderingContext, name: string, value: Int32Array): void {
        gl.uniform1iv(this.getUniformLocation(gl, name), value);
    }

    setMatrix3(gl: WebGL2RenderingContext, name: string, value: Matrix3): void {
        gl.uniformMatrix3fv(this.getUniformLocation(gl, name), false, value.toArray(true));
    }

    private _compileGLShader(
        gl: WebGL2RenderingContext,
        type: number,
        source: string
    ): WebGLShader {
        const glShader = gl.createShader(type);
        const shaderTypeName = type === gl.VERTEX_SHADER ? "vertex" : "fragment";
        assert(glShader !== null, `Could not create ${shaderTypeName} shader!`);

        gl.shaderSource(glShader, source);
        gl.compileShader(glShader);

        if (!gl.getShaderParameter(glShader, gl.COMPILE_STATUS)) {
            const shaderLog = gl.getShaderInfoLog(glShader);
            throw new Error(
                `Failed to compile ${shaderTypeName} shader in '${this.name}' shader!\n${shaderLog}`
            );
        }

        return glShader;
    }
}
