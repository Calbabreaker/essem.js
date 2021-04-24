/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import { assert } from "src/utils/misc";
import { ArrayTypes } from "src/utils/types";

export interface ShaderDataDict<T = string> {
    float1: T;
    float2: T;
    float3: T;
    float4: T;
    int1: T;
    int2: T;
    int3: T;
    int4: T;
    uint1: T;
    uint2: T;
    uint3: T;
    uint4: T;
    bool1: T;
    bool2: T;
    bool3: T;
    bool4: T;
    matrix2: T;
    matrix3: T;
    matrix4: T;
}

export function glslToShaderDataType(glslType: number): keyof ShaderDataDict {
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
 * @param size - The component count of the data type multiplied by the size of the array (1 if it
 *        isn't).
 * @return The default value for shader data type.
 *
 * @memberof ESSEM
 */
export function shaderDataTypeDefaultValue(
    dataType: keyof ShaderDataDict,
    isArray: boolean,
    size: number
): ArrayTypes | number | boolean {
    /* eslint-disable no-fallthrough */
    // prettier-ignore
    switch (dataType) {
        // if it is an array then it will fall to case "float4":
        case "float1": if (!isArray) return 0;
        case "float2": 
        case "float3": 
        case "float4": return new Float32Array(size);
        
        case "int1": if (!isArray) return 0;
        case "int2": 
        case "int3": 
        case "int4": return new Int32Array(size);

        case "uint1": if (!isArray) return 0;
        case "uint2":  
        case "uint3": 
        case "uint4": return new Uint32Array(size);

        case "bool1": if (!isArray) return false;
        case "bool2": 
        case "bool3":
        case "bool4": return new Array(size).fill(false);

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
