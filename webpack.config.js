module.exports = {
    entry: "./src/index.ts",
    output: {
        filename: "./dist/action-emitter.js",
        libraryTarget: "umd"
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: "ts-loader",
                options: {
                }
            }
        ]
    },
    resolve: {
        extensions: [".ts"]
    },
    externals: {
        "fbemitter": "fbemitter"
    }
};
