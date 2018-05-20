const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const isProd = process.env.NODE_ENV === "production";

module.exports = {
    mode: isProd ? "production" : "development",
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: ["babel-loader", "ts-loader"]
            },
            {
                test: /\.s[ac]ss$/,
                use: ["style-loader", "css-loader", "sass-loader"]
            }
        ]
    },
    devtool: "source-map",
    externals: {
        "react": "React",
        "react-dom": "ReactDOM"
    },
    plugins: [
        new HtmlWebpackPlugin({ template: "./src/index.html" }),
        new CopyWebpackPlugin([
            {
                from: isProd
                    ? "node_modules/react/umd/react.production.min.js"
                    : "node_modules/react/umd/react.development.js",
                to: "lib/react.js"
            },
            {
                from: isProd
                    ? "node_modules/react-dom/umd/react-dom.production.min.js"
                    : "node_modules/react-dom/umd/react-dom.development.js",
                to: "lib/react-dom.js"
            }
        ])
    ],
    output: {
        filename: isProd ? "[name].[chunkhash].js" : "[name].js",
        path: path.resolve(__dirname, "wwwroot/dist"),
        publicPath: "/dist/"
    }
};