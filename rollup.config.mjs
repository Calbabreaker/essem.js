import dts from "rollup-plugin-dts";
import glsl from "rollup-plugin-glsl";
import replace from "rollup-plugin-re";
import serve from "rollup-plugin-serve";
import sourcemaps from "rollup-plugin-sourcemaps";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";

import path from "path";
import pkg from "./package.json" with { type: "json" };

export default () => {
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
        input: path.join(import.meta.dirname, "src/index.ts"),
        output: {
            sourcemap: true,
            banner,
            name: "ESSEM",
        },
        plugins: [
            typescript(),
            replace({
                include: "src/**/*.ts",
                replaces: {
                    $_VERSION: pkg.version,
                },
            }),
            glsl({
                include: "src/**/*.glsl",
            }),
            sourcemaps(),
        ],
    };

    const minifiedBundle = {
        ...baseBundle,
        plugins: [
            ...baseBundle.plugins,
            // this is to remove weird Microsoft copyright notice but keep our own
            terser({ format: { comments: /^!(?![\s\S]+Microsoft)/ } }),
            // removes all assert functions
            replace({
                patterns: [
                    {
                        test: /^[ \t]*assert.*\(.*\)[ \t]*(;|$)/gm,
                        replace: "",
                    },
                ],
            }),
        ],
    };

    const bundles = [];

    // unminified for browser
    bundles.push({
        ...baseBundle,
        output: {
            ...baseBundle.output,
            file: path.join(import.meta.dirname, "build/essem.js"),
            format: "umd",
        },
    });

    if (useServer) {
        bundles[0].plugins.push(
            serve({
                port: 8080,
            })
        );
    } else {
        // minified for browser
        bundles.push({
            ...minifiedBundle,
            output: {
                ...minifiedBundle.output,
                file: path.join(import.meta.dirname, "build/essem.min.js"),
                format: "umd",
            },
        });

        // unminified for modules
        bundles.push({
            ...baseBundle,
            output: {
                ...baseBundle.output,
                file: path.join(import.meta.dirname, "build/essem.module.js"),
                format: "esm",
                sourcemap: false,
            },
        });

        // minified for modules
        bundles.push({
            ...minifiedBundle,
            output: {
                ...minifiedBundle.output,
                file: path.join(import.meta.dirname, "build/essem.module.min.js"),
                format: "esm",
            },
        });

        // type declarations
        bundles.push({
            ...baseBundle,
            output: {
                ...baseBundle.output,
                file: "build/essem.d.ts",
                format: "es",
                sourcemap: false,
            },
            plugins: [dts({ compilerOptions: { baseUrl: "./" } })],
        });
    }

    return bundles;
};
