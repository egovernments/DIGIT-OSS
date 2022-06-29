const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.modern.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|mjs)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            babelrcRoots: ['../*']
          }
        }
      },
      
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      }
    ]
  }
  

};