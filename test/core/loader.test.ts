import { Texture } from "src/renderer/texture";
import { Loader } from "src/core/loader";
import { AudioClip } from "src/core/audio_clip";

describe("ESSEM.Loader", () => {
    const audioContext = new AudioContext();

    test("should generate Loader", () => {
        const loader = new Loader(audioContext);

        expect(loader.resources).toMatchObject({});
        expect(loader.resourceURLs.length).toBe(0);
    });

    test("should add resource", () => {
        const loader = new Loader(audioContext);

        loader.add(Texture, "somewhere");
        loader.add(AudioClip, "somewhere");

        expect(loader.resources).toMatchObject({});
        expect(loader.resourceURLs[0]).toMatchObject(["Texture", "somewhere"]);
        expect(loader.resourceURLs[1]).toMatchObject(["AudioClip", "somewhere"]);
    });

    test("should load images and sounds", async () => {
        const loader = new Loader(audioContext);

        const texturePath = require.resolve("../../examples/assets/blobfish.jpeg");
        const audioPath = require.resolve("../../examples/assets/shoot.wav");
        loader.add(Texture, texturePath);
        loader.add(AudioClip, audioPath);
        await loader.loadAll();

        expect(loader.resources[texturePath]).toBeInstanceOf(Texture);
        expect(loader.resources[audioPath]).toBeInstanceOf(AudioClip);
        expect(loader.resourceURLs.length).toBe(0);
    });
});
