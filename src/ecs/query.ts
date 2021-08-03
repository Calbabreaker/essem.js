import {Entity} from "./entity"

export class Query {
    typeNames: string[];
    entities: Entity[];

    constructor(typeNames: string[]) {
        this.typeNames = typeNames;
        this.entities = [];
    }
}
