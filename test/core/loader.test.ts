import { Texture } from "src/renderer/texture/texture";
import { Loader } from "src/core/loader";
import { AudioClip } from "src/core/audio_clip";

describe("ESSEM.Loader", () => {
    const audioContext = new AudioContext();

    test("should generate Loader", () => {
        const loader = new Loader(audioContext);

        expect(loader.loadedResources).toMatchObject({});
        expect(loader.resourceURLs.length).toBe(0);
    });

    test("add()", () => {
        const loader = new Loader(audioContext);

        loader.add(Texture, "somewhere");
        loader.add(AudioClip, "somewhere");

        expect(loader.loadedResources).toMatchObject({});
        expect(loader.resourceURLs[0]).toMatchObject(["Texture", "somewhere"]);
        expect(loader.resourceURLs[1]).toMatchObject(["AudioClip", "somewhere"]);
    });

    test("loadAll()", async () => {
        const loader = new Loader(audioContext);

        const texturePath = require.resolve("../../examples/assets/blobfish.jpg");
        const audioPath = require.resolve("../../examples/assets/shoot.wav");
        loader.add(Texture, texturePath);
        loader.add(AudioClip, audioPath);
        await loader.loadAll();

        expect(loader.loadedResources[texturePath]).toBeInstanceOf(Texture);
        expect(loader.loadedResources[audioPath]).toBeInstanceOf(AudioClip);
        expect(loader.resourceURLs.length).toBe(0);
    });

    test("get()", async () => {
        const loader = new Loader(audioContext);

        const texturePath = require.resolve("../../examples/assets/blobfish.jpg");
        const audioPath = require.resolve("../../examples/assets/shoot.wav");
        loader.add(Texture, texturePath);
        loader.add(AudioClip, audioPath);
        await loader.loadAll();

        expect(loader.get(texturePath)).toBeInstanceOf(Texture);
        expect(loader.get(audioPath)).toBeInstanceOf(AudioClip);
        expect(() => loader.get("UnknownResource")).toThrow();
        expect(loader.resourceURLs.length).toBe(0);
    });
});
