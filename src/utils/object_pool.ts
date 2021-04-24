export type ObjectClassType<T, M = undefined> = new (objectManager: M) => T;

/**
 * @memberof ESSEM
 */
export class ObjectPool<T, M = undefined> {
    objectClass: ObjectClassType<T, M>;
    objectManager: M;
    availableObjects: T[] = [];
    totalObjects: number = 0;

    constructor(objectClass: ObjectClassType<T, M>, objectManager: M) {
        this.objectClass = objectClass;
        this.objectManager = objectManager;
    }

    aquire(): T {
        if (this.availableObjects.length === 0) {
            // resize by 20%
            this.reserve(Math.ceil(this.totalObjects * 1.2) - this.totalObjects);
        }

        const newObject = this.availableObjects.pop();
        return newObject as T;
    }

    release(object: T): void {
        this.availableObjects.push(object);
    }

    reserve(count: number): void {
        for (let i = 0; i < count; i++) {
            this.availableObjects.push(new this.objectClass(this.objectManager));
        }

        this.totalObjects += count;
    }
}
