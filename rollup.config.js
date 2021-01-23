import typescript from "rollup-plugin-typescript2";
import sourcemaps from "rollup-plugin-sourcemaps";
import serve from "rollup-plugin-serve";
import { terser } from "rollup-plugin-terser";

import path from "path";
import pkg from "./package.json";

export default () => {
    const useDevServer = process.env.DEV_SERVER || false;

    const date = new Date().toUTCString();
    const banner = [
        `/*!`,
        ` * ${pkg.name} - v${pkg.version}`,
        ` * Compiled ${date}`,
        ` *`,
        ` * Free to use under the ${pkg.license} LICENSE.`,
        ` */`,
    ].join("\n");

    const baseBundle = {
        input: path.join(__dirname, "src/index.ts"),
        output: {
            sourcemap: true,
            banner,
            name: "ESSEM",
        },
        plugins: [typescript(), sourcemaps()],
    };

    if (useDevServer) {
        baseBundle.plugins.push(
            serve({
                open: true,
                openPage: "/examples/",
                port: 8080,
            })
        );
    }

    const bundles = [];

    // unminified for browser
    bundles.push({
        ...baseBundle,
        output: {
            ...baseBundle.output,
            file: path.join(__dirname, "build/essem.js"),
            format: "umd",
        },
    });

    // minified for browser
    bundles.push({
        ...baseBundle,
        output: {
            ...baseBundle.output,
            file: path.join(__dirname, "build/essem.min.js"),
            format: "umd",
        },
        plugins: [...baseBundle.plugins, terser()],
    });

    // for modules
    bundles.push({
        ...baseBundle,
        output: {
            ...baseBundle.output,
            file: path.join(__dirname, "build/essem.module.js"),
            format: "esm",
        },
    });

    return bundles;
};
