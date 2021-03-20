// caches the result from webgl2Supported function
let webgl2Supported: boolean | undefined;

export function isWebGL2Supported(): boolean {
    if (webgl2Supported === undefined) {
        const canvasElm = document.createElement("canvas");
        const gl = canvasElm.getContext("webgl2");

        webgl2Supported = gl !== undefined;
    }

    return webgl2Supported;
}

let saidHello = false;

export function sayHello(): void {
    if (!saidHello) {
        console.log("---\n--- essem.js v$_VERSION\n---");
        saidHello = true;
    }
}

export function skipHello(): void {
    saidHello = true;
}
