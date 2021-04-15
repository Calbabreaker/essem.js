import { assert } from "src/utils/misc";

export class AudioClip {
    volume: number = 1;
    loop: boolean = false;
    playing: boolean = false;

    readonly buffer: AudioBuffer;
    source: AudioBufferSourceNode | null = null;
    gain: GainNode | null = null;

    private _context: AudioContext;

    constructor(buffer: AudioBuffer, context: AudioContext) {
        this.buffer = buffer;
        this._context = context;
    }

    static async fromURL(url: string, context: AudioContext): Promise<AudioClip> {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const decodedAudio = await context.decodeAudioData(arrayBuffer);
        return new AudioClip(decodedAudio, context);
    }

    play(): void {
        const source = this._context.createBufferSource();
        source.buffer = this.buffer;
        source.start(this._context.currentTime);
        source.loop = this.loop;
        source.onended = () => (this.playing = false);

        const gain = this._context.createGain();
        source.connect(gain);
        gain.connect(this._context.destination);
        gain.gain.value = this.volume;

        this.playing = true;
        this.source = source;
        this.gain = gain;
    }

    stop(): void {
        assert(this.source !== null, "Can't stop when the audio clip has not started.");
        this.source.stop(this._context.currentTime);
    }

    toggle(): void {
        this.playing ? this.stop() : this.play();
    }
}
