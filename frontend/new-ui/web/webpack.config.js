const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
var UnminifiedWebpackPlugin = require("unminified-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
    ],
  },
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "build"),
  },
  plugins: [
    // new UnminifiedWebpackPlugin(),
    // new webpack.SourceMapDevToolPlugin({}),
    new HtmlWebpackPlugin(),
  ],
};
