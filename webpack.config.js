var webpackTargetElectronRenderer = require('webpack-target-electron-renderer');

var options = {
  entry: './app/main/dev/main.js',
  output: {
    path: './app/main/dist/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'react']
        }
      },
      {
        test: /\.scss$/,
        loader: 'style!css!sass!'
      }
    ]
  }
};

options.target = webpackTargetElectronRenderer(options);

module.exports = options;
