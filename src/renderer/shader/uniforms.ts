import { Matrix3 } from "src/math/matrix3";
import { Vector2 } from "src/math/vector2";
import { arrayEquals, assert } from "src/utils/misc";
import { ArrayTypes } from "src/utils/types";
import { IProgramUniformData } from "./gl_program";
import { IShaderInfo } from "./shader_utils";

export type UniformTypes = Matrix3 | Vector2 | ArrayTypes | boolean | number;

export function uploadUniform(
    gl: WebGL2RenderingContext,
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    value: any, // easier to just use any type
    info: IShaderInfo,
    uniformData: IProgramUniformData,
): void {
    const { cachedValue, location } = uniformData;

    // convert matrixs and vectors to arrays
    if (value.toArray !== undefined) value = value.toArray();

    // check if value has changed and if so don't do anything
    // check if is array
    if (value.length !== undefined) {
        const cachedArray = cachedValue as ArrayTypes;
        if (arrayEquals(value, cachedArray)) return;

        // settings value in a for loop instead because faster than slice
        for (let i = 0; i < value.length; i++) {
            cachedArray[i] = value[i];
        }
    } else {
        if (value === cachedValue) return;
        uniformData.cachedValue = value;
    }

    switch (info.dataType) {
        case "float1":
            return info.isArray ? gl.uniform1fv(location, value) : gl.uniform1f(location, value);
        case "float2":
            return info.isArray
                ? gl.uniform2fv(location, value)
                : gl.uniform2f(location, value[0], value[1]);
        case "float3":
            return info.isArray
                ? gl.uniform3fv(location, value)
                : gl.uniform3f(location, value[0], value[1], value[2]);
        case "float4":
            return info.isArray
                ? gl.uniform4fv(location, value)
                : gl.uniform4f(location, value[0], value[1], value[2], value[3]);

        // bools and ints use the same gl upload func so lets use a fall through case
        case "bool1":
        case "int1":
            return info.isArray ? gl.uniform1iv(location, value) : gl.uniform1i(location, value);
        case "bool2":
        case "int2":
            return info.isArray
                ? gl.uniform2iv(location, value)
                : gl.uniform2i(location, value[0], value[1]);
        case "bool3":
        case "int3":
            return info.isArray
                ? gl.uniform3iv(location, value)
                : gl.uniform3i(location, value[0], value[1], value[2]);
        case "bool4":
        case "int4":
            return info.isArray
                ? gl.uniform4iv(location, value)
                : gl.uniform4i(location, value[0], value[1], value[2], value[3]);

        case "uint1":
            return info.isArray ? gl.uniform1uiv(location, value) : gl.uniform1ui(location, value);
        case "uint2":
            return info.isArray
                ? gl.uniform2uiv(location, value)
                : gl.uniform2ui(location, value[0], value[1]);
        case "uint3":
            return info.isArray
                ? gl.uniform3uiv(location, value)
                : gl.uniform3ui(location, value[0], value[1], value[2]);
        case "uint4":
            return info.isArray
                ? gl.uniform4uiv(location, value)
                : gl.uniform4ui(location, value[0], value[1], value[2], value[3]);

        case "matrix2":
            return gl.uniformMatrix2fv(location, false, value);
        case "matrix3":
            return gl.uniformMatrix3fv(location, false, value);
        case "matrix4":
            return gl.uniformMatrix4fv(location, false, value);

        default:
            assert(false, `Unsupported shader type name ${info.dataType}`);
    }
}
