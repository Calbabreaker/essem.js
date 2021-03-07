export class AssertionError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = "AssertionError";
    }
}

export function assert(value: any, message?: string): asserts value {
    if (!value) throw new AssertionError(message);
}
