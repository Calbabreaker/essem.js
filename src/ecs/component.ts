import { assert } from "src/utils/misc";

export abstract class Component<T> {
    static schema?: T;
    static _schemaFields?: string[];

    _setup(properties: T) {
        this.contructor.getFields().forEach((field) => {
            component[field] = properties[field];
        });
    }

    static getFields(): string[] {
        if (!this._schemaFields) {
            assert(this.schema, `No defined schema for ${this.name}`);
            this._schemaFields = Object.keys(this.schema);
        }

        return this._schemaFields;
    }
}
