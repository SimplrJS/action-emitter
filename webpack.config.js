module.exports = {
    entry: "./src/index.ts",
    output: {
        filename: "./dist/action-emitter.js",
        libraryTarget: "commonjs"
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: "ts-loader",
                options: {
                    transpileOnly: true
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