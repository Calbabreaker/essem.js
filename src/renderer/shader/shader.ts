import { Dict } from "src/utils/types";
import { GLProgram } from "./gl_program";
import { UniformGroup, UniformTypes } from "./uniforms";

/**
 * Class for interacting with gl shaders.
 *
 * @memberof ESSEM
 */
export class Shader {
    vertexSrc: string;
    fragmentSrc: string;
    name: string;
    uniformGroup = new UniformGroup();

    glPrograms: Dict<GLProgram | undefined> = {};

    constructor(vertexSrc: string, fragmentSrc: string, name = "Default") {
        this.vertexSrc = vertexSrc;
        this.fragmentSrc = fragmentSrc;
        this.name = name;
    }

    get uniforms(): Dict<UniformTypes> {
        return this.uniformGroup.uniforms;
    }
}
