import { assert } from "./misc";

/**
 * A pool of objects to pre instanced and quickly aquire from.
 *
 * @memberof ESSEM
 */
export class ObjectPool<T> {
    availableObjects: T[] = [];
    totalObjects = 0;

    /**
     * Aquires an pre instanced object from the pool. If there are no available objects
     * then the pool will grow by 20%.
     *
     * @return The object that was aquired.
     */
    aquire(): T {
        if (this.availableObjects.length === 0) {
            // resize by 20% or 1
            this.reserve(Math.min(Math.ceil(this.totalObjects * 1.2) - this.totalObjects, 1));
        }

        const newObject = this.availableObjects.pop();
        return newObject as T;
    }

    release(object: T): void {
        this.availableObjects.push(object);
    }

    /**
     * Populates the pool with new object instances (created from this.newObject())
     * with a specified amount.
     *
     * @param count - Number of new objects to fill the pool with.
     */
    reserve(count: number): void {
        assert(this.newObject, `Did not defined method 'newObject' for ObjectPool!`);
        for (let i = 0; i < count; i++) {
            this.availableObjects.push(this.newObject());
        }

        this.totalObjects += count;
    }

    /**
     * Function returning a new instance of an object needed to populate the pool.
     *
     * @return A new instance of an object.
     */
    newObject?(): T;
}
