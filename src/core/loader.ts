import { AnyConstructor, Dict } from "src/utils/types";
import { AudioClip } from "./audio_clip";
import { Texture } from "src/renderer/texture/texture";
import { assert, getTypeName } from "src/utils/misc";

type ResourceTypes = Texture | AudioClip;
type ResourceTypeNames = "Texture" | "AudioClip";

/**
 * Used for loading resources such as images. It is automatically created when creating
 * {@link ESSEM.Application} and it can be accesed from `app.loader`.
 *
 * @memberof ESSEM
 */
export class Loader {
    private _audioContext: AudioContext;

    resourceURLs: [ResourceTypeNames, string][] = [];
    loadedResources: Dict<ResourceTypes | undefined> = {};

    constructor(audioContext: AudioContext) {
        this._audioContext = audioContext;
    }

    add(resourceType: AnyConstructor<ResourceTypes> | ResourceTypeNames, url: string): this {
        const resourceTypeName = getTypeName(resourceType) as ResourceTypeNames;
        this.resourceURLs.push([resourceTypeName, url]);
        return this;
    }

    get(url: string): ResourceTypes {
        const resource = this.loadedResources[url];
        assert(resource !== undefined, `Resource at ${url} does not exist or is not loaded yet!`);
        return resource;
    }

    async loadAll(): Promise<void> {
        for (const [resourceTypeName, url] of this.resourceURLs) {
            switch (resourceTypeName) {
                case "AudioClip":
                    this.loadedResources[url] = await AudioClip.fromURL(url, this._audioContext);
                    break;
                case "Texture":
                    this.loadedResources[url] = await Texture.fromURL(url);
            }
        }

        this.resourceURLs = [];
    }
}
