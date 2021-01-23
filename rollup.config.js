import typescript from "rollup-plugin-typescript2";
import serve from "rollup-plugin-serve";
import path from "path";

export default () => {
    const useDevServer = process.env.DEV_SERVER || false;

    const browserBundle = {
        input: path.join(__dirname, "src/index.ts"),
        output: {
            name: "ESSEM",
            file: path.join(__dirname, "build/essem.js"),
            format: "umd",
        },
        plugins: [typescript()],
    };

    if (useDevServer) {
        browserBundle.plugins.push(
            serve({
                open: true,
                openPage: "/examples/",
                port: 8080,
            })
        );
    }

    return [browserBundle];
};
