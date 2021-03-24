import { Texture } from "../renderer/texture";

export class Loader {
    imagePaths: string[] = [];
    resources: { [key: string]: Texture } = {};

    constructor() {}

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
