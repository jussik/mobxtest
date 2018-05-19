const CopyWebpackPlugin = require("copy-webpack-plugin");
console.log(process.env.NODE_ENV);
module.exports = {
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
    plugins: [new CopyWebpackPlugin([
        "src/index.html",
        {
            from: process.env.NODE_ENV === "production" ? "node_modules/react/umd/react.production.min.js" : "node_modules/react/umd/react.development.js",
            to: "lib/react.js"
        },
        {
            from: process.env.NODE_ENV === "production" ? "node_modules/react-dom/umd/react-dom.production.min.js" : "node_modules/react-dom/umd/react-dom.development.js",
            to: "lib/react-dom.js"
        }
    ])]
};