export class Application {
    constructor() {
        // nothing for now
    }

    test(): void {
        console.log("Testing");
    }
    // #if _DEBUG
    testDebug(): void {
        console.log("haha");
    }
    // #endif
}
