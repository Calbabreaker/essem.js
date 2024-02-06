/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import { assert } from "src/utils/misc";
import { ArrayTypes } from "src/utils/types";

export type ShaderDataTypes =
    | "float1"
    | "float2"
    | "float3"
    | "float4"
    | "int1"
    | "int2"
    | "int3"
    | "int4"
    | "uint1"
    | "uint2"
    | "uint3"
    | "uint4"
    | "bool1"
    | "bool2"
    | "bool3"
    | "bool4"
    | "matrix2"
    | "matrix3"
    | "matrix4";

export interface IShaderInfo {
    dataType: ShaderDataTypes;
    name: string;
    isArray: boolean;
    size: number;
}

export function glslToShaderDataType(glslType: number): ShaderDataTypes {
    const GL = WebGL2RenderingContext;
    // prettier-ignore
    switch (glslType) {
        case GL.FLOAT: return "float1";
        case GL.FLOAT_VEC2: return "float2";
        case GL.FLOAT_VEC3: return "float3";
        case GL.FLOAT_VEC4: return "float4";

        case GL.INT: return "int1";
        case GL.INT_VEC2: return "int2";
        case GL.INT_VEC3: return "int3";
        case GL.INT_VEC4: return "int4";

        case GL.UNSIGNED_INT: return "uint1";
        case GL.UNSIGNED_INT_VEC2: return "uint2";
        case GL.UNSIGNED_INT_VEC3: return "uint3";
        case GL.UNSIGNED_INT_VEC4: return "uint4";

        case GL.BOOL: return "bool1";
        case GL.BOOL_VEC2: return "bool2";
        case GL.BOOL_VEC3: return "bool3";
        case GL.BOOL_VEC4: return "bool4";

        case GL.FLOAT_MAT2: return "matrix2";
        case GL.FLOAT_MAT3: return "matrix3";
        case GL.FLOAT_MAT4: return "matrix4";

        case GL.SAMPLER_2D:      
        case GL.INT_SAMPLER_2D:        
        case GL.UNSIGNED_INT_SAMPLER_2D:
        case GL.SAMPLER_CUBE:          
        case GL.INT_SAMPLER_CUBE:          
        case GL.UNSIGNED_INT_SAMPLER_CUBE:
        case GL.SAMPLER_2D_ARRAY:        
        case GL.INT_SAMPLER_2D_ARRAY:   
        case GL.UNSIGNED_INT_SAMPLER_2D_ARRAY: return "int1";

        default: assert(false, "Invalid glslType!");
    }
}

/**
 * Figures out the default value of the shader data type.
 *
 * @param dataType - The shader data type to calculate.
 * @param isArray - If the data type is an array.
 * @param count - The component count of the data type multiplied by the size of the array (1 if it
 *        isn't).
 * @return The default value for shader data type.
 *
 * @memberof ESSEM
 */
export function shaderDataTypeDefaultValue(
    dataType: ShaderDataTypes,
    isArray: boolean,
    count: number,
): ArrayTypes | number | boolean {
    /* eslint-disable no-fallthrough */
    // prettier-ignore
    switch (dataType) {
        // if it is an array then it will fall to case "float4":
        case "float1": if (!isArray) return 0;
        case "float2": 
        case "float3": 
        case "float4": return new Float32Array(count);
        
        case "int1": if (!isArray) return 0;
        case "int2": 
        case "int3": 
        case "int4": return new Int32Array(count);

        case "uint1": if (!isArray) return 0;
        case "uint2":  
        case "uint3": 
        case "uint4": return new Uint32Array(count);

        case "bool1": if (!isArray) return false;
        case "bool2": 
        case "bool3":
        case "bool4": return new Array(count).fill(false);

        case "matrix2":
            return new Float32Array([
                1, 0,
                0, 1
            ]);

        case "matrix3":
            return new Float32Array([
                1, 0, 0,
                0, 1, 0,
                0, 0, 1
            ]);

        case "matrix4":
            return new Float32Array([
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ]);
    }
    /* eslint-enable no-fallthrough */
}

export function shaderDataTypeSize(dataType: ShaderDataTypes): number {
    // prettier-ignore
    switch (dataType) {
        case "int1":
        case "uint1":
        case "float1": return 4;

        case "int2":
        case "uint2":
        case "float2": return 4 * 2;

        case "int3":
        case "uint3":
        case "float3": return 4 * 3;

        case "int4":
        case "uint4":
        case "float4": return 4 * 4;

        case "bool1": return 1;
        case "bool2": return 2;
        case "bool3": return 3;
        case "bool4": return 4;

        case "matrix2": return 4 * 2 * 2;
        case "matrix3": return 4 * 3 * 3;
        case "matrix4": return 4 * 4 * 4;
    }
}

export function shaderDataTypeToWebGLType(dataType: ShaderDataTypes): number {
    const GL = WebGL2RenderingContext;

    switch (dataType) {
        case "matrix2":
        case "matrix3":
        case "matrix4":
        case "float1":
        case "float2":
        case "float3":
        case "float4":
            return GL.FLOAT;

        case "int1":
        case "int2":
        case "int3":
        case "int4":
        case "uint1":
        case "uint2":
        case "uint3":
        case "uint4":
            return GL.INT;

        case "bool1":
        case "bool2":
        case "bool3":
        case "bool4":
            return GL.BOOL;
    }
}
