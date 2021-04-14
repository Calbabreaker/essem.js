import { AnyCtor } from "utils/types";
import { Texture } from "renderer/texture";
import { AudioClip } from "./audio_clip";

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

    resourceURLs: Map<ResourceTypeNames, string> = new Map();
    resources: { [key: string]: ResourceTypes } = {};

    constructor(audioContext: AudioContext) {
        this._audioContext = audioContext;
    }

    add(resourceType: AnyCtor<ResourceTypes> | ResourceTypeNames, url: string): this {
        const resourceTypeName = (resourceType as AnyCtor<ResourceTypes>).name ?? resourceType;
        this.resourceURLs.set(resourceTypeName as ResourceTypeNames, url);
        return this;
    }

    async loadAll(): Promise<void> {
        for (const [resourceTypeName, url] of this.resourceURLs) {
            switch (resourceTypeName) {
                case "AudioClip":
                    this.resources[url] = await AudioClip.fromURL(url, this._audioContext);
                    break;
                case "Texture":
                    this.resources[url] = await Texture.fromURL(url);
            }
        }
    }
}
