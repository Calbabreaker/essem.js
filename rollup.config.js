import jscc from "rollup-plugin-jscc";
import dts from "rollup-plugin-dts";
import typescript from "rollup-plugin-typescript2";
import sourcemaps from "rollup-plugin-sourcemaps";
import serve from "rollup-plugin-serve";
import { terser } from "rollup-plugin-terser";

import path from "path";
import pkg from "./package.json";

export default () => {
    const isDev = process.env.DEV || false;
    const useServer = process.env.SERVER || false;

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
        plugins: [
            jscc({
                values: {
                    _DEBUG: isDev,
                    _PRODUCTION: !isDev,
                    _VERSION: pkg.version,
                },
            }),
            sourcemaps(),
            typescript(),
        ],
    };

    if (useServer) {
        baseBundle.plugins.push(
            serve({
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

    bundles.push({
        input: "./src/index.ts",
        output: [{ file: "build/essem.d.ts", format: "es" }],
        plugins: [dts()],
    });

    return bundles;
};
