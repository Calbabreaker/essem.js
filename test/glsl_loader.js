const tsTransformer = require("ts-jest").createTransformer();

module.exports = {
    process(src, filename, ...rest) {
        return tsTransformer.process(
            `export default ${JSON.stringify(src)}`,
            filename.replace(".glsl", ".ts"),
            ...rest
        );
    },
};
