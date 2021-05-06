import { Dict } from "src/utils/types";
import { GLProgram } from "./gl_program";
import { IShaderInfo } from "./shader_utils";
import { UniformTypes } from "./uniforms";

let uidCounter = 0;

/**
 * Class for interacting with gl shaders.
 *
 * @memberof ESSEM
 */
export class Shader {
    vertexSrc: string;
    fragmentSrc: string;
    name: string;
    id: string;

    attributeInfos: IShaderInfo[] | undefined;
    uniformInfos: IShaderInfo[] | undefined;
    uniforms: Dict<UniformTypes> = {};

    glPrograms: Dict<GLProgram | undefined> = {};

    constructor(vertexSrc: string, fragmentSrc: string, name = "Unnamed") {
        this.vertexSrc = vertexSrc;
        this.fragmentSrc = fragmentSrc;
        this.name = name;
        this.id = (uidCounter++).toString();
    }
}
