const path = require('path');

module.exports = {
  entry: './src/module.js',
  output: {
    path: path.resolve(__dirname, 'dists'),
    filename: 'index.modern.js',
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
  

};