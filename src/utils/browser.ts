let saidHello = false;

/**
 * Says hello in essem.js style. Gets called once when the application finishes initiating.
 *
 * @memberof ESSEM
 */
export function sayHello(): void {
    if (!saidHello) {
        const banner = "essem.js ⚒️⚒️⚒️ v$_VERSION";
        const border = `-${"-".repeat(banner.length)}--`;
        console.log(
            `%c${border}\n- %c ${banner} %c -\n${border}`,
            "background-color: #f0f010;",
            "background-color: #000; color: #afa92f;",
            "background-color: #f0f010;"
        );

        saidHello = true;
    }
}

/**
 * Skips the essem.js hello message.
 *
 * @memberof ESSEM
 */
export function skipHello(): void {
    saidHello = true;
}
