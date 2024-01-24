const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  // mode: 'development',
  mode: 'production',
  entry: "./src/index.js",
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      }
    ],
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "build"),
    publicPath: "/digit-ui/",
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
    minimizer: [new TerserPlugin({ /* additional options here */ })],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({ inject: true, template: "public/index.html" }),
  ],
};
