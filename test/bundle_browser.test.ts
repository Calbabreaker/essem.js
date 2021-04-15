// will test the browser bundle
// make sure it's built first before running the test

const testFunc = (description: string, file: string) => {
    describe(description, () => {
        const script = document.createElement("script");

        beforeAll((done) => {
            script.onload = () => done();
            script.src = require.resolve(file);
            document.head.appendChild(script);
        });

        test("ESSEM should exist as a global object", () => {
            expect(window.ESSEM).toBeInstanceOf(Object);
            expect(window.__ESSEM__).toBe(true);
            expect(typeof window.ESSEM.VERSION).toBe("string");
            document.head.removeChild(script);
            window.__ESSEM__ = false;
            window.ESSEM = {};
        });
    });
};

describe("Bundle browser", () => {
    testFunc("Unminified", "../build/essem.js");
    testFunc("Minified", "../build/essem.min.js");
});
