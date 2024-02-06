const tsJest = require("ts-jest");
const tsTransformer = new tsJest.TsJestTransformer();

module.exports = {
    process(src, filename, ...rest) {
        return tsTransformer.process(
            `export default ${JSON.stringify(src)}`,
            filename.replace(".glsl", ".ts"),
            ...rest
        );
    },
};
