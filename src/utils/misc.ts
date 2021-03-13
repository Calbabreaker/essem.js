export class AssertionError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = "AssertionError";
    }
}

export function assert(condition: boolean, message?: string): asserts condition {
    if (!condition) throw new AssertionError(message);
}

export function isEmpty(obj: Record<string, unknown> | null | undefined): boolean {
    return obj != null && Object.keys(obj).length === 0 && obj.constructor === Object;
}
