import { Texture } from "../renderer/texture";

/**
 * Used for loading resources such as images. It is automatically created when creating
 * {@link ESSEM.Application} and it can be accesed from `app.loader`.
 *
 * @memberof ESSEM
 */
export class Loader {
    imagePaths: string[] = [];
    resources: { [key: string]: Texture } = {};

    add(imagePath: string): this {
        this.imagePaths.push(imagePath);
        return this;
    }

    async loadAll(): Promise<void> {
        for (const path of this.imagePaths) {
            const texture = await Texture.fromURL(path);
            this.resources[path] = texture;
        }

        this.imagePaths = [];
    }
}
