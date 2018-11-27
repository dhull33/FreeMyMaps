const path = require('path');
// const CopyPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  mode: 'development',
  entry: [path.resolve(__dirname, 'public/javascripts/maps/maps.js')],
  output: {
    path: path.resolve(__dirname, 'public/javascripts/maps/build/'),
    filename: '[name].maps.js'
  },
  
  // Enable sourcemaps for debugging webpack's output.
  devtool: 'source-map',
  plugins: [new Dotenv()],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
};
