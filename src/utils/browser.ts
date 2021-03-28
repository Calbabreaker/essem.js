// caches the result from webgl2Supported function
let webgl2Supported: boolean | undefined;

/**
 * Checks to see if WebGL2 is supported in the browser.
 *
 * @memberof ESSEM
 * @return Whether or not WebGL2 is supported.
 */
export function isWebGL2Supported(): boolean {
    if (webgl2Supported === undefined) {
        const canvasElm = document.createElement("canvas");
        const gl = canvasElm.getContext("webgl2");

        webgl2Supported = gl !== undefined;
    }

    return webgl2Supported;
}

let saidHello = false;

/**
 * Says hello in essem.js style. Gets called once when the application finishes initiating.
 *
 * @memberof ESSEM
 */
export function sayHello(): void {
    if (!saidHello) {
        console.log("---\n--- essem.js v$_VERSION\n---");
        saidHello = true;
    }
}

/**
 * Skips the essem.js hello. Don't call this or else you will have bad luck forever.
 *
 * @memberof ESSEM
 */
export function skipHello(): void {
    saidHello = true;
}
