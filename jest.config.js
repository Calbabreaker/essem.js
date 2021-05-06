module.exports = {
    preset: "ts-jest/presets/js-with-ts",
    runner: "jest-electron/runner",
    testEnvironment: "jest-electron/environment",
    modulePaths: ["./"],
    verbose: true,
    transform: {
        "\\.glsl$": "jest-raw-loader",
    },
};
