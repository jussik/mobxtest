const CopyWebpackPlugin = require("copy-webpack-plugin");
module.exports = {
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },
    module: {
        rules: [
            { test: /\.tsx?$/, loader: "ts-loader" }
        ]
    },
    devtool: "source-map",
    externals: {
        "react": "React",
        "react-dom": "ReactDOM"
    },
    plugins: [new CopyWebpackPlugin([
        "src/index.html",
        { from: "node_modules/react/umd/react.development.js", to: "lib/react.js" },
        { from: "node_modules/react-dom/umd/react-dom.development.js", to: "lib/react-dom.js" }
    ])]
};