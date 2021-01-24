export class Application {
    constructor() {}

    test(): void {
        console.log("Testing");
    }
    // #if _DEBUG
    testDebug(): void {
        console.log("haha");
    }
    // #endif
}
