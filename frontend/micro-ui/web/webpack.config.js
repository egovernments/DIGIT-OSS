const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  // mode: 'development',
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
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "build"),
    publicPath: "/workbench-ui/",
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize:20000,
      maxSize:50000,
      enforceSizeThreshold:50000,
      minChunks:1,
      maxAsyncRequests:30,
      maxInitialRequests:30
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    // new BundleAnalyzerPlugin(),
    new HtmlWebpackPlugin({ inject: true, template: "public/index.html" }),
  ],
};