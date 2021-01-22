import typescript from "rollup-plugin-typescript2";
import path from "path";

export default {
    input: path.join(__dirname, "src/index.ts"),
    output: {
        name: "essem",
        file: path.join(__dirname, "dist/essem.js"),
        format: "umd",
    },
    plugins: [typescript()],
};
